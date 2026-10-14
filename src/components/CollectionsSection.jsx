import React from 'react';
import { COLLECTIONS } from '../data/mockData';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CollectionsSection() {
  const navigate = useNavigate();

  return (
    <div className="py-8 sm:py-10 bg-gray-50/80 dark:bg-gray-900/60 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-y border-gray-100 dark:border-gray-800/80 my-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zomato-600 dark:text-zomato-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Handcrafted Guides</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Collections
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Explore curated lists of top restaurants, cafes, pubs, and bars based on trends
            </p>
          </div>
          <button
            onClick={() => navigate('/restaurants')}
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-zomato-600 dark:text-zomato-400 hover:text-zomato-700 transition-colors group self-start sm:self-auto"
          >
            <span>All collections in Bengaluru</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {COLLECTIONS.map((col) => (
            <div
              key={col.id}
              onClick={() => navigate('/restaurants')}
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden cursor-pointer shadow-subtle hover:shadow-card transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={col.image}
                alt={col.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Tag Top Right */}
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase border border-white/20">
                  {col.tag}
                </span>
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-lg font-extrabold leading-tight group-hover:text-amber-300 transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs text-gray-300 mt-1 line-clamp-1">
                  {col.subtitle}
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 mt-2">
                  <span>{col.placesCount}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
