import React from 'react';
import { Bike, Utensils, Wine } from 'lucide-react';

export default function CategoryTabs({ activeCategory, onCategoryChange }) {
  const tabs = [
    {
      id: 'delivery',
      label: 'Delivery',
      subtitle: 'Fast doorstep delivery',
      icon: Bike,
      activeColor: 'text-zomato-600 border-zomato-600 bg-red-50/70 dark:bg-zomato-950/40',
      iconBg: 'bg-red-100 text-zomato-600 dark:bg-zomato-900/60 dark:text-zomato-400',
    },
    {
      id: 'dining',
      label: 'Dining Out',
      subtitle: 'Explore curated menus & tables',
      icon: Utensils,
      activeColor: 'text-blue-600 border-blue-600 bg-blue-50/70 dark:bg-blue-950/40',
      iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-400',
    },
    {
      id: 'nightlife',
      label: 'Nightlife',
      subtitle: 'Pubs, lounges & live vibes',
      icon: Wine,
      activeColor: 'text-purple-600 border-purple-600 bg-purple-50/70 dark:bg-purple-950/40',
      iconBg: 'bg-purple-100 text-purple-600 dark:bg-purple-900/60 dark:text-purple-400',
    },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onCategoryChange(tab.id)}
                className={`flex items-center gap-3 pb-3 sm:pb-4 border-b-3 transition-all whitespace-nowrap shrink-0 group ${
                  isActive
                    ? `${tab.activeColor} border-b-zomato-600 font-bold`
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs ${
                    isActive ? tab.iconBg : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className={`text-base font-extrabold ${isActive ? 'text-gray-900 dark:text-white' : ''}`}>
                    {tab.label}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium hidden sm:block">
                    {tab.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
