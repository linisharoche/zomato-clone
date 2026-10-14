import React, { useState } from 'react';
import { SlidersHorizontal, ArrowUpDown, Check, X, Star, Clock, Tag, Sparkles } from 'lucide-react';

export default function FilterBar({
  filters,
  setFilters,
  sortBy,
  setSortBy,
  totalResults,
}) {
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const sortOptions = [
    { id: 'popularity', label: 'Popularity & Relevance' },
    { id: 'rating', label: 'Rating: High to Low' },
    { id: 'deliveryTime', label: 'Delivery Time: Fastest' },
    { id: 'costLowHigh', label: 'Cost: Low to High' },
    { id: 'costHighLow', label: 'Cost: High to Low' },
  ];

  const hasActiveFilters =
    filters.rating4Plus ||
    filters.pureVeg ||
    filters.under30Min ||
    filters.hasOffers ||
    filters.priceLevel ||
    filters.cuisine;

  const clearAllFilters = () => {
    setFilters({
      rating4Plus: false,
      pureVeg: false,
      under30Min: false,
      hasOffers: false,
      priceLevel: null,
      cuisine: null,
    });
    setSortBy('popularity');
  };

  return (
    <div className="py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Filter Pills List */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Rating 4.0+ */}
          <button
            onClick={() => setFilters((prev) => ({ ...prev, rating4Plus: !prev.rating4Plus }))}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              filters.rating4Plus
                ? 'bg-zomato-600 border-zomato-600 text-white shadow-xs'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filters.rating4Plus ? 'fill-white' : 'text-amber-500 fill-amber-500'}`} />
            <span>Rating 4.0+</span>
            {filters.rating4Plus && <X className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          {/* Pure Veg */}
          <button
            onClick={() => setFilters((prev) => ({ ...prev, pureVeg: !prev.pureVeg }))}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              filters.pureVeg
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
            <span>Pure Veg</span>
            {filters.pureVeg && <X className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          {/* Under 30 mins */}
          <button
            onClick={() => setFilters((prev) => ({ ...prev, under30Min: !prev.under30Min }))}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              filters.under30Min
                ? 'bg-zomato-600 border-zomato-600 text-white shadow-xs'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Fast Delivery (&lt; 30 mins)</span>
            {filters.under30Min && <X className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          {/* Great Offers */}
          <button
            onClick={() => setFilters((prev) => ({ ...prev, hasOffers: !prev.hasOffers }))}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              filters.hasOffers
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Great Offers</span>
            {filters.hasOffers && <X className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          {/* Price Range Pills */}
          <div className="hidden sm:flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
            {['₹', '₹₹', '₹₹₹'].map((lvl) => (
              <button
                key={lvl}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    priceLevel: prev.priceLevel === lvl ? null : lvl,
                  }))
                }
                className={`px-3 py-2 text-xs font-bold transition-colors ${
                  filters.priceLevel === lvl
                    ? 'bg-zomato-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:border-gray-300 transition-all shadow-xs"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <span>Sort by:</span>
            <span className="text-zomato-600 dark:text-zomato-400 font-extrabold">
              {sortOptions.find((o) => o.id === sortBy)?.label.split(':')[0]}
            </span>
          </button>

          {sortDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700 py-2 z-30 animate-scale-in">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-1.5">
                Sort Options
              </div>
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSortBy(option.id);
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-xs text-left transition-colors ${
                    sortBy === option.id
                      ? 'bg-red-50 dark:bg-zomato-950/40 text-zomato-600 dark:text-zomato-400 font-bold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <span>{option.label}</span>
                  {sortBy === option.id && <Check className="w-4 h-4 text-zomato-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-zomato-500" />
        <span>
          Showing <strong className="text-gray-900 dark:text-white">{totalResults}</strong> restaurants around your area
        </span>
      </div>
    </div>
  );
}
