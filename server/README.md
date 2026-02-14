# SHOEGAME M-Pesa Server

Quick steps to run the server locally (sandbox):

1. Copy `.env.example` to `.env` and fill in your `CONSUMER_KEY`, `CONSUMER_SECRET`, `BUSINESS_SHORTCODE`, `PASSKEY` and `CALLBACK_URL`.
2. Install deps and start the server from the `server` folder:

```bash
cd server
npm install
npm start
```

3. For local testing expose the callback endpoint with `ngrok http 3000` and set `CALLBACK_URL` to the ngrok URL plus `/api/mpesa/callback`.

4. Open the site and trigger a payment (frontend hook posts to `/api/mpesa/stkpush`).
