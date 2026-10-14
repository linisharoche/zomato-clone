import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Star, Clock, MapPin, Heart, Sparkles, Tag } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
  const { isFavourite, toggleFavourite } = useApp();
  const favourite = isFavourite(restaurant.id);

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-subtle hover:shadow-hover transition-all duration-300 hover:-translate-y-1.5 flex flex-col">
      {/* Image Banner */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Link to={`/restaurant/${restaurant.id}`} className="block w-full h-full">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Gradient Overlay for bottom text clarity */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

        {/* Badges on Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {restaurant.isPromoted && (
            <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase border border-white/20">
              Promoted
            </span>
          )}
          {restaurant.isPureVeg && (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold tracking-wide uppercase flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              Pure Veg
            </span>
          )}
        </div>

        {/* Wishlist Heart Button Top Right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavourite(restaurant.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all z-10 ${
            favourite
              ? 'bg-rose-50 text-rose-600 shadow-md scale-110'
              : 'bg-black/40 backdrop-blur-md text-white hover:bg-white hover:text-rose-600 hover:scale-110'
          }`}
          aria-label={favourite ? 'Remove from favourites' : 'Save to favourites'}
        >
          <Heart className={`w-4 h-4 ${favourite ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Discount Ribbon Bottom Left */}
        {restaurant.discount && (
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black shadow-md tracking-tight">
              <Tag className="w-3 h-3" />
              {restaurant.discount}
            </span>
          </div>
        )}

        {/* Time & Distance Pill Bottom Right */}
        <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            {restaurant.deliveryTime}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <Link to={`/restaurant/${restaurant.id}`} className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title and Rating Row */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-zomato-600 dark:group-hover:text-zomato-400 transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-xs font-extrabold shrink-0 shadow-xs">
              <span>{restaurant.rating}</span>
              <Star className="w-3 h-3 fill-white" />
            </span>
          </div>

          {/* Cuisines */}
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
            {restaurant.cuisines.join(', ')}
          </p>
        </div>

        {/* Cost & Location Meta */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1 truncate max-w-[150px]">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{restaurant.location}</span>
          </span>
          <span className="font-semibold text-gray-800 dark:text-gray-200 shrink-0">
            ₹{restaurant.costForTwo} for two
          </span>
        </div>
      </Link>
    </div>
  );
}
