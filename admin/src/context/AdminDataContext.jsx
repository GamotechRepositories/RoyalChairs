import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AdminDataContext = createContext();

const INITIAL_PRODUCTS = [
  {
    id: 'rc-101',
    name: 'The Sovereign Ergonomic Task Pro',
    category: 'ergonomic',
    type: 'Ergonomic',
    sku: 'RC-ERG-101',
    originalPrice: 899,
    price: 449,
    discountPercent: 50,
    stock: 28,
    rating: 4.9,
    reviewCount: 328,
    isBestSeller: true,
    isNew: true,
    status: 'In Stock',
    colors: ['#2E6B4D', '#2B2D42', '#8D99AE'],
    mainImage: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80',
    description: 'The pinnacle of ergonomic science. Features dynamic spine-tracking lumbar support, 4D armrests, and cooling breathable English micro-mesh.',
    features: ['Dynamic Lumbar Support', '4D Adjustable Armrests', 'Breathable Micro-Mesh', 'Class-4 Heavy Duty Gas Lift'],
  },
  {
    id: 'rc-102',
    name: 'Kensington Velvet Wingback Armchair',
    category: 'velvet',
    type: 'Velvet',
    sku: 'RC-VEL-102',
    originalPrice: 799,
    price: 439,
    discountPercent: 45,
    stock: 14,
    rating: 4.95,
    reviewCount: 215,
    isBestSeller: true,
    isNew: false,
    status: 'In Stock',
    colors: ['#2E6B4D', '#E6C365', '#4A2E2B'],
    mainImage: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    description: 'Elegantly proportioned English wingback chair in rich velvet with hand-buffed brass nailhead trim and solid beechwood legs.',
    features: ['High-Resilience Foam Cushion', 'Stain-Resistant English Velvet', 'Solid Beechwood Frame', 'Hand-Crafted Button Tufting'],
  },
  {
    id: 'rc-103',
    name: 'Monarch High-Back Executive Leather Chair',
    category: 'executive',
    type: 'Executive',
    sku: 'RC-EXE-103',
    originalPrice: 1299,
    price: 779,
    discountPercent: 40,
    stock: 6,
    rating: 4.88,
    reviewCount: 184,
    isBestSeller: true,
    isNew: true,
    status: 'Low Stock',
    colors: ['#2B1E19', '#2E6B4D', '#111111'],
    mainImage: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=800&q=80',
    description: 'Crafted for corporate leadership. Full-grain Nappa leather paired with polished aluminum chassis and multi-angle synchro-tilt lock.',
    features: ['Full-Grain Nappa Leather', 'Polished Aluminum Star Base', 'Synchro-Tilt Lock Mechanism', 'Memory Foam Padded Headrest'],
  },
  {
    id: 'rc-104',
    name: 'Windsor Solid English Oak Wooden Chair',
    category: 'wooden',
    type: 'Wooden',
    sku: 'RC-WOD-104',
    originalPrice: 650,
    price: 422,
    discountPercent: 35,
    stock: 22,
    rating: 4.82,
    reviewCount: 96,
    isBestSeller: true,
    isNew: true,
    status: 'In Stock',
    colors: ['#D4A373', '#FAF0CA', '#2E6B4D'],
    mainImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
    description: 'Timeless British country dining style. Hand-carved solid English oak frame with removable organic linen seat cushions.',
    features: ['100% Solid English Oak', 'Water-Repellent Linen Seat', 'Mortise & Tenon Joinery', 'Ergonomic Curved Spindles'],
  },
  {
    id: 'rc-105',
    name: 'Apex Pro Ergonomic Gaming Throne',
    category: 'gaming',
    type: 'Gaming',
    sku: 'RC-GAM-105',
    originalPrice: 599,
    price: 419,
    discountPercent: 30,
    stock: 19,
    rating: 4.91,
    reviewCount: 412,
    isBestSeller: true,
    isNew: false,
    status: 'In Stock',
    colors: ['#2E6B4D', '#E6C365', '#2B2D42'],
    mainImage: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=800&q=80',
    description: 'Designed for prolonged high-stakes gaming and stream sessions. Cold-cured high density molding foam with magnetic neck pillow.',
    features: ['165° Full Recline System', 'Magnetic Memory Foam Pillow', 'Perforated PU Leather Airway', 'Heavy Steel Internal Frame'],
  },
  {
    id: 'rc-106',
    name: 'Minimalist Polypropylene Molded Plastic Chair',
    category: 'plastic',
    type: 'Plastic',
    sku: 'RC-PLS-106',
    originalPrice: 299,
    price: 224,
    discountPercent: 25,
    stock: 35,
    rating: 4.76,
    reviewCount: 165,
    isBestSeller: false,
    isNew: true,
    status: 'In Stock',
    colors: ['#FFFFFF', '#2E6B4D', '#F59E0B'],
    mainImage: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-durable, ergonomically contoured recyclable polypropylene plastic shell chair with solid beechwood tripod legs.',
    features: ['Recyclable Polypropylene Shell', 'Solid Beechwood Tripod Legs', 'Stain & Scratch Resistant', 'Lightweight 4.2kg Stackable'],
  },
  {
    id: 'rc-107',
    name: 'Cotswold All-Weather Teak Outdoor Seat',
    category: 'outdoor',
    type: 'Outdoor',
    sku: 'RC-OUT-107',
    originalPrice: 480,
    price: 384,
    discountPercent: 20,
    stock: 12,
    rating: 4.79,
    reviewCount: 78,
    isBestSeller: false,
    isNew: false,
    status: 'In Stock',
    colors: ['#B8860B', '#2E6B4D'],
    mainImage: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
    description: 'Sustainably sourced Grade-A teak outdoor armchairs woven with UV-resistant all-weather synthetic rattan.',
    features: ['Grade-A Plantation Teak', 'UV-Resistant Rattan Weave', 'Quick-Dry Foam Cushion', 'Stainless Steel Hardware'],
  },
  {
    id: 'rc-108',
    name: 'Belgrave Bouclé Accent Swivel Lounger',
    category: 'velvet',
    type: 'Velvet',
    sku: 'RC-VEL-108',
    originalPrice: 850,
    price: 680,
    discountPercent: 20,
    stock: 0,
    rating: 4.87,
    reviewCount: 142,
    isBestSeller: false,
    isNew: true,
    status: 'Out of Stock',
    colors: ['#F7F7F7', '#E6C365', '#2E6B4D'],
    mainImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-luxurious tactile bouclé fabric armchair featuring a smooth 360-degree silent brass swivel mechanism.',
    features: ['360° Silent Swivel Base', 'Plush English Bouclé Fabric', 'Deep Curved Barrel Back', 'Concealed Weight Stabilizer'],
  },
];

