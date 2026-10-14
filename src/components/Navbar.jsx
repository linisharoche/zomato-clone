import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Search,
  ShoppingBag,
  Heart,
  Moon,
  Sun,
  User,
  ChevronDown,
  Menu,
  X,
  Compass,
  Clock,
  UtensilsCrossed,
  Check,
  LogOut,
  Package,
} from 'lucide-react';
import { CITIES, RESTAURANTS, CUISINES_LIST } from '../data/mockData';

export default function Navbar() {
  const {
    darkMode,
    toggleDarkMode,
    selectedCity,
    setSelectedCity,
    selectedArea,
    setSelectedArea,
    user,
    logout,
    cartItems,
    grandTotal,
    setCartDrawerOpen,
    favourites,
    setAuthModalOpen,
    setAuthMode,
    showToast,
  } = useApp();

  const navigate = useNavigate();
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const locationRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setLocationDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results
  const queryLower = searchQuery.toLowerCase().trim();
  const matchedRestaurants = queryLower
    ? RESTAURANTS.filter(
        (r) =>
          r.name.toLowerCase().includes(queryLower) ||
          r.cuisines.some((c) => c.toLowerCase().includes(queryLower))
      ).slice(0, 4)
    : [];

  const matchedDishes = queryLower
    ? RESTAURANTS.flatMap((r) =>
        r.menu
          .filter((dish) => dish.name.toLowerCase().includes(queryLower))
          .map((dish) => ({ ...dish, restaurantId: r.id, restaurantName: r.name }))
      ).slice(0, 4)
    : [];

  const matchedCuisines = queryLower
    ? CUISINES_LIST.filter((c) => c.name.toLowerCase().includes(queryLower)).slice(0, 3)
    : [];

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSimulateGPS = () => {
    showToast('Detecting current GPS location...', 'info');
    setTimeout(() => {
      setSelectedCity(CITIES[0]);
      setSelectedArea('Indiranagar (Current)');
      setLocationDropdownOpen(false);
      showToast('Location updated: Indiranagar, Bengaluru', 'success');
    }, 600);
  };

  const handleSelectSearchResult = (type, item) => {
    setSearchFocused(false);
    setSearchQuery('');
    if (type === 'restaurant') {
      navigate(`/restaurant/${item.id}`);
    } else if (type === 'dish') {
      navigate(`/restaurant/${item.restaurantId}`);
    } else if (type === 'cuisine') {
      navigate(`/restaurants?cuisine=${encodeURIComponent(item.name)}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchFocused(false);
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left: Brand Logo & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-zomato-500 to-zomato-700 text-white flex items-center justify-center font-black text-2xl italic shadow-md shadow-zomato-500/25 group-hover:scale-105 transition-transform">
              Z
            </div>
            <div className="hidden xs:block">
              <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                Zoma<span className="text-zomato-600 dark:text-zomato-400">Bite</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 -mt-1">
                Food & Delivery
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Location + Search Bar (Desktop / Tablet) */}
        <div className="hidden md:flex flex-1 max-w-2xl items-center bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-1.5 shadow-subtle relative">
          
          {/* Location Trigger */}
          <div className="relative" ref={locationRef}>
            <button
              type="button"
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
            >
              <MapPin className="w-4 h-4 text-zomato-600 shrink-0" />
              <span className="max-w-[120px] truncate">{selectedArea}, {selectedCity.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {/* Location Selector Dropdown */}
            {locationDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700 p-3 z-50 animate-scale-in">
                <button
                  type="button"
                  onClick={handleSimulateGPS}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-red-50 dark:bg-zomato-950/40 text-zomato-600 dark:text-zomato-400 text-xs font-bold hover:bg-red-100 transition-colors mb-3"
                >
                  <Compass className="w-4 h-4 animate-spin" />
                  <span>Detect my current location</span>
                </button>

                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1.5">
                  Select Popular City
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {CITIES.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        setSelectedCity(city);
                        setSelectedArea(city.areas[0]);
                        setLocationDropdownOpen(false);
                        showToast(`Switched city to ${city.name}`, 'info');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                        selectedCity.id === city.id
                          ? 'bg-gray-100 dark:bg-gray-700 text-zomato-600 dark:text-zomato-400 font-bold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <span>{city.name}</span>
                      {selectedCity.id === city.id && <Check className="w-3.5 h-3.5 text-zomato-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* Search Input */}
          <div className="relative flex-1" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
              <Search className="w-4 h-4 text-gray-400 ml-2 shrink-0" />
              <input
                type="text"
                placeholder="Search for restaurant, cuisine, or a dish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full bg-transparent px-3 py-1.5 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mr-2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Live Search Suggestions Dropdown */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700 p-3 z-50 animate-scale-in max-h-96 overflow-y-auto">
                {queryLower ? (
                  <>
                    {matchedRestaurants.length === 0 &&
                    matchedDishes.length === 0 &&
                    matchedCuisines.length === 0 ? (
                      <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400">
                        No results found for "{searchQuery}". Try "Biryani", "Pizza", or "Burger".
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Restaurants */}
                        {matchedRestaurants.length > 0 && (
                          <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">
                              Restaurants
                            </div>
                            {matchedRestaurants.map((r) => (
                              <button
                                key={r.id}
                                onClick={() => handleSelectSearchResult('restaurant', r)}
                                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/60 text-left transition-colors"
                              >
                                <img
                                  src={r.image}
                                  alt={r.name}
                                  className="w-9 h-9 rounded-lg object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                    {r.name}
                                  </p>
                                  <p className="text-[11px] text-gray-500 truncate">
                                    {r.cuisines.join(', ')} • {r.deliveryTime}
                                  </p>
                                </div>
                                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                  ★ {r.rating}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Dishes */}
                        {matchedDishes.length > 0 && (
                          <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">
                              Dishes
                            </div>
                            {matchedDishes.map((d) => (
                              <button
                                key={d.id}
                                onClick={() => handleSelectSearchResult('dish', d)}
                                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/60 text-left transition-colors"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className={d.isVeg ? 'veg-badge' : 'non-veg-badge'}>
                                    <span className={d.isVeg ? 'veg-dot' : 'non-veg-dot'}></span>
                                  </span>
                                  <div className="truncate">
                                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                                      {d.name}
                                    </p>
                                    <p className="text-[10px] text-gray-400 truncate">
                                      at {d.restaurantName}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-xs font-bold text-gray-900 dark:text-white shrink-0 ml-2">
                                  ₹{d.price}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      Popular Searches
                    </div>
                    <div className="flex flex-wrap gap-1.5 px-2">
                      {['Hyderabadi Biryani', 'Woodfired Pizza', 'Cheeseburger', 'Butter Chicken', 'Momos', 'Tiramisu'].map(
                        (tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              setSearchQuery(tag);
                              navigate(`/search?q=${encodeURIComponent(tag)}`);
                              setSearchFocused(false);
                            }}
                            className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg hover:bg-red-50 hover:text-zomato-600 transition-colors"
                          >
                            {tag}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 sm:p-2.5 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Favourites Shortcut */}
          <Link
            to="/favourites"
            className="relative p-2 sm:p-2.5 text-gray-600 dark:text-gray-300 hover:text-zomato-600 dark:hover:text-zomato-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Favourites"
            aria-label="Wishlist favourites"
          >
            <Heart className="w-5 h-5" />
            {favourites.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-zomato-600 text-white rounded-full text-[10px] font-black flex items-center justify-center">
                {favourites.length}
              </span>
            )}
          </Link>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-zomato-950/40 hover:bg-zomato-100 text-zomato-600 dark:text-zomato-400 font-bold text-xs transition-all hover:scale-105"
            aria-label="View shopping cart"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            {totalCartCount > 0 ? (
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-zomato-600 text-white flex items-center justify-center text-[10px] font-black">
                  {totalCartCount}
                </span>
                <span className="hidden sm:inline font-black">₹{grandTotal}</span>
              </div>
            ) : (
              <span className="hidden sm:inline">Cart</span>
            )}
          </button>

          {/* User Auth / Profile Dropdown */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover ring-2 ring-zomato-500/20"
                />
                <span className="hidden lg:inline text-xs font-bold text-gray-800 dark:text-gray-200 max-w-[90px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 mr-1" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700 py-2 z-50 animate-scale-in">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                      {user.membership}
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Package className="w-4 h-4 text-gray-400" />
                    <span>Past Orders & History</span>
                  </Link>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }}
                className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-zomato-600 transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setAuthModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-zomato-600 hover:bg-zomato-700 text-white text-xs font-bold shadow-md shadow-zomato-600/30 transition-all hover:scale-105"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search & Navigation Dropdown */}
      {mobileNavOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-white dark:bg-gray-900 animate-slide-up">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search dishes or restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none"
            />
          </form>

          {/* Mobile Links */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link
              to="/restaurants?tab=delivery"
              onClick={() => setMobileNavOpen(false)}
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-center text-xs font-bold text-gray-800 dark:text-gray-200"
            >
              🛵 Delivery
            </Link>
            <Link
              to="/restaurants?tab=dining"
              onClick={() => setMobileNavOpen(false)}
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-center text-xs font-bold text-gray-800 dark:text-gray-200"
            >
              🍽️ Dining Out
            </Link>
            <Link
              to="/restaurants?tab=nightlife"
              onClick={() => setMobileNavOpen(false)}
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-center text-xs font-bold text-gray-800 dark:text-gray-200"
            >
              🍸 Nightlife
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileNavOpen(false)}
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-center text-xs font-bold text-gray-800 dark:text-gray-200"
            >
              📦 My Orders
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
