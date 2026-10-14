import React, { useState, useMemo } from 'react';
import HeroSection from '../components/HeroSection';
import CategoryTabs from '../components/CategoryTabs';
import CuisineCarousel from '../components/CuisineCarousel';
import CollectionsSection from '../components/CollectionsSection';
import FilterBar from '../components/FilterBar';
import RestaurantCard from '../components/RestaurantCard';
import { RESTAURANTS, COUPONS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { Sparkles, Tag, ShieldCheck, Flame, Star, Award, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('delivery');
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [sortBy, setSortBy] = useState('popularity');
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    rating4Plus: false,
    pureVeg: false,
    under30Min: false,
    hasOffers: false,
    priceLevel: null,
    cuisine: null,
  });

  // Filter and sort restaurants
  const filteredRestaurants = useMemo(() => {
    let list = RESTAURANTS.filter((r) => r.category.includes(activeCategory));

    if (selectedCuisine) {
      list = list.filter((r) =>
        r.cuisines.some((c) => c.toLowerCase() === selectedCuisine.toLowerCase())
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
  }, [activeCategory, selectedCuisine, filters, sortBy]);

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Category Selector Tabs (Delivery / Dining / Nightlife) */}
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          setActiveCategory(cat);
          setSelectedCuisine(null);
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* 3. Cuisines Carousel */}
        {activeCategory === 'delivery' && (
          <CuisineCarousel
            selectedCuisine={selectedCuisine}
            onSelectCuisine={setSelectedCuisine}
          />
        )}

        {/* 4. Curated Collections Section */}
        <CollectionsSection />

        {/* 5. Promotional Offers Carousel Banner */}
        <div className="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zomato-700 via-rose-600 to-amber-600 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Gourmet Food Carnival
            </span>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2">
              Flat 50% OFF up to ₹100 on your first 3 food orders!
            </h2>
            <p className="text-sm text-red-100 mb-5">
              Use code <strong className="bg-white text-zomato-700 px-2 py-0.5 rounded font-black">ZOMA50</strong> at checkout. Valid on all top rated restaurants.
            </p>
            <button
              onClick={() => navigate('/restaurants')}
              className="py-2.5 px-6 rounded-xl bg-white text-zomato-700 hover:bg-gray-100 font-extrabold text-sm shadow-md transition-all hover:scale-105"
            >
              Order Now & Save
            </button>
          </div>

          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2">
            <div className="w-48 h-48 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-7xl shadow-inner border border-white/20">
              🍔
            </div>
          </div>
        </div>

        {/* 6. Section Heading & Filter Bar */}
        <div className="mt-8 mb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>Popular Restaurants Near You</span>
                <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Explore best-in-town food spots delivering hot and fresh
              </p>
            </div>
          </div>

          {/* Filters component */}
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            totalResults={filteredRestaurants.length}
          />
        </div>

        {/* 7. Restaurants Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-3xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              No matching restaurants found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              We couldn't find any places matching your current filters. Try relaxing your filters or exploring another cuisine.
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
              }}
              className="px-5 py-2.5 rounded-xl bg-zomato-600 text-white font-bold text-sm shadow-md"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}

        {/* 8. Customer Love & Reviews Teaser Section */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-gray-100 dark:border-gray-800">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-zomato-950/40 text-zomato-600 dark:text-zomato-400 text-xs font-bold mb-3">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Verified Customer Stories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Loved by 500,000+ happy foodies
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Read how ZomaBite turns everyday meals into extraordinary memories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 shadow-subtle space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                "The Royal Biryani House dum mutton was delivered piping hot in under 24 minutes! The packaging was tamper-proof, and the meat melted in mouth."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                  alt="Aakash V."
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Aakash Verma</h4>
                  <p className="text-[11px] text-gray-400">Bangalore • 84 Reviews</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 shadow-subtle space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                "Crust & Craft's woodfired pizza crust is unmatched. The live GPS rider tracking was so accurate, I picked it up right at my gate."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Sneha R."
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Sneha Rao</h4>
                  <p className="text-[11px] text-gray-400">Bangalore • 42 Reviews</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 shadow-subtle space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                "The ZomaBite Gold discounts are amazing. Saved ₹100 on my Sunday breakfast idlis and podi dosa from Dakshin Sagar!"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80"
                  alt="Karan M."
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Karan Mehra</h4>
                  <p className="text-[11px] text-gray-400">Bangalore • 19 Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