const INITIAL_ORDERS = [
  {
    id: 'RC-8924',
    customer: {
      name: 'Lady Victoria Kensington',
      email: 'v.kensington@mayfair-estates.co.uk',
      phone: '+44 20 7946 0912',
      address: '14 Grosvenor Square, Mayfair, London W1K 6HN, United Kingdom',
    },
    items: [
      {
        id: 'rc-101',
        name: 'The Sovereign Ergonomic Task Pro',
        color: '#2E6B4D',
        price: 449,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=200&q=80',
      },
      {
        id: 'rc-102',
        name: 'Kensington Velvet Wingback Armchair',
        color: '#E6C365',
        price: 439,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=200&q=80',
      },
    ],
    subtotal: 1337,
    shipping: 0,
    discount: 50,
    total: 1287,
    paymentMethod: 'American Express •••• 4092',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Dispatched',
    carrier: 'Royal Logistics Express Courier',
    trackingNumber: 'RL-UK-892401',
    estimatedDelivery: 'Aug 14, 2026',
    date: '2026-08-12T10:30:00Z',
    notes: 'Please phone 30 minutes prior to room delivery.',
  },
  {
    id: 'RC-8923',
    customer: {
      name: 'Sir Arthur Pendelton',
      email: 'arthur.pendelton@cotswold-heritage.com',
      phone: '+44 1451 820 441',
      address: 'High Street Manor, Bourton-on-the-Water, GL54 2AN, UK',
    },
    items: [
      {
        id: 'rc-103',
        name: 'Monarch High-Back Executive Leather Chair',
        color: '#2B1E19',
        price: 779,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=200&q=80',
      },
    ],
    subtotal: 779,
    shipping: 0,
    discount: 0,
    total: 779,
    paymentMethod: 'Google Pay',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'In Production',
    carrier: 'Royal Express Delivery Fleet',
    trackingNumber: 'RL-UK-892305',
    estimatedDelivery: 'Aug 16, 2026',
    date: '2026-08-12T08:15:00Z',
    notes: 'Custom leather conditioning requested.',
  },
  {
    id: 'RC-8922',
    customer: {
      name: 'Dr. Marcus Thorne',
      email: 'm.thorne@spinecare-edinburgh.ac.uk',
      phone: '+44 131 496 0883',
      address: '22 Moray Place, Edinburgh EH3 6DX, Scotland',
    },
    items: [
      {
        id: 'rc-105',
        name: 'Apex Pro Ergonomic Gaming Throne',
        color: '#2E6B4D',
        price: 419,
        quantity: 4,
        image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=200&q=80',
      },
    ],
    subtotal: 1676,
    shipping: 0,
    discount: 100,
    total: 1576,
    paymentMethod: 'MasterCard •••• 9812',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered',
    carrier: 'Royal Logistics UK',
    trackingNumber: 'RL-UK-892219',
    estimatedDelivery: 'Aug 11, 2026',
    date: '2026-08-10T14:20:00Z',
    notes: 'Delivered and assembled in clinic consultation rooms.',
  },
  {
    id: 'RC-8921',
    customer: {
      name: 'Eleanor Vance',
      email: 'e.vance@apex-global.co.uk',
      phone: '+44 1865 240 991',
      address: 'Apex Tower, 45 Banbury Road, Oxford OX2 6PE, UK',
    },
    items: [
      {
        id: 'rc-104',
        name: 'Windsor Solid English Oak Wooden Chair',
        color: '#D4A373',
        price: 422,
        quantity: 6,
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=200&q=80',
      },
    ],
    subtotal: 2532,
    shipping: 0,
    discount: 250,
    total: 2282,
    paymentMethod: 'Corporate Wire Transfer',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Pending',
    carrier: 'Unassigned',
    trackingNumber: 'PENDING-DISPATCH',
    estimatedDelivery: 'Aug 18, 2026',
    date: '2026-08-12T12:00:00Z',
    notes: 'Requires delivery dock appointment.',
  },
];

