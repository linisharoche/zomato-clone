import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RESTAURANTS, COUPONS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import {
  Star,
  Clock,
  MapPin,
  Heart,
  Share2,
  Tag,
  Search,
  Plus,
  Minus,
  Sparkles,
  ChevronRight,
  Info,
  Check,
  ShoppingBag,
  Flame,
  MessageSquarePlus,
  Send,
} from 'lucide-react';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const restaurant = RESTAURANTS.find((r) => r.id === id) || RESTAURANTS[0];

  const {
    cartItems,
    addToCart,
    updateQuantity,
    isFavourite,
    toggleFavourite,
    setCartDrawerOpen,
    applyCoupon,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'reviews' | 'info'
  const [menuSearch, setMenuSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [bestsellerOnly, setBestsellerOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Review submission form state
  const [reviewsList, setReviewsList] = useState(restaurant.reviews || []);
  const [newReview, setNewReview] = useState({ author: '', rating: 5, text: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const favourite = isFavourite(restaurant.id);

  // Filtered menu items
  const filteredMenu = useMemo(() => {
    let items = restaurant.menu || [];

    if (selectedCategory !== 'All') {
      items = items.filter((i) => i.category === selectedCategory);
    }

    if (vegOnly) {
      items = items.filter((i) => i.isVeg);
    }

    if (bestsellerOnly) {
      items = items.filter((i) => i.isBestSeller);
    }

    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase().trim();
      items = items.filter(
        (i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      );
    }

    return items;
  }, [restaurant.menu, selectedCategory, vegOnly, bestsellerOnly, menuSearch]);

  // Group filtered items by category
  const categoriesInMenu = useMemo(() => {
    const cats = ['All', ...new Set(restaurant.menu.map((i) => i.category))];
    return cats;
  }, [restaurant.menu]);

  // Handle adding review
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.text.trim()) {
      showToast('Please enter your review comments', 'error');
      return;
    }
    const createdReview = {
      id: `rev-${Date.now()}`,
      author: newReview.author.trim() || 'Food Lover',
      rating: Number(newReview.rating),
      date: 'Just now',
      text: newReview.text.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    };
    setReviewsList([createdReview, ...reviewsList]);
    setNewReview({ author: '', rating: 5, text: '' });
    setShowReviewForm(false);
    showToast('Thank you! Your review has been published.', 'success');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Restaurant link copied to clipboard!', 'success');
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen pb-20">
      {/* 1. Header Cover & Gallery */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full bg-gray-900 overflow-hidden">
        <img
          src={restaurant.coverImage || restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

        {/* Action buttons Top Right */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-white hover:text-gray-900 transition-all shadow-md"
            title="Share Restaurant"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleFavourite(restaurant.id)}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
              favourite
                ? 'bg-rose-50 text-rose-600 scale-110'
                : 'bg-black/40 text-white hover:bg-white hover:text-rose-600'
            }`}
            title="Save to Favourites"
          >
            <Heart className={`w-4 h-4 ${favourite ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>
        </div>

        {/* Restaurant Header Info Overlay */}
        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-zomato-600 text-white text-xs font-black uppercase tracking-wider">
                  {restaurant.discount || 'Special Discounts Available'}
                </span>
                {restaurant.isPureVeg && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold uppercase">
                    Pure Veg
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                {restaurant.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                {restaurant.cuisines.join(', ')} • {restaurant.location}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-300 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {restaurant.deliveryTime}
                </span>
                <span>•</span>
                <span>₹{restaurant.costForTwo} for two</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">Open Now: {restaurant.openingHours}</span>
              </div>
            </div>

            {/* Ratings Cards */}
            <div className="flex items-center gap-3 self-start md:self-auto">
              <div className="p-2.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 text-center min-w-[80px]">
                <div className="flex items-center justify-center gap-1 text-sm font-extrabold text-white">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-xs">
                    {restaurant.deliveryRating} ★
                  </span>
                </div>
                <p className="text-[10px] text-gray-300 uppercase tracking-wider font-semibold mt-1">
                  {restaurant.reviewsCount} Delivery
                </p>
              </div>

              <div className="p-2.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 text-center min-w-[80px]">
                <div className="flex items-center justify-center gap-1 text-sm font-extrabold text-white">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-xs">
                    {restaurant.diningRating} ★
                  </span>
                </div>
                <p className="text-[10px] text-gray-300 uppercase tracking-wider font-semibold mt-1">
                  Dining Out
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Navigation Tabs: Order Online, Reviews, Photos */}
        <div className="flex items-center gap-6 border-b border-gray-200 dark:border-gray-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('menu')}
            className={`text-base font-extrabold pb-2 border-b-2 transition-all ${
              activeTab === 'menu'
                ? 'border-zomato-600 text-zomato-600 dark:text-zomato-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            Order Online
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`text-base font-extrabold pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-zomato-600 text-zomato-600 dark:text-zomato-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <span>Reviews</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {reviewsList.length}
            </span>
          </button>
        </div>

        {/* Available Coupons Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 dark:from-zomato-950/40 dark:to-amber-950/20 border border-red-100 dark:border-zomato-900/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zomato-600 text-white flex items-center justify-center font-bold shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zomato-700 dark:text-zomato-300">
                Exclusive Deals at this Restaurant
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Get up to 50% OFF with code <strong className="font-extrabold text-gray-900 dark:text-white">ZOMA50</strong> or Free Delivery with <strong className="font-extrabold text-gray-900 dark:text-white">FREESHIP</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {COUPONS.slice(0, 2).map((c) => (
              <button
                key={c.code}
                onClick={() => applyCoupon(c.code)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-red-200 dark:border-gray-700 text-xs font-bold text-zomato-600 dark:text-zomato-400 hover:bg-zomato-50 transition-colors shadow-xs"
              >
                Use {c.code}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Menu & Online Ordering */}
        {activeTab === 'menu' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Sidebar: Categories Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-white dark:bg-gray-800/90 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-subtle space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-2 mb-2">
                  Menu Sections
                </h3>
                <div className="space-y-1">
                  {categoriesInMenu.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedCategory === cat
                          ? 'bg-red-50 dark:bg-zomato-950/50 text-zomato-600 dark:text-zomato-400 font-extrabold'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Menu Controls & Dishes List */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Search in Menu & Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                {/* Search dishes */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search dishes in this restaurant..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-zomato-500"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setVegOnly(!vegOnly)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      vegOnly
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
                    <span>Veg Only</span>
                  </button>

                  <button
                    onClick={() => setBestsellerOnly(!bestsellerOnly)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      bestsellerOnly
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Bestseller</span>
                  </button>
                </div>
              </div>

              {/* Dishes Count */}
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {selectedCategory} Dishes ({filteredMenu.length})
              </div>

              {/* Dishes Cards Grid / List */}
              {filteredMenu.length === 0 ? (
                <div className="p-12 text-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800">
                  No dishes found matching your search.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMenu.map((dish) => {
                    const cartItem = cartItems.find((i) => i.id === dish.id);
                    const qtyInCart = cartItem?.quantity || 0;

                    return (
                      <div
                        key={dish.id}
                        className="p-4 sm:p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-subtle hover:shadow-card transition-all flex flex-col sm:flex-row justify-between gap-4"
                      >
                        {/* Dish Details */}
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className={dish.isVeg ? 'veg-badge' : 'non-veg-badge'}>
                              <span className={dish.isVeg ? 'veg-dot' : 'non-veg-dot'}></span>
                            </span>
                            {dish.isBestSeller && (
                              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold uppercase">
                                ★ Bestseller
                              </span>
                            )}
                            {dish.isSpicy && (
                              <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-600 text-[10px] font-bold">
                                🌶️ Spicy
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-bold text-gray-900 dark:text-white">
                            {dish.name}
                          </h3>

                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                              ₹{dish.price}
                            </span>
                            {dish.originalPrice && (
                              <span className="text-xs text-gray-400 line-through">
                                ₹{dish.originalPrice}
                              </span>
                            )}
                          </div>

                          {dish.rating && (
                            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              <span>★ {dish.rating}</span>
                              <span className="text-gray-400">({dish.ratingCount} reviews)</span>
                            </div>
                          )}

                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl">
                            {dish.description}
                          </p>
                        </div>

                        {/* Dish Image & Add Button */}
                        <div className="relative w-full sm:w-36 h-36 sm:h-32 shrink-0 self-center sm:self-start">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            loading="lazy"
                            className="w-full h-full object-cover rounded-2xl shadow-sm"
                          />

                          {/* Dynamic Add / Quantity Controller Button */}
                          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-28">
                            {qtyInCart > 0 ? (
                              <div className="flex items-center justify-between bg-white dark:bg-gray-900 border-2 border-zomato-600 rounded-xl px-2 py-1 shadow-md">
                                <button
                                  onClick={() => updateQuantity(dish.id, -1)}
                                  className="p-1 text-zomato-600 font-black hover:bg-red-50 dark:hover:bg-gray-800 rounded"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs font-black text-gray-900 dark:text-white">
                                  {qtyInCart}
                                </span>
                                <button
                                  onClick={() => updateQuantity(dish.id, 1)}
                                  className="p-1 text-zomato-600 font-black hover:bg-red-50 dark:hover:bg-gray-800 rounded"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(dish, restaurant)}
                                className="w-full py-1.5 px-3 rounded-xl bg-white dark:bg-gray-900 border-2 border-zomato-600 hover:bg-zomato-600 hover:text-white text-zomato-600 font-black text-xs uppercase tracking-wider shadow-md transition-all hover:scale-105"
                              >
                                ADD +
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Reviews Section */}
        {activeTab === 'reviews' && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Reviews Summary Header */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-18 h-18 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center p-3 shadow-md">
                  <span className="text-2xl font-black">{restaurant.rating}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Out of 5</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Overall Restaurant Rating
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Based on {restaurant.reviewsCount} customer experiences & delivery ratings
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="py-2.5 px-5 rounded-xl bg-zomato-600 hover:bg-zomato-700 text-white font-bold text-xs shadow-md shadow-zomato-600/30 flex items-center gap-2 transition-all hover:scale-105"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>{showReviewForm ? 'Cancel Review' : 'Write a Review'}</span>
              </button>
            </div>

            {/* Interactive Write a Review Form */}
            {showReviewForm && (
              <form
                onSubmit={handleReviewSubmit}
                className="p-6 bg-red-50/50 dark:bg-zomato-950/20 rounded-3xl border border-red-100 dark:border-zomato-900/50 space-y-4 animate-scale-in"
              >
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Share your culinary experience
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Vikram Joshi"
                      value={newReview.author}
                      onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-zomato-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Rating (1 to 5 Stars)
                    </label>
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-zomato-500"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ 5 - Exceptional</option>
                      <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                      <option value="3">⭐⭐⭐ 3 - Average</option>
                      <option value="2">⭐⭐ 2 - Poor</option>
                      <option value="1">⭐ 1 - Terrible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Your Thoughts & Feedback
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about the taste, packaging, hygiene, and favorite dishes..."
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-zomato-500"
                  />
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-zomato-600 hover:bg-zomato-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Verified Review</span>
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-subtle space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.avatar}
                        alt={rev.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                          {rev.author}
                        </h4>
                        <p className="text-[10px] text-gray-400">{rev.date}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-xs font-black">
                      <span>{rev.rating}</span>
                      <Star className="w-3 h-3 fill-white" />
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {rev.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Floating Bottom Cart Bar (if items exist) */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-14 md:bottom-6 left-4 right-4 z-30 max-w-xl mx-auto animate-slide-up">
          <div
            onClick={() => setCartDrawerOpen(true)}
            className="p-3 sm:p-4 rounded-2xl bg-zomato-600 text-white shadow-2xl flex items-center justify-between cursor-pointer hover:bg-zomato-700 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm">
                {totalCartCount}
              </div>
              <div>
                <p className="text-xs uppercase font-extrabold tracking-wider opacity-80 leading-none">
                  {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} in cart
                </p>
                <p className="text-sm font-black leading-tight mt-0.5">
                  View Order & Checkout
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-bold text-sm bg-white/20 py-1.5 px-3 rounded-xl">
              <span>View Cart</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
