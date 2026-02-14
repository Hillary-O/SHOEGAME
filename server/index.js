const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Validate required environment variables early
function validateEnv() {
  const required = ['CONSUMER_KEY', 'CONSUMER_SECRET', 'BUSINESS_SHORTCODE', 'PASSKEY', 'CALLBACK_URL'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length) {
    console.error('Missing required environment variables:', missing.join(', '));
    console.error('Copy server/.env.example to server/.env and fill the values.');
    process.exit(1);
  }
}

// Only validate when running (prevents exit during static analysis)
validateEnv();

const SANDBOX = process.env.SANDBOX !== 'false';
const BASE_URL = SANDBOX ? 'https://sandbox.safaricom.co.ke' : 'https://api.safaricom.co.ke';

async function getAccessToken() {
  const key = process.env.CONSUMER_KEY;
  const secret = process.env.CONSUMER_SECRET;
  const tokenUrl = `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;
  const auth = Buffer.from(`${key}:${secret}`).toString('base64');
  const res = await axios.get(tokenUrl, { headers: { Authorization: `Basic ${auth}` } });
  return res.data.access_token;
}

const fs = require('fs');
const path = require('path');
const LOG_DIR = path.join(__dirname, 'logs');
const CALLBACK_LOG = path.join(LOG_DIR, 'callbacks.log');
const TX_DB = path.join(LOG_DIR, 'transactions.json');

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
if (!fs.existsSync(TX_DB)) fs.writeFileSync(TX_DB, JSON.stringify([]));

function timestamp() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${y}${m}${day}${hh}${mm}${ss}`;
}

app.post('/api/mpesa/stkpush', async (req, res) => {
  try {
    const { amount, phone } = req.body;
    if (!amount || !phone) return res.status(400).json({ error: 'amount and phone required' });

    // normalize phone number to 2547XXXXXXXX
    const normalizePhone = (p) => {
      let s = String(p).trim();
      if (s.startsWith('+')) s = s.slice(1);
      if (s.startsWith('0')) s = '254' + s.slice(1);
      if (s.startsWith('7')) s = '254' + s;
      return s;
    };
    const normalizedPhone = normalizePhone(phone);

    const token = await getAccessToken();

    // allow optional payTo override from client (useful for testing)
    let shortcode = process.env.BUSINESS_SHORTCODE; // merchant till or shortcode
    if (req.body.payTo) {
      const candidate = String(req.body.payTo).trim();
      if (/^\d{4,12}$/.test(candidate)) {
        shortcode = candidate;
      } else {
        return res.status(400).json({ error: 'Invalid payTo format' });
      }
    }
    const passkey = process.env.PASSKEY; // Lipa Na M-Pesa Online passkey
    const time = timestamp();
    const password = Buffer.from(shortcode + passkey + time).toString('base64');

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: time,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: normalizedPhone,
      PartyB: shortcode,
      PhoneNumber: normalizedPhone,
      CallBackURL: process.env.CALLBACK_URL,
      AccountReference: process.env.ACCOUNT_REFERENCE || 'SHOEGAME',
      TransactionDesc: `Payment for SHOEGAME order`
    };

    const stkUrl = `${BASE_URL}/mpesa/stkpush/v1/processrequest`;
    const resp = await axios.post(stkUrl, payload, { headers: { Authorization: `Bearer ${token}` } });
    return res.json(resp.data);
  } catch (err) {
    const errData = err?.response?.data || err?.message || String(err);
    console.error('STK Push error', errData);
    try {
      const errEntry = { time: new Date().toISOString(), error: errData };
      fs.appendFileSync(path.join(LOG_DIR, 'stk_errors.log'), JSON.stringify(errEntry) + '\n');
    } catch (e) {
      console.error('Failed to write stk error log', e);
    }
    return res.status(500).json({ error: 'STK Push failed', details: errData });
  }
});

// Callback endpoint for Safaricom to notify transaction result
app.post('/api/mpesa/callback', (req, res) => {
  const payload = req.body || {};
  try {
    // Log raw payload
    const entry = { time: new Date().toISOString(), payload };
    fs.appendFileSync(CALLBACK_LOG, JSON.stringify(entry) + '\n');
    console.log('MPesa callback received and logged');

    // Try to parse STK callback result if present
    const stk = payload?.Body?.stkCallback || payload?.stkCallback || null;
    if (stk) {
      const resultCode = stk?.ResultCode;
      const resultDesc = stk?.ResultDesc || '';
      const checkoutRequestID = stk?.CheckoutRequestID || stk?.CheckoutRequestID;

      if (resultCode === 0) {
        // success — save minimal transaction record
        const mpesaReceipt = stk?.CallbackMetadata?.Item?.find?.(i => i.Name === 'MpesaReceiptNumber')?.Value || null;
        const amount = stk?.CallbackMetadata?.Item?.find?.(i => i.Name === 'Amount')?.Value || null;
        const phone = stk?.CallbackMetadata?.Item?.find?.(i => i.Name === 'PhoneNumber')?.Value || null;

        const txs = JSON.parse(fs.readFileSync(TX_DB));
        txs.push({ id: checkoutRequestID || Date.now().toString(), status: 'SUCCESS', amount, phone, receipt: mpesaReceipt, raw: stk, time: new Date().toISOString() });
        fs.writeFileSync(TX_DB, JSON.stringify(txs, null, 2));
        console.log('STK Push success recorded:', checkoutRequestID);
      } else {
        // failure — record for investigation
        const txs = JSON.parse(fs.readFileSync(TX_DB));
        txs.push({ id: stk?.CheckoutRequestID || Date.now().toString(), status: 'FAILED', code: resultCode, desc: resultDesc, raw: stk, time: new Date().toISOString() });
        fs.writeFileSync(TX_DB, JSON.stringify(txs, null, 2));
        console.log('STK Push failed recorded:', resultCode, resultDesc);
      }
    }

    res.json({ status: 'received' });
  } catch (e) {
    console.error('Error handling callback', e);
    res.status(500).json({ status: 'error' });
  }
});

// Debug: return current OAuth token (helpful for diagnosing credential issues)
app.get('/api/mpesa/token', async (req, res) => {
  try {
    const token = await getAccessToken();
    res.json({ token });
  } catch (e) {
    console.error('Token error', e?.response?.data || e.message || e);
    res.status(500).json({ error: 'Token fetch failed', details: e?.response?.data || e.message });
  }
});

// Debug: list recorded transactions
app.get('/api/mpesa/transactions', (req, res) => {
  try {
    const txs = JSON.parse(fs.readFileSync(TX_DB));
    res.json(txs.slice(-50));
  } catch (e) {
    res.status(500).json({ error: 'Unable to read transactions' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`MPesa server listening on ${PORT}`));
