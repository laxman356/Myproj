// Seed data for demo purposes
const SEED_ITEMS = [
  {
    id: 'item-1',
    ownerId: 'owner-1',
    ownerName: 'Priya Jewels',
    name: 'Royal Kundan Necklace Set',
    description: 'Exquisite Kundan necklace with matching earrings and maang tikka. Perfect for bridal occasions.',
    category: 'Necklace Sets',
    eventTypes: ['Wedding', 'Engagement', 'Sangeet'],
    pricePerDay: 2500,
    deposit: 10000,
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80',
    ],
    availability: generateDateRange('2026-04-27', 60),
    rating: 4.9,
    reviews: 24,
    location: 'Mumbai',
  },
  {
    id: 'item-2',
    ownerId: 'owner-1',
    ownerName: 'Priya Jewels',
    name: 'Polki Diamond Choker',
    description: 'Stunning Polki diamond choker with gold setting. A statement piece for any festive event.',
    category: 'Necklaces',
    eventTypes: ['Wedding', 'Festival', 'Reception'],
    pricePerDay: 3500,
    deposit: 15000,
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    ],
    availability: generateDateRange('2026-04-27', 60),
    rating: 4.8,
    reviews: 18,
    location: 'Delhi',
  },
  {
    id: 'item-3',
    ownerId: 'owner-2',
    ownerName: 'Heritage Ornaments',
    name: 'Gold Plated Bangles Set (12 pcs)',
    description: 'Traditional gold plated bangles with intricate meenakari work. Set of 12 pieces.',
    category: 'Bangles',
    eventTypes: ['Festival', 'Wedding', 'Puja', 'Birthday'],
    pricePerDay: 800,
    deposit: 3000,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
    ],
    availability: generateDateRange('2026-04-28', 45),
    rating: 4.7,
    reviews: 31,
    location: 'Jaipur',
  },
  {
    id: 'item-4',
    ownerId: 'owner-2',
    ownerName: 'Heritage Ornaments',
    name: 'Temple Jewelry Haaram',
    description: 'South Indian style long haaram with ruby and emerald stones. Perfect for classical dance and temple ceremonies.',
    category: 'Necklace Sets',
    eventTypes: ['Religious Ceremony', 'Cultural Event', 'Festival'],
    pricePerDay: 1800,
    deposit: 8000,
    images: [
      'https://images.unsplash.com/photo-1573408301185-9519f94f4e1b?w=600&q=80',
    ],
    availability: generateDateRange('2026-04-27', 55),
    rating: 5.0,
    reviews: 12,
    location: 'Chennai',
  },
  {
    id: 'item-5',
    ownerId: 'owner-3',
    ownerName: 'Royal Adornments',
    name: 'Pearl Drop Earrings',
    description: 'Elegant freshwater pearl drop earrings with 22K gold hooks. Timeless beauty for any occasion.',
    category: 'Earrings',
    eventTypes: ['Wedding', 'Anniversary', 'Corporate Event', 'Party'],
    pricePerDay: 600,
    deposit: 2500,
    images: [
      'https://images.unsplash.com/photo-1635797255620-77e7d05f4e63?w=600&q=80',
    ],
    availability: generateDateRange('2026-04-27', 60),
    rating: 4.6,
    reviews: 45,
    location: 'Hyderabad',
  },
  {
    id: 'item-6',
    ownerId: 'owner-3',
    ownerName: 'Royal Adornments',
    name: 'Meenakari Maang Tikka',
    description: 'Vibrant meenakari maang tikka with peacock motif. A show-stopping bridal accessory.',
    category: 'Maang Tikka',
    eventTypes: ['Wedding', 'Sangeet', 'Engagement'],
    pricePerDay: 700,
    deposit: 3000,
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
    ],
    availability: generateDateRange('2026-05-01', 50),
    rating: 4.9,
    reviews: 22,
    location: 'Udaipur',
  },
  {
    id: 'item-7',
    ownerId: 'owner-1',
    ownerName: 'Priya Jewels',
    name: 'Silver Anklets Pair',
    description: 'Pure silver anklets with jingling bells and floral motifs. Traditional yet trendy.',
    category: 'Anklets',
    eventTypes: ['Festival', 'Wedding', 'Puja', 'Cultural Event'],
    pricePerDay: 400,
    deposit: 1500,
    images: [
      'https://images.unsplash.com/photo-1596944924591-0a5e5e5fe69e?w=600&q=80',
    ],
    availability: generateDateRange('2026-04-27', 60),
    rating: 4.5,
    reviews: 38,
    location: 'Mumbai',
  },
  {
    id: 'item-8',
    ownerId: 'owner-2',
    ownerName: 'Heritage Ornaments',
    name: 'Diamond Solitaire Ring',
    description: 'Certified diamond solitaire ring in platinum setting. Perfect for engagements and anniversaries.',
    category: 'Rings',
    eventTypes: ['Engagement', 'Anniversary', 'Wedding'],
    pricePerDay: 5000,
    deposit: 25000,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
    ],
    availability: generateDateRange('2026-05-05', 30),
    rating: 4.8,
    reviews: 9,
    location: 'Delhi',
  },
];

function generateDateRange(startStr, days) {
  const dates = [];
  const start = new Date(startStr);
  // Remove some random dates to simulate bookings
  const bookedIndexes = new Set();
  for (let i = 0; i < Math.floor(days * 0.2); i++) {
    bookedIndexes.add(Math.floor(Math.random() * days));
  }
  for (let i = 0; i < days; i++) {
    if (!bookedIndexes.has(i)) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
  }
  return dates;
}

const SEED_USERS = [
  { id: 'owner-1', name: 'Priya Sharma', email: 'priya@example.com', password: 'demo123', type: 'owner' },
  { id: 'owner-2', name: 'Rajan Mehta', email: 'rajan@example.com', password: 'demo123', type: 'owner' },
  { id: 'owner-3', name: 'Sunita Agarwal', email: 'sunita@example.com', password: 'demo123', type: 'owner' },
  { id: 'renter-1', name: 'Ananya Patel', email: 'ananya@example.com', password: 'demo123', type: 'renter' },
];

export function initStorage() {
  if (!localStorage.getItem('ornamint_users')) {
    localStorage.setItem('ornamint_users', JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem('ornamint_items')) {
    localStorage.setItem('ornamint_items', JSON.stringify(SEED_ITEMS));
  }
  if (!localStorage.getItem('ornamint_rentals')) {
    localStorage.setItem('ornamint_rentals', JSON.stringify([]));
  }
}

export function getUsers() {
  return JSON.parse(localStorage.getItem('ornamint_users') || '[]');
}

export function saveUsers(users) {
  localStorage.setItem('ornamint_users', JSON.stringify(users));
}

export function getItems() {
  return JSON.parse(localStorage.getItem('ornamint_items') || '[]');
}

export function saveItems(items) {
  localStorage.setItem('ornamint_items', JSON.stringify(items));
}

export function getRentals() {
  return JSON.parse(localStorage.getItem('ornamint_rentals') || '[]');
}

export function saveRentals(rentals) {
  localStorage.setItem('ornamint_rentals', JSON.stringify(rentals));
}

export function getCurrentUser() {
  const u = localStorage.getItem('ornamint_current_user');
  return u ? JSON.parse(u) : null;
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('ornamint_current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('ornamint_current_user');
  }
}
