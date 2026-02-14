# SHOEGAME - Shoe Business Website

A modern, fully responsive e-commerce website for a shoe business built with pure HTML, CSS, and JavaScript.

## Features

✅ **Product Catalog** - Browse 8 different shoe products across multiple categories
✅ **Product Details** - Detailed product pages with images, descriptions, and reviews
✅ **Shopping Cart** - Add/remove items, update quantities, persistent storage
✅ **Filter & Search** - Filter products by category and price range
✅ **Responsive Design** - Beautiful on desktop, tablet, and mobile devices
✅ **Modern UI** - Clean, professional design with smooth animations
✅ **LocalStorage** - Cart persists across browser sessions
✅ **No Dependencies** - Pure HTML, CSS, and JavaScript (fast & lightweight)

## Project Structure

```
SHOEGAME/
├── index.html              # Homepage with featured products
├── products.html           # All products page with filters
├── product-details.html    # Individual product page
├── cart.html              # Shopping cart page
├── css/
│   └── styles.css         # All styles and responsive design
├── js/
│   ├── products.js        # Product data and utilities
│   └── script.js          # Main functionality (cart, display, etc)
└── README.md              # This file
```

## Getting Started

1. **Clone or Download** - Get the project files on your computer
2. **Open in Browser** - Simply open `index.html` in any modern web browser
3. **No Setup Required** - No installation, no build process needed!

## How to Use

### Browsing Products
- Visit the **Products** page to see all shoes
- Use filters to narrow by category or price
- Click **View Details** to see more information

### Adding to Cart
- Click **Add to Cart** on any product
- Select your size from the modal
- Choose quantity and confirm
- See cart update in the header

### Managing Cart
- Go to **Cart** to review items
- Update quantities or remove items
- View order summary with tax calculation
- Click **Checkout** to complete order

## Product Categories

- 👟 Running - Performance running shoes
- 👟 Casual - Everyday comfort shoes
- 👟 Basketball - Court performance shoes
- 👟 Women's - Women-specific designs
- 👟 Outdoor - Trail and hiking shoes
- 👟 Formal - Dress and formal shoes
- 👟 Kids - Children's shoes
- 👟 Sports - Multi-sport athletic shoes

## Features Breakdown

### Homepage (`index.html`)
- Hero section with clear call-to-action
- Featured collection (6 products)
- Why Choose Us section with benefits
- Responsive navigation

### Products Page (`products.html`)
- Grid layout with all 8 products
- Filter by category (8 options)
- Price range slider
- Smooth product cards

### Product Details (`product-details.html`)
- Large product image
- Full description and specifications
- Rating and reviews count
- Size selection modal
- Related products section

### Cart Page (`cart.html`)
- Table view of cart items
- Update quantities in-line
- Remove items easily
- Order summary panel
- Subtotal, tax, and total calculation

## Technical Details

### Storage
- Shopping cart data saved in browser's localStorage
- Cart persists across page refreshes and browser sessions
- Data stored as JSON for easy management

### Responsive Breakpoints
- 📱 Mobile: < 480px
- 📱 Tablet: 480px - 768px
- 🖥️ Desktop: > 768px

### Browser Compatibility
- ✅ Chrome/Edge (all versions)
- ✅ Firefox (all versions)
- ✅ Safari (all versions)
- ✅ Mobile browsers (iOS/Android)

## Customization

### Add New Products
Edit `js/products.js` and add to the `products` array:
```javascript
{
  id: '9',
  name: 'Your Shoe Name',
  brand: 'Brand Name',
  price: 99.99,
  description: 'Product description',
  image: 'image-url.jpg',
  color: 'Color',
  sizes: ['6', '7', '8', '9', '10'],
  category: 'Category',
  rating: 4.5,
  reviews: 100,
}
```

### Change Colors
Edit the CSS color variables in `css/styles.css`:
- Primary: `#1f2937` (dark gray)
- Accent: `#fbbf24` (golden yellow)

### Modify Cart Tax Rate
In `js/script.js`, find `updateCartSummary()`:
```javascript
const tax = subtotal * 0.1; // Change 0.1 to desired rate
```

## Future Enhancements

- Backend API integration
- User accounts and order history
- Payment gateway integration
- Product reviews and ratings
- Wishlist functionality
- Size guide and fit predictor
- Real product images
- Search functionality

## License

This project is open source and available for personal and commercial use.

## Support

For questions or issues, please reach out or create an issue in the repository.

---

**Built with ❤️ for shoe enthusiasts everywhere** 👟

Last updated: February 14, 2026
