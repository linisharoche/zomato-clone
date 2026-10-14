import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, Check, Bike, ShieldCheck, Sparkles } from 'lucide-react';
import { COUPONS } from '../data/mockData';

export default function CartDrawer() {
  const {
    cartItems,
    cartRestaurant,
    cartDrawerOpen,
    setCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    riderTip,
    setRiderTip,
    itemTotal,
    discountAmount,
    deliveryFee,
    platformFee,
    gstAndTaxes,
    grandTotal,
  } = useApp();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [showCouponsList, setShowCouponsList] = useState(false);

  if (!cartDrawerOpen) return null;

  const handleApplyCoupon = (codeToApply) => {
    const code = codeToApply || couponInput;
    if (!code) return;
    const res = applyCoupon(code);
    if (res.success) {
      setCouponInput('');
      setCouponError('');
      setShowCouponsList(false);
    } else {
      setCouponError(res.message);
    }
  };

  const handleProceedToCheckout = () => {
    setCartDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={() => setCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-gray-900 shadow-2xl flex flex-col border-l border-gray-100 dark:border-gray-800 animate-slide-up">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-zomato-100 dark:bg-zomato-900/30 text-zomato-600 dark:text-zomato-400 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                  Your Order Cart
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-red-50 dark:bg-gray-800 flex items-center justify-center text-3xl">
                  🥘
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                    Good food is always cooking! Go ahead and add some delicious treats from our top restaurants.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCartDrawerOpen(false);
                    navigate('/restaurants');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zomato-600 hover:bg-zomato-700 text-white font-semibold text-sm shadow-md shadow-zomato-600/30 transition-all hover:scale-105"
                >
                  <span>Explore Restaurants</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {/* Restaurant Card Summary */}
                {cartRestaurant && (
                  <div className="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3">
                    <img
                      src={cartRestaurant.image}
                      alt={cartRestaurant.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-sm"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {cartRestaurant.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {cartRestaurant.location}
                      </p>
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Selected Items
                  </h4>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-white dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 shadow-xs hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className={item.isVeg ? 'veg-badge mt-1' : 'non-veg-badge mt-1'}>
                          <span className={item.isVeg ? 'veg-dot' : 'non-veg-dot'}></span>
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            ₹{item.price} each
                          </p>
                        </div>
                      </div>

                      {/* Quantity selector */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-xs">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white w-14 text-right">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupons & Promo section */}
                <div className="p-3.5 bg-red-50/50 dark:bg-zomato-950/20 rounded-2xl border border-red-100 dark:border-zomato-900/40">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                      <Tag className="w-4 h-4 text-zomato-600" />
                      <span>Offers & Coupons</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCouponsList(!showCouponsList)}
                      className="text-xs font-semibold text-zomato-600 dark:text-zomato-400 hover:underline"
                    >
                      {showCouponsList ? 'Hide Coupons' : 'View All'}
                    </button>
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                          <p className="text-xs font-bold tracking-wide">
                            {appliedCoupon.code} APPLIED
                          </p>
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                            {appliedCoupon.type === 'free_delivery'
                              ? 'Free delivery applied'
                              : `Saved ₹${discountAmount} on this order`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs font-bold text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter coupon code (e.g. ZOMA50)"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value.toUpperCase());
                            setCouponError('');
                          }}
                          className="flex-1 px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-zomato-500 uppercase"
                        />
                        <button
                          onClick={() => handleApplyCoupon()}
                          className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold hover:bg-black dark:hover:bg-gray-100 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
                      )}
                    </div>
                  )}

                  {showCouponsList && !appliedCoupon && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-red-100 dark:border-zomato-900/40">
                      {COUPONS.map((c) => (
                        <div
                          key={c.code}
                          className="p-2 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-red-200 dark:border-gray-700 flex items-center justify-between gap-2"
                        >
                          <div>
                            <span className="inline-block px-1.5 py-0.5 bg-red-100 dark:bg-zomato-900/40 text-zomato-700 dark:text-zomato-300 text-[10px] font-bold rounded">
                              {c.code}
                            </span>
                            <p className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                              {c.title}
                            </p>
                            <p className="text-[10px] text-gray-500">{c.description}</p>
                          </div>
                          <button
                            onClick={() => handleApplyCoupon(c.code)}
                            className="px-2.5 py-1 bg-red-50 dark:bg-zomato-900/50 hover:bg-zomato-600 hover:text-white text-zomato-600 text-xs font-bold rounded-lg transition-colors shrink-0"
                          >
                            Apply
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Delivery Tip Selector */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <Bike className="w-3.5 h-3.5 text-zomato-600" />
                      Tip your delivery partner
                    </span>
                    {riderTip > 0 && (
                      <span className="text-xs font-semibold text-zomato-600">₹{riderTip} added</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {[0, 20, 30, 50].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setRiderTip(amount)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          riderTip === amount
                            ? 'bg-zomato-600 border-zomato-600 text-white shadow-xs'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                        }`}
                      >
                        {amount === 0 ? 'None' : `₹${amount}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className="p-3.5 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Bill Details
                  </h4>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Item Total</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₹{itemTotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs text-emerald-600 font-medium">
                      <span>Coupon Discount</span>
                      <span>- ₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      Delivery Partner Fee
                      {deliveryFee === 0 && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1 rounded font-bold">
                          FREE
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {deliveryFee === 0 ? <span className="line-through text-gray-400 mr-1">₹35</span> : null}
                      ₹{deliveryFee}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Platform Fee</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₹{platformFee}</span>
                  </div>

                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>GST & Restaurant Charges (5%)</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₹{gstAndTaxes}</span>
                  </div>

                  {riderTip > 0 && (
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>Delivery Partner Tip</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹{riderTip}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm font-black text-gray-900 dark:text-white">
                    <span>To Pay</span>
                    <span className="text-base text-zomato-600 dark:text-zomato-400">₹{grandTotal}</span>
                  </div>
                </div>

                {/* Safety Promise */}
                <div className="flex items-center gap-2 p-2.5 text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>100% contactless & tamper-proof sealed delivery.</span>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer with Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Final amount including all taxes</span>
                <span className="font-bold text-gray-900 dark:text-white text-sm">₹{grandTotal}</span>
              </div>
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-2xl bg-zomato-600 hover:bg-zomato-700 text-white font-bold text-sm shadow-lg shadow-zomato-600/30 flex items-center justify-between transition-all hover:scale-[1.01]"
              >
                <div className="text-left">
                  <p className="text-xs uppercase tracking-wide opacity-80 leading-none">Total: ₹{grandTotal}</p>
                  <p className="font-extrabold text-base leading-tight mt-0.5">Proceed to Checkout</p>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 py-1.5 px-3 rounded-xl backdrop-blur-xs">
                  <span>Pay</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
