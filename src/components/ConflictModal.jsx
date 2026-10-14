import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, X } from 'lucide-react';

export default function ConflictModal() {
  const { conflictModal, setConflictModal, resolveConflictReplace, cartRestaurant } = useApp();

  if (!conflictModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-scale-in">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={() => setConflictModal({ isOpen: false, pendingItem: null, pendingRestaurant: null })}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Replace cart items?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          Your cart contains items from{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {cartRestaurant?.name || 'another restaurant'}
          </span>
          . Would you like to clear your cart and start a fresh order from{' '}
          <span className="font-semibold text-zomato-600 dark:text-zomato-400">
            {conflictModal.pendingRestaurant?.name}
          </span>
          ?
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setConflictModal({ isOpen: false, pendingItem: null, pendingRestaurant: null })}
            className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Keep Existing
          </button>
          <button
            onClick={resolveConflictReplace}
            className="flex-1 py-2.5 px-4 rounded-xl bg-zomato-600 hover:bg-zomato-700 text-white font-semibold shadow-md shadow-zomato-600/30 transition-all hover:scale-[1.02]"
          >
            Discard & Add
          </button>
        </div>
      </div>
    </div>
  );
}
