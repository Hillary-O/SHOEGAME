// Product catalog data - THRIFTED SHOES
const products = [
  {
    id: '1',
    name: 'Vintage Air Max',
    brand: 'Thrifted Finds',
    price: 10,
    description: 'Classic vintage Air Max from the 90s. Well-loved thrifted piece with retro charm. Some wear and character marks add to the authenticity.',
    image: 'images/casual/images.jpeg',
    color: 'Classic White/Gray',
    sizes: ['6', '7', '8', '9', '10', '11', '12', '13'],
    category: 'Vintage',
    rating: 4.8,
    reviews: 245,
  },
  {
    id: '2',
    name: 'Thrifted Canvas Slip-Ons',
    brand: 'Retro Wear',
    price: 1880,
    description: 'Comfortable canvas slip-ons from the 80s. Perfect thrifted find for casual wear. Distressed look adds vintage character.',
    image: 'images/casual/images (1).jpeg',
    color: 'Faded Navy',
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    category: 'Casual',
    rating: 4.6,
    reviews: 189,
  },
  {
    id: '3',
    name: 'Vintage Basketball High-Tops',
    brand: 'Old School Sport',
    price: 10,
    description: 'Authentic vintage basketball shoes from the 90s. Thrifted gem with original laces and vintage condition. Great for collectors.',
    image: 'images/casual/images (2).jpeg',
    color: 'Red/Black/White',
    sizes: ['7', '8', '9', '10', '11', '12', '13', '14'],
    category: 'Vintage',
    rating: 4.9,
    reviews: 312,
  },
  {
    id: '4',
    name: 'Thrifted Leather Loafers',
    brand: 'Vintage Classic',
    price: 3180,
    description: 'Pre-owned leather loafers with substantial patina and character. Perfect for vintage enthusiasts looking for authentic pieces.',
    image: 'images/casual/images (3).jpeg',
    color: 'Deep Brown',
    sizes: ['4', '5', '6', '7', '8', '9', '10', '11'],
    category: 'Formal',
    rating: 4.7,
    reviews: 156,
  },
  {
    id: '5',
    name: 'Vintage Hiking Boots',
    brand: 'Retro Adventure',
    price: 5000,
    description: 'Thrifted vintage hiking boots with excellent sole and weathered leather. A true time-tested piece for outdoor enthusiasts.',
    image: 'images/outdoor/images.jpeg',
    color: 'Weathered Brown',
    sizes: ['7', '8', '9', '10', '11', '12', '13'],
    category: 'Outdoor',
    rating: 4.5,
    reviews: 134,
  },
  {
    id: '6',
    name: 'Thrifted Oxfords',
    brand: 'Vintage Formal',
    price: 4090,
    description: 'Pre-owned dress oxfords with classic styling. Thrifted piece perfect for formal occasions with vintage appeal.',
    image: 'images/sports/images.jpeg',
    color: 'Polished Black',
    sizes: ['7', '8', '9', '10', '11', '12', '13'],
    category: 'Formal',
    rating: 4.4,
    reviews: 98,
  },
  {
    id: '7',
    name: 'Vintage Kids Sneakers',
    brand: 'Retro Youth',
    price: 1490,
    description: 'Fun thrifted vintage sneakers perfect for kids. Durable and colorful with that authentic 90s look.',
    image: 'images/kids/hq720.jpg',
    color: 'Multi-Color',
    sizes: ['1', '2', '3', '4', '5', '6'],
    category: 'Kids',
    rating: 4.3,
    reviews: 87,
  },
  {
    id: '8',
    name: 'Thrifted Soccer Cleats',
    brand: 'Vintage Soccer',
    price: 3700,
    description: 'Pre-owned vintage soccer cleats. Authentic thrifted sports equipment with plenty of history and playability.',
    image: 'images/sports/images (1).jpeg',
    color: 'Classic White/Blue',
    sizes: ['6', '7', '8', '9', '10', '11', '12', '13'],
    category: 'Sports',
    rating: 4.7,
    reviews: 201,
  },
];

// Get product by ID
function getProductById(id) {
  return products.find(p => p.id === id);
}

// Get featured products (first 6)
function getFeaturedProducts() {
  return products.slice(0, 6);
}

// Filter products by category and price
function getFilteredProducts(category, maxPrice) {
  return products.filter(p => {
    const categoryMatch = !category || p.category === category;
    const priceMatch = p.price <= maxPrice;
    return categoryMatch && priceMatch;
  });
}
