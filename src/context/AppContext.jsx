import React, { createContext, useContext, useState, useEffect } from 'react';
import { RESTAURANTS, COUPONS, DEMO_USER, INITIAL_ORDERS, CITIES } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('zomabite_dark_mode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('zomabite_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // 2. City & Location
  const [selectedCity, setSelectedCity] = useState(CITIES[0]); // Bengaluru default
  const [selectedArea, setSelectedArea] = useState('Indiranagar');

  // 3. User Authentication
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('zomabite_user');
    return savedUser ? JSON.parse(savedUser) : DEMO_USER;
  });

  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('zomabite_addresses');
    return saved ? JSON.parse(saved) : DEMO_USER.savedAddresses;
  });

  const [selectedAddress, setSelectedAddress] = useState(() => {
    return addresses.find(a => a.isDefault) || addresses[0] || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('zomabite_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('zomabite_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('zomabite_addresses', JSON.stringify(addresses));
  }, [addresses]);

  const login = (userData) => {
    setUser(userData || DEMO_USER);
    showToast('Logged in successfully! Welcome back.', 'success');
  };

  const logout = () => {
    setUser(null);
    showToast('Logged out of your account', 'info');
  };

  const addAddress = (newAddr) => {
    const created = {
      id: `addr-${Date.now()}`,
      ...newAddr,
      isDefault: addresses.length === 0,
    };
    setAddresses(prev => [created, ...prev]);
    if (!selectedAddress) setSelectedAddress(created);
    showToast('Delivery address saved!', 'success');
    return created;
  };

  const deleteAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedAddress?.id === id) {
      const remaining = addresses.filter(a => a.id !== id);
      setSelectedAddress(remaining[0] || null);
    }
    showToast('Address removed', 'info');
  };

  // 4. Cart Management
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('zomabite_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [cartRestaurant, setCartRestaurant] = useState(() => {
    const saved = localStorage.getItem('zomabite_cart_restaurant');
    return saved ? JSON.parse(saved) : null;
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [conflictModal, setConflictModal] = useState({ isOpen: false, pendingItem: null, pendingRestaurant: null });
  const [riderTip, setRiderTip] = useState(0);

  useEffect(() => {
    localStorage.setItem('zomabite_cart', JSON.stringify(cartItems));
    if (cartItems.length === 0) {
      setCartRestaurant(null);
      setAppliedCoupon(null);
      localStorage.removeItem('zomabite_cart_restaurant');
    }
  }, [cartItems]);

  useEffect(() => {
    if (cartRestaurant) {
      localStorage.setItem('zomabite_cart_restaurant', JSON.stringify(cartRestaurant));
    }
  }, [cartRestaurant]);

  const addToCart = (item, restaurant) => {
    // If cart has items from a different restaurant
    if (cartRestaurant && cartRestaurant.id !== restaurant.id && cartItems.length > 0) {
      setConflictModal({
        isOpen: true,
        pendingItem: item,
        pendingRestaurant: restaurant,
      });
      return;
    }

    setCartRestaurant({
      id: restaurant.id,
      name: restaurant.name,
      image: restaurant.image,
      location: restaurant.location,
    });

    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, restaurantId: restaurant.id }];
    });

    showToast(`Added "${item.name}" to cart`, 'success');
  };

  const resolveConflictReplace = () => {
    if (conflictModal.pendingItem && conflictModal.pendingRestaurant) {
      setCartRestaurant({
        id: conflictModal.pendingRestaurant.id,
        name: conflictModal.pendingRestaurant.name,
        image: conflictModal.pendingRestaurant.image,
        location: conflictModal.pendingRestaurant.location,
      });
      setCartItems([{ ...conflictModal.pendingItem, quantity: 1, restaurantId: conflictModal.pendingRestaurant.id }]);
      setAppliedCoupon(null);
      showToast(`Cart refreshed with "${conflictModal.pendingRestaurant.name}"`, 'success');
    }
    setConflictModal({ isOpen: false, pendingItem: null, pendingRestaurant: null });
  };

  const updateQuantity = (itemId, delta) => {
    setCartItems(prev => {
      return prev
        .map(i => {
          if (i.id === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(i => i.id !== itemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
    setCartRestaurant(null);
    setAppliedCoupon(null);
    setRiderTip(0);
    showToast('Cart cleared', 'info');
  };

  // Cart Totals calculation
  const itemTotal = cartItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  
  let discountAmount = 0;
  let deliveryFee = itemTotal > 0 ? (itemTotal > 400 ? 0 : 35) : 0;

  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      const calculated = Math.round((itemTotal * appliedCoupon.discountPercent) / 100);
      discountAmount = Math.min(calculated, appliedCoupon.maxDiscount || calculated);
    } else if (appliedCoupon.type === 'flat') {
      discountAmount = appliedCoupon.flatDiscount;
    } else if (appliedCoupon.type === 'free_delivery') {
      deliveryFee = 0;
    }
  }

  const platformFee = itemTotal > 0 ? 5 : 0;
  const gstAndTaxes = itemTotal > 0 ? Math.round(itemTotal * 0.05) : 0;
  const grandTotal = Math.max(0, itemTotal - discountAmount + deliveryFee + platformFee + gstAndTaxes + riderTip);

  const applyCoupon = (couponCode) => {
    const code = couponCode.trim().toUpperCase();
    const found = COUPONS.find(c => c.code === code);
    if (!found) {
      showToast('Invalid coupon code. Try ZOMA50, WELCOME100, or FREESHIP', 'error');
      return { success: false, message: 'Invalid coupon' };
    }
    if (itemTotal < found.minOrder) {
      const msg = `Add items worth ₹${found.minOrder - itemTotal} more to apply ${found.code}`;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied successfully!`, 'success');
    return { success: true };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // 5. Favourites / Wishlist
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem('zomabite_favourites');
    return saved ? JSON.parse(saved) : ['royal-biryani', 'crust-craft'];
  });

  useEffect(() => {
    localStorage.setItem('zomabite_favourites', JSON.stringify(favourites));
  }, [favourites]);

  const toggleFavourite = (restaurantId) => {
    setFavourites(prev => {
      const exists = prev.includes(restaurantId);
      if (exists) {
        showToast('Removed from favourites', 'info');
        return prev.filter(id => id !== restaurantId);
      } else {
        showToast('Added to your favourites ❤️', 'success');
        return [...prev, restaurantId];
      }
    });
  };

  const isFavourite = (restaurantId) => favourites.includes(restaurantId);

  // 6. Orders & Live Tracking
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('zomabite_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [activeLiveOrder, setActiveLiveOrder] = useState(() => {
    const saved = localStorage.getItem('zomabite_active_live_order');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('zomabite_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (activeLiveOrder) {
      localStorage.setItem('zomabite_active_live_order', JSON.stringify(activeLiveOrder));
    } else {
      localStorage.removeItem('zomabite_active_live_order');
    }
  }, [activeLiveOrder]);

  const placeOrder = ({ paymentMethod, deliveryInstructions = '' }) => {
    if (cartItems.length === 0) return null;

    const newOrderId = `ZB-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + 
      ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      id: newOrderId,
      restaurantId: cartRestaurant?.id || 'royal-biryani',
      restaurantName: cartRestaurant?.name || 'The Royal Biryani House',
      restaurantImage: cartRestaurant?.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
      items: [...cartItems],
      itemTotal,
      discountAmount,
      deliveryFee,
      platformFee,
      gstAndTaxes,
      riderTip,
      totalAmount: grandTotal,
      orderDate: formattedDate,
      status: 'Order Placed',
      address: selectedAddress ? selectedAddress.fullAddress : 'Default Delivery Address',
      paymentMethod: paymentMethod || 'UPI (Google Pay)',
      deliveryInstructions,
      deliveryPartner: {
        name: 'Suresh Patil',
        rating: 4.9,
        phone: '+91 98234 56711',
        vehicle: 'Ather 450X (KA-05-EV-1289)'
      }
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveLiveOrder(newOrder);
    setCartItems([]);
    setCartRestaurant(null);
    setAppliedCoupon(null);
    setRiderTip(0);

    return newOrder;
  };

  // 7. Toast Notifications System
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // 8. Auth Modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        selectedCity,
        setSelectedCity,
        selectedArea,
        setSelectedArea,
        user,
        login,
        logout,
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        deleteAddress,
        cartItems,
        cartRestaurant,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartDrawerOpen,
        setCartDrawerOpen,
        conflictModal,
        setConflictModal,
        resolveConflictReplace,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        riderTip,
        setRiderTip,
        itemTotal,
        discountAmount,
        deliveryFee,
        platformFee,
        gstAndTaxes,
        grandTotal,
        favourites,
        toggleFavourite,
        isFavourite,
        orders,
        activeLiveOrder,
        setActiveLiveOrder,
        placeOrder,
        toasts,
        showToast,
        removeToast,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
