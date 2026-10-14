import React from 'react';
import { CUISINES_LIST } from '../data/mockData';

export default function CuisineCarousel({ selectedCuisine, onSelectCuisine }) {
  return (
    <div className="py-6 sm:py-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Inspiration for your first order
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Explore top handpicked cuisines trending around you
          </p>
        </div>
        {selectedCuisine && (
          <button
            onClick={() => onSelectCuisine(null)}
            className="text-xs font-bold text-zomato-600 dark:text-zomato-400 hover:underline"
          >
            Clear cuisine filter
          </button>
        )}
      </div>

      <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-2">
        {CUISINES_LIST.map((cuisine) => {
          const isSelected = selectedCuisine?.toLowerCase() === cuisine.name.toLowerCase();
          return (
            <button
              key={cuisine.id}
              onClick={() => onSelectCuisine(isSelected ? null : cuisine.name)}
              className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none"
            >
              <div
                className={`relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-subtle group-hover:shadow-hover transition-all duration-300 p-1 ${
                  isSelected
                    ? 'ring-4 ring-zomato-500 scale-105'
                    : 'ring-2 ring-transparent group-hover:scale-105'
                }`}
              >
                <img
                  src={cuisine.image}
                  alt={cuisine.name}
                  loading="lazy"
                  className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 rounded-full transition-colors" />
              </div>
              <span
                className={`text-xs sm:text-sm font-bold tracking-tight text-center transition-colors ${
                  isSelected
                    ? 'text-zomato-600 dark:text-zomato-400'
                    : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                }`}
              >
                {cuisine.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
