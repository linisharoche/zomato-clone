import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { RESTAURANTS, CUISINES_LIST } from '../data/mockData';
import RestaurantCard from '../components/RestaurantCard';
import { useApp } from '../context/AppContext';
import { Search, Plus, Minus, ArrowRight, Utensils, Store } from 'lucide-react';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [tab, setTab] = useState('all'); // 'all' | 'restaurants' | 'dishes'

  const { cartItems, addToCart, updateQuantity } = useApp();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const qLower = query.toLowerCase().trim();

  // Matched restaurants
  const matchedRestaurants = useMemo(() => {
    if (!qLower) return [];
    return RESTAURANTS.filter(
      (r) =>
        r.name.toLowerCase().includes(qLower) ||
        r.cuisines.some((c) => c.toLowerCase().includes(qLower)) ||
        r.location.toLowerCase().includes(qLower)
    );
  }, [qLower]);

  // Matched dishes
  const matchedDishes = useMemo(() => {
    if (!qLower) return [];
    return RESTAURANTS.flatMap((r) =>
      r.menu
        .filter(
          (dish) =>
            dish.name.toLowerCase().includes(qLower) ||
            dish.description.toLowerCase().includes(qLower) ||
            dish.category.toLowerCase().includes(qLower)
        )
        .map((dish) => ({ ...dish, restaurant: r }))
    );
  }, [qLower]);

  const totalResultsCount = matchedRestaurants.length + matchedDishes.length;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/60 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search for restaurants, cuisines or dishes..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm text-gray-900 dark:text-white shadow-card focus:outline-none focus:border-zomato-500"
            />
            <button
              type="submit"
              className="absolute right-2 py-2 px-5 rounded-xl bg-zomato-600 hover:bg-zomato-700 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
            >
              Search
            </button>
          </form>

          {/* Popular searches suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <span className="text-xs text-gray-400">Try searching:</span>
            {['Biryani', 'Pizza', 'Burger', 'Paneer', 'Desserts', 'Momos'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchInput(tag);
                  setSearchParams({ q: tag });
                }}
                className="px-2.5 py-0.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 hover:text-zomato-600 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Title & Tabs */}
        {query ? (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800 mb-6 gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  Results for "<span className="text-zomato-600">{query}</span>"
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Found {totalResultsCount} matching results across restaurants and dishes
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setTab('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    tab === 'all'
                      ? 'bg-zomato-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  All ({totalResultsCount})
                </button>
                <button
                  onClick={() => setTab('restaurants')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    tab === 'restaurants'
                      ? 'bg-zomato-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  Restaurants ({matchedRestaurants.length})
                </button>
                <button
                  onClick={() => setTab('dishes')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    tab === 'dishes'
                      ? 'bg-zomato-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  Dishes ({matchedDishes.length})
                </button>
              </div>
            </div>

            {totalResultsCount === 0 ? (
              <div className="py-20 text-center bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md mx-auto border border-gray-100 dark:border-gray-800">
                <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-gray-800 text-2xl flex items-center justify-center mx-auto mb-3">
                  🔍
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  No matches found for "{query}"
                </h3>
                <p className="text-xs text-gray-500 mt-1 mb-6">
                  Check for typos or try searching for another dish or cuisine.
                </p>
                <Link
                  to="/restaurants"
                  className="px-5 py-2.5 rounded-xl bg-zomato-600 text-white font-bold text-xs shadow-md"
                >
                  Browse All Restaurants
                </Link>
              </div>
            ) : (
              <div className="space-y-10">
                
                {/* 1. Restaurants Match section */}
                {(tab === 'all' || tab === 'restaurants') && matchedRestaurants.length > 0 && (
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Store className="w-4 h-4 text-zomato-600" />
                      <span>Restaurants ({matchedRestaurants.length})</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {matchedRestaurants.map((r) => (
                        <RestaurantCard key={r.id} restaurant={r} />
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Dishes Match section */}
                {(tab === 'all' || tab === 'dishes') && matchedDishes.length > 0 && (
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-zomato-600" />
                      <span>Dishes ({matchedDishes.length})</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {matchedDishes.map((dish) => {
                        const cartItem = cartItems.find((i) => i.id === dish.id);
                        const qtyInCart = cartItem?.quantity || 0;

                        return (
                          <div
                            key={dish.id}
                            className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-subtle flex justify-between gap-4"
                          >
                            <div className="flex-1 space-y-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={dish.isVeg ? 'veg-badge' : 'non-veg-badge'}>
                                  <span className={dish.isVeg ? 'veg-dot' : 'non-veg-dot'}></span>
                                </span>
                                <Link
                                  to={`/restaurant/${dish.restaurant.id}`}
                                  className="text-[11px] font-bold text-zomato-600 dark:text-zomato-400 hover:underline truncate"
                                >
                                  By {dish.restaurant.name}
                                </Link>
                              </div>

                              <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                {dish.name}
                              </h3>
                              <p className="text-xs font-black text-gray-900 dark:text-white">
                                ₹{dish.price}
                              </p>
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2">
                                {dish.description}
                              </p>
                            </div>

                            <div className="relative w-24 h-24 shrink-0">
                              <img
                                src={dish.image}
                                alt={dish.name}
                                className="w-full h-full object-cover rounded-xl"
                              />
                              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20">
                                {qtyInCart > 0 ? (
                                  <div className="flex items-center justify-between bg-white dark:bg-gray-900 border border-zomato-600 rounded-lg px-1.5 py-0.5 text-xs font-bold text-zomato-600 shadow-xs">
                                    <button onClick={() => updateQuantity(dish.id, -1)}>
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span>{qtyInCart}</span>
                                    <button onClick={() => updateQuantity(dish.id, 1)}>
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => addToCart(dish, dish.restaurant)}
                                    className="w-full py-1 rounded-lg bg-white dark:bg-gray-900 border border-zomato-600 text-zomato-600 hover:bg-zomato-600 hover:text-white text-[11px] font-black uppercase shadow-xs transition-colors"
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
                  </div>
                )}

              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              What are you craving today?
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
              Search for your favorite biryanis, burgers, pizzas, cakes, or specific restaurant names.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
