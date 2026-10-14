import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  MapPin,
  Heart,
  Package,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  LogOut,
  Sparkles,
  Home,
  Briefcase,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import { RESTAURANTS } from '../data/mockData';

export default function ProfilePage() {
  const {
    user,
    logout,
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    deleteAddress,
    favourites,
    orders,
    setAuthModalOpen,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState('addresses'); // 'addresses' | 'favourites' | 'settings'
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddr, setNewAddr] = useState({ title: 'Home', tag: 'home', fullAddress: '', phone: user?.phone || '' });

  const favRestaurants = RESTAURANTS.filter((r) => favourites.includes(r.id));

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddr.fullAddress.trim()) {
      showToast('Please enter an address', 'error');
      return;
    }
    addAddress(newAddr);
    setShowAddModal(false);
    setNewAddr({ title: 'Home', tag: 'home', fullAddress: '', phone: user?.phone || '' });
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-18 h-18 rounded-full bg-red-50 dark:bg-gray-800 flex items-center justify-center text-3xl mb-4">
          👤
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Please log in to view your profile
        </h2>
        <p className="text-xs text-gray-500 max-w-sm mb-6">
          Access your saved delivery addresses, order history, and favourite restaurants.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-6 py-2.5 rounded-xl bg-zomato-600 hover:bg-zomato-700 text-white font-bold text-xs shadow-md"
        >
          Log In or Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/60 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header Banner */}
        <div className="p-6 sm:p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-subtle mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl object-cover ring-4 ring-zomato-500/20 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase">
                  Gold
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.email} • {user.phone}</p>
              <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Account & Preferred Foodie</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-rose-600 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors self-end sm:self-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'addresses'
                ? 'bg-zomato-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('favourites')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'favourites'
                ? 'bg-zomato-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Favourites ({favRestaurants.length})</span>
          </button>

          <Link
            to="/orders"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>Past Orders ({orders.length})</span>
          </Link>
        </div>

        {/* Tab 1: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Manage Delivery Locations
              </h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zomato-600 hover:bg-zomato-700 text-white text-xs font-bold shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            {/* Add Address Modal */}
            {showAddModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-scale-in">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">
                    Add New Delivery Address
                  </h3>
                  <form onSubmit={handleAddAddress} className="space-y-3">
                    <div className="flex gap-2">
                      {['Home', 'Work', 'Other'].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setNewAddr({ ...newAddr, title: tag, tag: tag.toLowerCase() })}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${
                            newAddr.title === tag
                              ? 'bg-zomato-600 text-white border-zomato-600'
                              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Full Address Details
                      </label>
                      <textarea
                        rows={3}
                        placeholder="House / Flat no., Floor, Landmark, City..."
                        value={newAddr.fullAddress}
                        onChange={(e) => setNewAddr({ ...newAddr, fullAddress: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-zomato-600 text-white text-xs font-bold"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-5 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-subtle flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {addr.tag === 'home' ? (
                          <Home className="w-4 h-4 text-zomato-600" />
                        ) : (
                          <Briefcase className="w-4 h-4 text-blue-600" />
                        )}
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                          {addr.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                        title="Delete Address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                      {addr.fullAddress}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">{addr.phone}</span>
                    <button
                      onClick={() => {
                        setSelectedAddress(addr);
                        showToast(`Primary address set to ${addr.title}`, 'info');
                      }}
                      className={`text-xs font-bold ${
                        selectedAddress?.id === addr.id
                          ? 'text-emerald-600 flex items-center gap-1'
                          : 'text-zomato-600 hover:underline'
                      }`}
                    >
                      {selectedAddress?.id === addr.id ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Default Delivery Address</span>
                        </>
                      ) : (
                        'Set as Default'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Favourites */}
        {activeTab === 'favourites' && (
          <div>
            {favRestaurants.length === 0 ? (
              <div className="py-16 text-center bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
                <Heart className="w-12 h-12 text-rose-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  No favourite restaurants saved
                </h3>
                <p className="text-xs text-gray-500 mt-1 mb-4">
                  Tap the heart on any restaurant card to save your favorite spots here.
                </p>
                <Link
                  to="/restaurants"
                  className="px-5 py-2 rounded-xl bg-zomato-600 text-white font-bold text-xs"
                >
                  Explore Restaurants
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