const INITIAL_CATEGORIES = [
  { id: 'wooden', name: 'Wooden Chairs', emoji: '🪵', count: 18, image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80', desc: '100% Solid English Oak & Walnut frames handcrafted by master carpenters' },
  { id: 'ergonomic', name: 'Ergonomic Task', emoji: '🪑', count: 24, image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=600&q=80', desc: 'Spinal pelvic alignment with 4D lumbar support for 12+ hour seating' },
  { id: 'plastic', name: 'Plastic & Molded', emoji: '🪴', count: 15, image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80', desc: 'High-grade recyclable polypropylene modern designer shell chairs' },
  { id: 'gaming', name: 'Gaming Thrones', emoji: '🎮', count: 12, image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80', desc: 'Cold-cured foam recliners with magnetic neck pillows & 165° recline' },
  { id: 'velvet', name: 'Velvet Loungers', emoji: '🛋️', count: 20, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80', desc: 'Opulent stain-resistant plush velvet armchairs with brass tipped legs' },
  { id: 'executive', name: 'Executive Leather', emoji: '👔', count: 10, image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=600&q=80', desc: 'Top-grain Nappa leather with polished gold-accented aluminum base' },
  { id: 'dining', name: 'Dining Armchairs', emoji: '🍽️', count: 16, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80', desc: 'Royal dining seats designed for banquets and intimate family meals' },
  { id: 'outdoor', name: 'Outdoor & Teak', emoji: '☀️', count: 9, image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80', desc: 'All-weather handwoven synthetic rattan and Grade-A teak patio seats' },
];

const INITIAL_CUSTOMERS = [
  { id: 'CUST-001', name: 'Lady Victoria Kensington', email: 'v.kensington@mayfair-estates.co.uk', tier: 'Royal Diamond', ordersCount: 7, totalSpent: 8450, joinedDate: 'Jan 2025', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  { id: 'CUST-002', name: 'Sir Arthur Pendelton', email: 'arthur.pendelton@cotswold-heritage.com', tier: 'Emerald Elite', ordersCount: 4, totalSpent: 4290, joinedDate: 'Mar 2025', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
  { id: 'CUST-003', name: 'Dr. Marcus Thorne', email: 'm.thorne@spinecare-edinburgh.ac.uk', tier: 'Royal Diamond', ordersCount: 12, totalSpent: 14200, joinedDate: 'Nov 2024', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
  { id: 'CUST-004', name: 'Eleanor Vance', email: 'e.vance@apex-global.co.uk', tier: 'Corporate VIP', ordersCount: 9, totalSpent: 19850, joinedDate: 'Feb 2025', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
  { id: 'CUST-005', name: 'Henry Cavendish', email: 'h.cavendish@belgravia-design.com', tier: 'Standard VIP', ordersCount: 2, totalSpent: 1280, joinedDate: 'Jun 2026', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' },
];

const INITIAL_COUPONS = [
  { id: 'CPN-1', code: 'ROYAL50', type: 'percentage', value: 50, minSpend: 500, usageCount: 84, limit: 200, active: true, expiry: '2026-12-31' },
  { id: 'CPN-2', code: 'WELCOME10', type: 'percentage', value: 10, minSpend: 100, usageCount: 312, limit: 1000, active: true, expiry: '2026-12-31' },
  { id: 'CPN-3', code: 'LUXURY20', type: 'percentage', value: 20, minSpend: 800, usageCount: 65, limit: 150, active: true, expiry: '2026-09-30' },
  { id: 'CPN-4', code: 'FREESHIP', type: 'fixed', value: 45, minSpend: 300, usageCount: 140, limit: 500, active: true, expiry: '2026-10-15' },
];

const INITIAL_REVIEWS = [
  { id: 'REV-1', customer: 'Lord Alistair Sterling', product: 'The Sovereign Ergonomic Task Pro', rating: 5, comment: 'The Sovereign Ergonomic Task Pro saved my back after 10-hour design sessions. Exceptional velvet quality.', date: '2026-08-10', status: 'Approved', featured: true },
  { id: 'REV-2', customer: 'Eleanor Vance', product: 'Monarch High-Back Executive Leather Chair', rating: 5, comment: 'Ordered 12 chairs for our C-suite boardroom. Express delivery arrived on time, completely pre-assembled.', date: '2026-08-08', status: 'Approved', featured: true },
  { id: 'REV-3', customer: 'Dr. Marcus Thorne', product: 'Apex Pro Ergonomic Gaming Throne', rating: 5, comment: 'As a spinal health specialist, I endorse RoyalChairs dynamic lumbar mechanism. It actively adjusts to pelvic tilt.', date: '2026-08-05', status: 'Approved', featured: true },
  { id: 'REV-4', customer: 'Sophia Montgomery', product: 'Belgrave Bouclé Accent Swivel Lounger', rating: 4, comment: 'Soft bouclé texture and smooth swivel. Looks gorgeous in our Gloucestershire sunroom.', date: '2026-08-11', status: 'Pending', featured: false },
];

const INITIAL_SETTINGS = {
  storeName: 'RoyalChairs London Ltd.',
  tagline: 'Purveyors of Handcrafted British & European Seating',
  currency: 'INR (₹)',
  currencySymbol: '₹',
  taxRate: 8.5,
  freeShippingThreshold: 500,
  standardShippingFee: 45,
  supportEmail: 'concierge@royalchairs.co.uk',
  supportPhone: '+44 20 7946 0990',
  headquarters: 'Gloucestershire & Mayfair, London, United Kingdom',
  maintenanceMode: false,
  freeDelivery: true,
};

export function AdminDataProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('royal_admin_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('royal_admin_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('royal_admin_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('royal_admin_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        const fetchedUsers = response.data.data.map((u) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          tier: u.role === 'admin' ? 'Admin / Executive' : 'Registered Member',
          ordersCount: 0,
          totalSpent: 0,
          joinedDate: new Date(u.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          }),
          avatar:
            u.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=2E6B4D&color=fff`,
        }));
        setCustomers(fetchedUsers);
      }
    } catch (err) {
      console.log('Error fetching admin users from backend:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('royal_admin_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('royal_admin_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('royal_admin_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Save changes to localStorage for persistence
  useEffect(() => {
    localStorage.setItem('royal_admin_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('royal_admin_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('royal_admin_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('royal_admin_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('royal_admin_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('royal_admin_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('royal_admin_settings', JSON.stringify(settings));
  }, [settings]);

  // Product Operations
  const addProduct = (prod) => {
    const newProduct = {
      ...prod,
      id: `rc-${Date.now().toString().slice(-4)}`,
      sku: prod.sku || `RC-${(prod.category || 'GEN').toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      status: Number(prod.stock) > 0 ? (Number(prod.stock) < 10 ? 'Low Stock' : 'In Stock') : 'Out of Stock',
      rating: prod.rating || 5.0,
      reviewCount: prod.reviewCount || 1,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const merged = { ...p, ...updatedFields };
          merged.status = Number(merged.stock) > 0 ? (Number(merged.stock) < 10 ? 'Low Stock' : 'In Stock') : 'Out of Stock';
          return merged;
        }
        return p;
      })
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleProductFlag = (id, flagName) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, [flagName]: !p[flagName] };
          return updated;
        }
        return p;
      })
    );
  };

  const updateStock = (id, newStock) => {
    updateProduct(id, { stock: Math.max(0, newStock) });
  };

  // Order Operations
  const updateOrderStatus = (orderId, newStatus, trackingNumber) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            fulfillmentStatus: newStatus || o.fulfillmentStatus,
            trackingNumber: trackingNumber !== undefined ? trackingNumber : o.trackingNumber,
          };
        }
        return o;
      })
    );
  };

  // Coupon Operations
  const addCoupon = (coupon) => {
    const newCoupon = {
      ...coupon,
      id: `CPN-${Date.now().toString().slice(-4)}`,
      usageCount: 0,
      active: true,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const toggleCouponStatus = (id) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const deleteCoupon = (id) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  // Review Operations
  const moderateReview = (id, status, featured) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status: status !== undefined ? status : r.status,
            featured: featured !== undefined ? featured : r.featured,
          };
        }
        return r;
      })
    );
  };

  const deleteReview = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  // Settings
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <AdminDataContext.Provider
      value={{
        products,
        orders,
        categories,
        customers,
        coupons,
        reviews,
        settings,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductFlag,
        updateStock,
        updateOrderStatus,
        addCoupon,
        toggleCouponStatus,
        deleteCoupon,
        moderateReview,
        deleteReview,
        updateSettings,
        refetchUsers: fetchUsers,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  return useContext(AdminDataContext);
}
