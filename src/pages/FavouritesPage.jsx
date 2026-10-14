import React from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import { RESTAURANTS } from '../data/mockData';
import { Heart, Compass, ArrowRight } from 'lucide-react';

export default function FavouritesPage() {
  const { favourites } = useApp();
  const favRestaurants = RESTAURANTS.filter((r) => favourites.includes(r.id));

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/60 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-rose-600" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Your Saved Favourites
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Instant access to your handpicked culinary hubs and frequent food cravings
            </p>
          </div>

          <Link
            to="/restaurants"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-xs"
          >
            <Compass className="w-4 h-4 text-zomato-600" />
            <span>Discover More</span>
          </Link>
        </div>

        {favRestaurants.length === 0 ? (
          <div className="py-24 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 max-w-lg mx-auto">
            <div className="w-20 h-20 mx-auto rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-500 flex items-center justify-center mb-4">
              <Heart className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              No saved restaurants yet
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-6">
              Whenever you find a restaurant or dish you love, click the heart icon to save it here for quick re-ordering.
            </p>
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-zomato-600 hover:bg-zomato-700 text-white font-bold text-xs shadow-md shadow-zomato-600/30 transition-all hover:scale-105"
            >
              <span>Explore Restaurants</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {favRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
