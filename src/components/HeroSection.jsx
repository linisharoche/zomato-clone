import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, MapPin, ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { CITIES } from '../data/mockData';

export default function HeroSection() {
  const { selectedCity, setSelectedCity, selectedArea, setSelectedArea, showToast } = useApp();
  const [query, setQuery] = useState('');
  const [citySelectOpen, setCitySelectOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      navigate('/restaurants');
      return;
    }
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const quickPills = [
    { label: '🍗 Biryani', query: 'Biryani' },
    { label: '🍕 Pizza', query: 'Pizza' },
    { label: '🍔 Burgers', query: 'Burger' },
    { label: '🍛 North Indian', query: 'North Indian' },
    { label: '🥢 Momos', query: 'Momos' },
    { label: '🍰 Desserts', query: 'Desserts' },
  ];

  return (
    <div className="relative min-h-[460px] sm:min-h-[520px] flex items-center justify-center overflow-hidden -mt-1 rounded-b-3xl">
      {/* Hero Background Image */}
      <img
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1800&auto=format&fit=crop&q=85"
        alt="ZomaBite Delicious Food Spread"
        className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 filter brightness-75"
      />

      {/* Dark & Zomato Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-12">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-6 animate-fade-in shadow-lg">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Over 2,500+ Top Rated Restaurants In Your City</span>
        </div>

        {/* Big Bold Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-4 drop-shadow-md">
          Discover the best food & drinks <br className="hidden sm:inline" />
          near you in <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-300">{selectedCity.name}</span>
        </h1>

        <p className="text-sm sm:text-lg text-gray-200 max-w-2xl mx-auto mb-8 font-normal drop-shadow">
          Craving authentic Biryani, hot woodfired pizza, or late night desserts? We deliver in 25-30 mins.
        </p>

        {/* Dual Location + Search Input Bar */}
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 shadow-2xl border border-white/20 flex flex-col md:flex-row items-center gap-2">
          
          {/* City / Area Dropdown */}
          <div className="relative w-full md:w-auto">
            <button
              type="button"
              onClick={() => setCitySelectOpen(!citySelectOpen)}
              className="w-full md:w-auto flex items-center justify-between md:justify-start gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-4 h-4 text-zomato-600 shrink-0" />
                <span className="truncate">{selectedArea}, {selectedCity.name}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            </button>

            {citySelectOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700 p-2 z-50 text-left animate-scale-in">
                {CITIES.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      setSelectedCity(city);
                      setSelectedArea(city.areas[0]);
                      setCitySelectOpen(false);
                      showToast(`Location set to ${city.name}`, 'info');
                    }}
                    className={`w-full px-3 py-2 text-xs rounded-xl text-left font-medium transition-colors ${
                      selectedCity.id === city.id
                        ? 'bg-red-50 text-zomato-600 font-bold dark:bg-zomato-950/40'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden md:block h-8 w-px bg-gray-200 dark:bg-gray-700" />

          {/* Search Query Form */}
          <form onSubmit={handleSearch} className="flex-1 flex items-center w-full gap-2">
            <div className="flex-1 flex items-center pl-2">
              <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search for restaurant, cuisine or a dish..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-zomato-600 hover:bg-zomato-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-zomato-600/30 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Quick Search Tag Pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-gray-300 font-medium">Popular:</span>
          {quickPills.map((p) => (
            <button
              key={p.query}
              onClick={() => navigate(`/search?q=${encodeURIComponent(p.query)}`)}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/15 transition-all hover:scale-105"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
