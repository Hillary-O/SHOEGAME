// Shopping Cart Management
class ShoppingCart {
  constructor() {
    this.items = this.loadCart();
  }

  loadCart() {
    const saved = localStorage.getItem('shoegame_cart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('shoegame_cart', JSON.stringify(this.items));
  }

  addItem(product, size, quantity = 1) {
    const existingItem = this.items.find(
      item => item.id === product.id && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: size,
        quantity: quantity,
      });
    }
    this.saveCart();
  }

  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.saveCart();
  }

  updateQuantity(id, quantity) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(id);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  clear() {
    this.items = [];
    this.saveCart();
  }
}

const cart = new ShoppingCart();
let selectedProductId = null;
let selectedSize = null;

// Display featured products on homepage
function displayFeaturedProducts() {
  const container = document.getElementById('featuredProducts');
  if (!container) return;

  const featured = getFeaturedProducts();
  container.innerHTML = featured.map(product => createProductCard(product)).join('');
}

// Display all products on products page
function displayAllProducts() {
  const container = document.getElementById('productsGrid');
  if (!container) return;

  container.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Create product card HTML
function createProductCard(product) {
  return `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-badge">${product.category}</div>
      </div>
      <div class="product-info">
        <p class="product-brand">${product.brand}</p>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description.substring(0, 80)}...</p>
        <div class="product-footer">
          <span class="product-price">KSH ${product.price.toLocaleString()}</span>
          <div class="product-rating">
            <span class="rating-star">★</span>
            <span class="rating-value">${product.rating}</span>
            <span class="review-count">(${product.reviews})</span>
          </div>
        </div>
        <button onclick="goToProductDetails('${product.id}')" class="btn btn-primary full-width">
          View Details
        </button>
      </div>
    </div>
  `;
}

// Navigate to product details page
function goToProductDetails(productId) {
  window.location.href = `product-details.html?id=${productId}`;
}

// Display product details
function displayProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  selectedProductId = productId;

  if (!productId) {
    window.location.href = 'products.html';
    return;
  }

  const product = getProductById(productId);
  if (!product) {
    window.location.href = 'products.html';
    return;
  }

  const detailsContainer = document.getElementById('productDetails');
  if (!detailsContainer) return;

  detailsContainer.innerHTML = `
    <div class="product-details-container">
      <div class="product-image-large">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-details-right">
        <p class="product-brand-large">${product.brand}</p>
        <h1>${product.name}</h1>
        <div class="product-rating-large">
          <span class="rating-star">★</span>
          <span>${product.rating}</span>
          <span class="review-count">${product.reviews} reviews</span>
        </div>
        <div class="product-price-large">
          <span class="price">KSH ${product.price.toLocaleString()}</span>
          <span class="color-info">Color: ${product.color}</span>
        </div>
        <div class="product-description-full">
          ${product.description}
        </div>
        <button onclick="openSizeModal('${productId}')" class="btn btn-primary">
          Add to Cart
        </button>
      </div>
    </div>
  `;
}

// Display related products
function displayRelatedProducts() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const product = getProductById(productId);

  if (!product) return;

  const relatedContainer = document.getElementById('relatedProducts');
  if (!relatedContainer) return;

  const related = products
    .filter(p => p.category === product.category && p.id !== productId)
    .slice(0, 3);

  relatedContainer.innerHTML = related.map(p => createProductCard(p)).join('');
}

// Open size selection modal
function openSizeModal(productId) {
  selectedProductId = productId;
  const product = getProductById(productId);
  if (!product) return;

  const sizeOptions = document.getElementById('sizeOptions');
  if (!sizeOptions) return;

  sizeOptions.innerHTML = product.sizes.map(size => `
    <button class="size-btn" onclick="selectSize('${size}')">${size}</button>
  `).join('');

  document.getElementById('sizeModal').style.display = 'block';
  document.getElementById('quantityInput').value = 1;
}

// Select size
function selectSize(size) {
  selectedSize = size;
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
}

// Close size modal
function closeSizeModal() {
  document.getElementById('sizeModal').style.display = 'none';
  selectedSize = null;
}

// Add to cart from modal
function addToCartFromModal() {
  if (!selectedSize) {
    alert('Please select a size');
    return;
  }

  const product = getProductById(selectedProductId);
  const quantity = parseInt(document.getElementById('quantityInput').value) || 1;

  cart.addItem(product, selectedSize, quantity);
  closeSizeModal();
  updateCartCount();
  showNotification(`${product.name} added to cart!`);
}

// Display cart items
function displayCart() {
  const emptyCart = document.getElementById('emptyCart');
  const cartContent = document.getElementById('cartContent');

  if (cart.items.length === 0) {
    if (cartContent) cartContent.style.display = 'none';
    if (emptyCart) emptyCart.style.display = 'block';
    return;
  }

  if (emptyCart) emptyCart.style.display = 'none';
  if (cartContent) cartContent.style.display = 'block';

  const cartItemsBody = document.getElementById('cartItemsBody');
  if (!cartItemsBody) return;

  cartItemsBody.innerHTML = cart.items.map((item, index) => `
    <tr>
      <td>
        <div class="cart-item-info">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <p>${item.name}</p>
          </div>
        </div>
      </td>
      <td>${item.size}</td>
      <td>KSH ${item.price.toLocaleString()}</td>
      <td>
        <input type="number" min="1" value="${item.quantity}" 
          onchange="updateCartItemQuantity('${item.id}', this.value)">
      </td>
      <td>KSH ${(item.price * item.quantity).toLocaleString()}</td>
      <td>
        <button onclick="removeCartItem('${item.id}')" class="btn-remove">Remove</button>
      </td>
    </tr>
  `).join('');

  updateCartSummary();
}

// Remove item from cart
function removeCartItem(id) {
  cart.removeItem(id);
  displayCart();
  updateCartCount();
}

// Update cart item quantity
function updateCartItemQuantity(id, quantity) {
  cart.updateQuantity(id, parseInt(quantity));
  displayCart();
  updateCartCount();
}

// Update cart summary
function updateCartSummary() {
  const subtotal = cart.getTotal();
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const subtotalEl = document.getElementById('subtotal');
  const taxEl = document.getElementById('tax');
  const totalEl = document.getElementById('total');

  if (subtotalEl) subtotalEl.textContent = `KSH ${subtotal.toLocaleString()}`;
  if (taxEl) taxEl.textContent = `KSH ${tax.toLocaleString()}`;
  if (totalEl) totalEl.textContent = `KSH ${total.toLocaleString()}`;
}

// Update cart count in header
function updateCartCount() {
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    cartCount.textContent = cart.getItemCount();
  }
}

// Checkout
function checkout() {
  if (cart.items.length === 0) {
    alert('Your cart is empty');
    return;
  }
  alert(`Thank you for your order! Total: KSH ${cart.getTotal().toLocaleString()}`);
  cart.clear();
  displayCart();
  updateCartCount();
  window.location.href = 'index.html';
}

// Filter products
function filterProducts() {
  const categoryFilter = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');
  const priceValue = document.getElementById('priceValue');

  if (!categoryFilter || !priceFilter) return;

  const category = categoryFilter.value;
  const maxPrice = parseInt(priceFilter.value);
  priceValue.textContent = `$${maxPrice}`;

  const filtered = getFilteredProducts(category, maxPrice);
  const container = document.getElementById('productsGrid');

  if (!container) return;
  container.innerHTML = filtered.map(product => createProductCard(product)).join('');
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    z-index: 9999;
    animation: slideIn 0.3s ease-out;
  `;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('sizeModal');
  if (event.target === modal) {
    closeSizeModal();
  }
};

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);
