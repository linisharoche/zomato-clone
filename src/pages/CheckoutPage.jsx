import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Plus,
  CheckCircle2,
  Phone,
  User,
  CreditCard,
  QrCode,
  Banknote,
  Building,
  ShieldCheck,
  Tag,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Check,
  BellOff,
  Home,
  Briefcase,
} from 'lucide-react';

export default function CheckoutPage() {
  const {
    cartItems,
    cartRestaurant,
    user,
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    itemTotal,
    discountAmount,
    deliveryFee,
    platformFee,
    gstAndTaxes,
    riderTip,
    grandTotal,
    placeOrder,
    showToast,
  } = useApp();

  const navigate = useNavigate();

  // Address creation form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: 'Home',
    tag: 'home',
    fullAddress: '',
    phone: user?.phone || '',
  });

  // Contact info
  const [contactInfo, setContactInfo] = useState({
    name: user?.name || 'Rohan Sharma',
    phone: user?.phone || '+91 98765 12345',
    email: user?.email || 'rohan.sharma@example.com',
  });

  // Delivery Instructions
  const [instructions, setInstructions] = useState([]);
  const [customNote, setCustomNote] = useState('');

  const toggleInstruction = (inst) => {
    if (instructions.includes(inst)) {
      setInstructions(instructions.filter((i) => i !== inst));
    } else {
      setInstructions([...instructions, inst]);
    }
  };

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod'
  const [upiProvider, setUpiProvider] = useState('Google Pay');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Demo coupon input
  const [couponCode, setCouponCode] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-gray-800 flex items-center justify-center text-4xl mb-4">
          🛒
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          Your cart is currently empty
        </h2>
        <p className="text-sm text-gray-500 max-w-sm mb-6">
          Add some delicious items from our top restaurants to proceed with checkout.
        </p>
        <Link
          to="/restaurants"
          className="px-6 py-3 rounded-2xl bg-zomato-600 hover:bg-zomato-700 text-white font-bold text-sm shadow-md"
        >
          Explore Restaurants
        </Link>
      </div>
    );
  }

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!newAddress.fullAddress.trim()) {
      showToast('Please enter full address details', 'error');
      return;
    }
    const created = addAddress(newAddress);
    setSelectedAddress(created);
    setShowAddressForm(false);
    setNewAddress({ title: 'Home', tag: 'home', fullAddress: '', phone: user?.phone || '' });
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      showToast('Please select or add a delivery address', 'error');
      return;
    }

    setIsPlacingOrder(true);

    // Fire Confetti animation
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e23744', '#f59e0b', '#10b981', '#3b82f6'],
      });
    } catch (e) {
      // fallback
    }

    setTimeout(() => {
      const order = placeOrder({
        paymentMethod:
          paymentMethod === 'upi'
            ? `UPI (${upiProvider})`
            : paymentMethod === 'card'
            ? 'Credit/Debit Card (Demo)'
            : paymentMethod === 'netbanking'
            ? 'Net Banking (Demo)'
            : 'Cash on Delivery (COD)',
        deliveryInstructions: [...instructions, customNote].filter(Boolean).join(', '),
      });

      setIsPlacingOrder(false);
      showToast(`Order #${order.id} placed successfully! 🎉`, 'success');
      navigate(`/order-tracking/${order.id}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-gray-950/60 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Title */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Checkout & Order Review
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Ordering from <strong className="text-gray-900 dark:text-white">{cartRestaurant?.name}</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Delivery Details, Instructions, Payment */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Delivery Address Card */}
            <div className="p-5 sm:p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-zomato-950/40 text-zomato-600 flex items-center justify-center font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Delivery Address
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="flex items-center gap-1 text-xs font-bold text-zomato-600 dark:text-zomato-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Add New Address Form Modal/Dropdown */}
              {showAddressForm && (
                <form
                  onSubmit={handleSaveAddress}
                  className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3 animate-scale-in"
                >
                  <div className="flex gap-2">
                    {['Home', 'Work', 'Other'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setNewAddress({ ...newAddress, title: tag, tag: tag.toLowerCase() })}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          newAddress.title === tag
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
                      Complete Address Details
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Flat/House no., Floor, Building, Street, Landmark..."
                      value={newAddress.fullAddress}
                      onChange={(e) => setNewAddress({ ...newAddress, fullAddress: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-zomato-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-zomato-600 text-white text-xs font-bold shadow-xs hover:bg-zomato-700"
                    >
                      Save & Deliver Here
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Addresses List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => {
                  const isSelected = selectedAddress?.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-zomato-600 bg-red-50/30 dark:bg-zomato-950/20'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 bg-white dark:bg-gray-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                          {addr.tag === 'home' ? (
                            <Home className="w-3.5 h-3.5 text-zomato-600" />
                          ) : (
                            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                          )}
                          <span>{addr.title}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-zomato-600 fill-current text-white" />}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {addr.fullAddress}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Contact Details Card */}
            <div className="p-5 sm:p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-subtle space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-zomato-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-zomato-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-zomato-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Delivery Instructions Card */}
            <div className="p-5 sm:p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-subtle space-y-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Delivery Instructions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  'Avoid calling',
                  'Leave at door',
                  'Ring bell',
                  'Pet at home',
                ].map((inst) => {
                  const active = instructions.includes(inst);
                  return (
                    <button
                      key={inst}
                      type="button"
                      onClick={() => toggleInstruction(inst)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-center ${
                        active
                          ? 'border-zomato-600 bg-red-50 text-zomato-700 dark:bg-zomato-950/40 dark:text-zomato-300 font-bold'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      {inst}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                placeholder="Any special cooking or delivery instructions? (Optional)"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-zomato-500"
              />
            </div>

            {/* 4. Demo Payment Selection Card */}
            <div className="p-5 sm:p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center font-bold">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Select Payment Method
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider">
                  ⚡ Demo Simulation Mode
                </span>
              </div>

              {/* Payment Option Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: QrCode },
                  { id: 'card', label: 'Cards', icon: CreditCard },
                  { id: 'netbanking', label: 'Net Banking', icon: Building },
                  { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? 'border-zomato-600 bg-red-50/40 dark:bg-zomato-950/20 text-zomato-600 dark:text-zomato-400 font-extrabold'
                          : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* UPI Sub-options */}
              {paymentMethod === 'upi' && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-3">
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Choose UPI App
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setUpiProvider(app)}
                        className={`p-2 rounded-xl text-xs font-bold border transition-colors ${
                          upiProvider === app
                            ? 'bg-zomato-600 text-white border-zomato-600'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Simulated UPI intent: instant verification without authenticating real payment.
                  </p>
                </div>
              )}

              {/* Card Sub-options */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-3">
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Card Number (Demo: 4532 •••• •••• 8890)"
                      defaultValue="4532 9812 3456 8890"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        defaultValue="12/28"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        defaultValue="789"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Simulated Secure Demo Gateway. No actual charges will be deducted.</span>
              </div>
            </div>

          </div>

          {/* Right Col: Order Summary & Bill */}
          <div className="lg:col-span-1 space-y-6">
            
            <div className="p-5 sm:p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-subtle space-y-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
                Order Summary
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={item.isVeg ? 'veg-badge' : 'non-veg-badge'}>
                        <span className={item.isVeg ? 'veg-dot' : 'non-veg-dot'}></span>
                      </span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {item.name} × {item.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white shrink-0 ml-2">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Row */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{appliedCoupon.code}</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="font-bold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 uppercase"
                    />
                    <button
                      onClick={() => {
                        applyCoupon(couponCode);
                        setCouponCode('');
                      }}
                      className="px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-xl"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Price Details */}
              <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{itemTotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{platformFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (GST 5%)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{gstAndTaxes}</span>
                </div>
                {riderTip > 0 && (
                  <div className="flex justify-between">
                    <span>Partner Tip</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₹{riderTip}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm font-black text-gray-900 dark:text-white">
                  <span>Grand Total</span>
                  <span className="text-lg text-zomato-600 dark:text-zomato-400 font-extrabold">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                disabled={isPlacingOrder}
                onClick={handlePlaceOrder}
                className="w-full py-4 px-6 rounded-2xl bg-zomato-600 hover:bg-zomato-700 text-white font-black text-sm shadow-xl shadow-zomato-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {isPlacingOrder ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Confirming Order...</span>
                  </div>
                ) : (
                  <>
                    <span>Place Order • ₹{grandTotal}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
