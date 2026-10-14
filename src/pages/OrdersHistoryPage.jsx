import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { Package, RotateCcw, Clock, MapPin, Receipt, CheckCircle2, ChevronRight, X, FileText } from 'lucide-react';
import { RESTAURANTS } from '../data/mockData';

export default function OrdersHistoryPage() {
  const { orders, addToCart, setCartDrawerOpen, showToast } = useApp();
  const navigate = useNavigate();
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const handleReorder = (order) => {
    const restaurant = RESTAURANTS.find((r) => r.id === order.restaurantId) || {
      id: order.restaurantId,
      name: order.restaurantName,
      image: order.restaurantImage,
      location: order.address,
    };

    order.items.forEach((item) => {
      addToCart(item, restaurant);
    });

    setCartDrawerOpen(true);
    showToast(`Items from ${order.restaurantName} added to your cart!`, 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/60 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Your Orders & History
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            View all your previous culinary orders, receipts, and 1-click reorders
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-50 dark:bg-gray-800 flex items-center justify-center text-3xl mb-4">
              🥡
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              No orders placed yet
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-6">
              You haven't ordered any delicious food yet. Check out our curated list of restaurants!
            </p>
            <Link
              to="/restaurants"
              className="px-6 py-2.5 rounded-xl bg-zomato-600 text-white font-bold text-xs shadow-md"
            >
              Order Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 sm:p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-subtle hover:shadow-card transition-all"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={ord.restaurantImage}
                      alt={ord.restaurantName}
                      className="w-12 h-12 rounded-2xl object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                    />
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {ord.restaurantName}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-0.5">
                        <span>{ord.orderDate}</span>
                        <span>•</span>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          #{ord.id}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{ord.status}</span>
                    </span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="py-4 space-y-2 border-b border-gray-100 dark:border-gray-800">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.name} × <strong className="font-bold">{item.quantity}</strong>
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Actions Row */}
                <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-gray-400">Total Bill Paid:</span>{' '}
                    <strong className="text-base text-gray-900 dark:text-white font-extrabold ml-1">
                      ₹{ord.totalAmount}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setSelectedReceipt(ord)}
                      className="flex-1 sm:flex-initial px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>View Receipt</span>
                    </button>

                    <Link
                      to={`/order-tracking/${ord.id}`}
                      className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5 text-zomato-600" />
                      <span>Track Order</span>
                    </Link>

                    <button
                      onClick={() => handleReorder(ord)}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-zomato-600 hover:bg-zomato-700 text-white font-bold shadow-xs transition-all hover:scale-105 flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Receipt Modal */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-scale-in">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800 mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-zomato-600" />
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Order Invoice Receipt
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <strong className="text-gray-900 dark:text-white">#{selectedReceipt.id}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Restaurant:</span>
                  <strong className="text-gray-900 dark:text-white">{selectedReceipt.restaurantName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Order Date:</span>
                  <span>{selectedReceipt.orderDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Mode:</span>
                  <span>{selectedReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Address:</span>
                  <span className="max-w-[200px] text-right truncate">{selectedReceipt.address}</span>
                </div>

                <div className="pt-3 border-t border-dashed border-gray-200 dark:border-gray-700 space-y-1.5">
                  {selectedReceipt.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{i.name} × {i.quantity}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹{i.price * i.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm font-black text-gray-900 dark:text-white">
                  <span>Total Amount Paid:</span>
                  <span className="text-base text-zomato-600">₹{selectedReceipt.totalAmount}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-full mt-6 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold"
              >
                Close Receipt
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
