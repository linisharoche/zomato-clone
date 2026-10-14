import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryTabs from '../components/CategoryTabs';
import FilterBar from '../components/FilterBar';
import RestaurantCard from '../components/RestaurantCard';
import { RESTAURANTS, CUISINES_LIST } from '../data/mockData';
import { Search, Sparkles, Filter, SlidersHorizontal } from 'lucide-react';

export default function RestaurantListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'delivery';
  const initialCuisine = searchParams.get('cuisine') || null;

  const [activeCategory, setActiveCategory] = useState(initialTab);
  const [selectedCuisine, setSelectedCuisine] = useState(initialCuisine);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');

  const [filters, setFilters] = useState({
    rating4Plus: false,
    pureVeg: false,
    under30Min: false,
    hasOffers: false,
    priceLevel: null,
    cuisine: null,
  });

  useEffect(() => {
    if (initialCuisine) {
      setSelectedCuisine(initialCuisine);
    }
  }, [initialCuisine]);

  const filteredRestaurants = useMemo(() => {
    let list = RESTAURANTS.filter((r) => r.category.includes(activeCategory));

    if (selectedCuisine) {
      list = list.filter((r) =>
        r.cuisines.some((c) => c.toLowerCase() === selectedCuisine.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisines.some((c) => c.toLowerCase().includes(q)) ||
          r.location.toLowerCase().includes(q)
      );
    }

    if (filters.rating4Plus) {
      list = list.filter((r) => r.rating >= 4.0);
    }

    if (filters.pureVeg) {
      list = list.filter((r) => r.isPureVeg);
    }

    if (filters.under30Min) {
      list = list.filter((r) => r.deliveryTimeMin <= 30);
    }

    if (filters.hasOffers) {
      list = list.filter((r) => !!r.discount);
    }

    if (filters.priceLevel) {
      list = list.filter((r) => r.priceLevel === filters.priceLevel);
    }

    // Sort
    const sorted = [...list];
    if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'deliveryTime') {
      sorted.sort((a, b) => a.deliveryTimeMin - b.deliveryTimeMin);
    } else if (sortBy === 'costLowHigh') {
      sorted.sort((a, b) => a.costForTwo - b.costForTwo);
    } else if (sortBy === 'costHighLow') {
      sorted.sort((a, b) => b.costForTwo - a.costForTwo);
    }

    return sorted;
  }, [activeCategory, selectedCuisine, searchQuery, filters, sortBy]);

  return (
    <div className="min-h-screen pb-16">
      {/* Category selector */}
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          setActiveCategory(cat);
          setSearchParams({ tab: cat });
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Header Breadcrumb & Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {activeCategory === 'delivery'
                ? 'Delivery Restaurants'
                : activeCategory === 'dining'
                ? 'Dining Out & Book a Table'
                : 'Nightlife, Pubs & Lounges'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Showing top culinary places in Bengaluru based on your taste
            </p>
          </div>

          {/* In-page search bar */}
          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by name, cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-zomato-500 shadow-xs"
            />
          </div>
        </div>

        {/* Cuisines Quick Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-2">
          <button
            onClick={() => setSelectedCuisine(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              !selectedCuisine
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            All Cuisines
          </button>
          {CUISINES_LIST.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCuisine(selectedCuisine === c.name ? null : c.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                selectedCuisine === c.name
                  ? 'bg-zomato-600 text-white shadow-xs font-bold'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Filter Bar with Sort options */}
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalResults={filteredRestaurants.length}
        />

        {/* Restaurant Cards Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-3xl">
              🍽️
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              No restaurants found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              We couldn't find any places matching your criteria. Try resetting the filters.
            </p>
            <button
              onClick={() => {
                setFilters({
                  rating4Plus: false,
                  pureVeg: false,
                  under30Min: false,
                  hasOffers: false,
                  priceLevel: null,
                  cuisine: null,
                });
                setSelectedCuisine(null);
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-zomato-600 text-white font-bold text-sm shadow-md"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-4">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
