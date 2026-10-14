import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Home, Compass, Heart, Package, ShoppingBag } from 'lucide-react';

export default function MobileBottomNav() {
  const { cartItems, favourites, setCartDrawerOpen } = useApp();
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 py-1.5 px-3">
      <div className="flex items-center justify-around">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold transition-colors ${
              isActive ? 'text-zomato-600 dark:text-zomato-400' : 'text-gray-500 dark:text-gray-400'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/restaurants"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold transition-colors ${
              isActive ? 'text-zomato-600 dark:text-zomato-400' : 'text-gray-500 dark:text-gray-400'
            }`
          }
        >
          <Compass className="w-5 h-5" />
          <span>Explore</span>
        </NavLink>

        <NavLink
          to="/favourites"
          className={({ isActive }) =>
            `relative flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold transition-colors ${
              isActive ? 'text-zomato-600 dark:text-zomato-400' : 'text-gray-500 dark:text-gray-400'
            }`
          }
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {favourites.length > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
                {favourites.length}
              </span>
            )}
          </div>
          <span>Saved</span>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold transition-colors ${
              isActive ? 'text-zomato-600 dark:text-zomato-400' : 'text-gray-500 dark:text-gray-400'
            }`
          }
        >
          <Package className="w-5 h-5" />
          <span>Orders</span>
        </NavLink>

        <button
          onClick={() => setCartDrawerOpen(true)}
          className="relative flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-bold text-gray-500 dark:text-gray-400"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-zomato-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                {totalCartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>
      </div>
    </div>
  );
}
