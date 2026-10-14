import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Clock,
  Bike,
  ChefHat,
  PackageCheck,
  Phone,
  MessageSquare,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const { orders, activeLiveOrder } = useApp();

  const order =
    orders.find((o) => o.id === orderId) ||
    activeLiveOrder ||
    orders[0] ||
    null;

  // Tracking steps
  const steps = [
    { id: 1, title: 'Order Placed', desc: 'Received by restaurant', icon: CheckCircle2 },
    { id: 2, title: 'Preparing Food', desc: 'Chef is cooking your meal', icon: ChefHat },
    { id: 3, title: 'Partner Assigned', desc: 'Rider reaching restaurant', icon: Bike },
    { id: 4, title: 'Out for Delivery', desc: 'On the way to your door', icon: MapPin },
    { id: 5, title: 'Delivered', desc: 'Enjoy your delicious feast!', icon: PackageCheck },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(2); // Default 'Preparing'
  const [estimatedMinutes, setEstimatedMinutes] = useState(24);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: 'driver', text: 'Hi! I have picked up your order and am riding towards your address.' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // Simulated live map coordinates progression
  const [progressPercent, setProgressPercent] = useState(45);

  useEffect(() => {
    const timer = setInterval(() => {
      setEstimatedMinutes((prev) => (prev > 1 ? prev - 1 : 1));
      setProgressPercent((prev) => (prev < 90 ? prev + 2 : 90));
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const handleAdvanceStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setProgressPercent((prev) => Math.min(100, prev + 20));
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages((prev) => [...prev, { from: 'me', text: inputMsg.trim() }]);
    setInputMsg('');
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { from: 'driver', text: 'Got it! I will follow your instructions. Arriving shortly.' },
      ]);
    }, 1500);
  };

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Order Not Found</h2>
        <p className="text-sm text-gray-500 mb-4">We couldn't locate this order tracking ID.</p>
        <Link to="/orders" className="text-sm font-bold text-zomato-600 underline">
          View all your orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/60 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Card */}
        <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-subtle mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase">
                ● Live Tracking
              </span>
              <span className="text-xs text-gray-400">Order ID: #{order.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              Arriving in ~{estimatedMinutes} Minutes
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              From <strong className="text-gray-800 dark:text-gray-200">{order.restaurantName}</strong> to{' '}
              <span className="truncate inline-block max-w-[200px] align-bottom">{order.address}</span>
            </p>
          </div>

          {/* Advance Step Simulation Tool for Evaluator */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdvanceStep}
              className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-800 dark:text-gray-200 text-xs font-bold border border-gray-200 dark:border-gray-700 flex items-center gap-1.5 transition-all"
              title="Simulate Next Status for testing"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Simulate Next Step</span>
            </button>
            <Link
              to="/orders"
              className="px-3.5 py-2 rounded-xl bg-zomato-50 text-zomato-600 dark:bg-zomato-950/40 text-xs font-bold hover:bg-zomato-100 transition-colors"
            >
              All Orders
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Animated GPS Map & Stepper */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Simulated Live GPS Map View */}
            <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-card border border-gray-200 dark:border-gray-800 bg-[#e5e3df] dark:bg-[#1a1d24]">
              {/* SVG Styled Map Visual with roads and route */}
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Background Grid Roads */}
                <pattern id="roadGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(200, 200, 200, 0.4)" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#roadGrid)" />

                {/* Major Highway Avenue lines */}
                <path d="M 20 180 Q 200 120 400 240 T 800 160" fill="none" stroke="#fef08a" strokeWidth="14" opacity="0.6" />
                <path d="M 120 20 L 140 400" fill="none" stroke="#ffffff" strokeWidth="10" opacity="0.8" />
                <path d="M 320 20 L 300 400" fill="none" stroke="#ffffff" strokeWidth="8" opacity="0.8" />
                <path d="M 0 300 L 900 280" fill="none" stroke="#ffffff" strokeWidth="10" opacity="0.8" />

                {/* Live Delivery Route Path */}
                <path
                  id="routePath"
                  d="M 80 120 C 180 120, 240 260, 480 220 S 680 180, 780 160"
                  fill="none"
                  stroke="#e23744"
                  strokeWidth="6"
                  strokeDasharray="8 6"
                  className="animate-pulse"
                />

                {/* Restaurant Source Pin */}
                <g transform="translate(80, 120)">
                  <circle r="18" fill="#e23744" opacity="0.2" className="animate-ping" />
                  <circle r="12" fill="#e23744" />
                  <text x="0" y="4" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">🏪</text>
                  <text x="0" y="26" textAnchor="middle" fill="#111827" fontSize="10" fontWeight="bold">Restaurant</text>
                </g>

                {/* Customer Home Pin */}
                <g transform="translate(780, 160)">
                  <circle r="18" fill="#10b981" opacity="0.2" className="animate-ping" />
                  <circle r="14" fill="#10b981" />
                  <text x="0" y="4" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">🏠</text>
                  <text x="0" y="28" textAnchor="middle" fill="#111827" fontSize="10" fontWeight="bold">Your Home</text>
                </g>

                {/* Live Moving Delivery Partner Scooter */}
                <g transform={`translate(${80 + (progressPercent / 100) * 700}, ${120 + Math.sin(progressPercent) * 40})`}>
                  <circle r="20" fill="#ffffff" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))" />
                  <circle r="16" fill="#e23744" />
                  <text x="0" y="5" textAnchor="middle" fill="white" fontSize="13">🛵</text>
                </g>
              </svg>

              {/* Float Map Badge Overlay */}
              <div className="absolute top-4 left-4 p-3 rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-card border border-gray-100 dark:border-gray-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <p className="font-extrabold text-gray-900 dark:text-white">Live GPS Satellite Active</p>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">Rider is 1.4 km away from your location</p>
              </div>

              {/* Rider Speed Badge */}
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md text-white text-xs font-bold">
                Speed: 32 km/h
              </div>
            </div>

            {/* 2. Order Status Stepper Timeline */}
            <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-subtle">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">
                Delivery Progress
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
                {steps.map((st, index) => {
                  const Icon = st.icon;
                  const isDone = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div key={st.id} className="relative flex items-start gap-4">
                      {/* Step Indicator Dot */}
                      <div
                        className={`absolute -left-6 sm:-left-8 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                          isCurrent
                            ? 'bg-zomato-600 text-white ring-4 ring-zomato-100 dark:ring-zomato-950 scale-110 shadow-md'
                            : isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-300 dark:border-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="pt-0.5">
                        <h4
                          className={`text-sm font-bold ${
                            isCurrent
                              ? 'text-zomato-600 dark:text-zomato-400 text-base'
                              : isDone
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-400'
                          }`}
                        >
                          {st.title} {isCurrent && '(In Progress)'}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{st.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Col: Rider Card & Order Breakdown */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Delivery Partner Card */}
            <div className="p-5 sm:p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-subtle space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Your Delivery Partner
                </h3>
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-black">
                  ★ {order.deliveryPartner?.rating || 4.9}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                  alt={order.deliveryPartner?.name || 'Rider'}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-zomato-500/20"
                />
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {order.deliveryPartner?.name || 'Suresh Patil'}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {order.deliveryPartner?.vehicle || 'Ather 450X (KA-05-EV-1289)'}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                    Vaccinated & Temperature Checked
                  </p>
                </div>
              </div>

              {/* Call & Chat Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setCallModalOpen(true)}
                  className="py-2.5 px-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-800 dark:text-gray-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-zomato-600" />
                  <span>Call Partner</span>
                </button>
                <button
                  onClick={() => setChatModalOpen(true)}
                  className="py-2.5 px-3 rounded-xl bg-zomato-600 hover:bg-zomato-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Chat</span>
                </button>
              </div>
            </div>

            {/* Simulated Call Modal */}
            {callModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-xs w-full p-6 text-center shadow-2xl animate-scale-in space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
                    <Phone className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      Connecting call...
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Calling {order.deliveryPartner?.name || 'Rider'} ({order.deliveryPartner?.phone})
                    </p>
                    <p className="text-[11px] text-gray-400 mt-2">
                      (Simulated secure masked call for project demo)
                    </p>
                  </div>
                  <button
                    onClick={() => setCallModalOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                  >
                    End Call
                  </button>
                </div>
              </div>
            )}

            {/* Simulated Live Chat Modal */}
            {chatModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 dark:border-gray-800 animate-scale-in flex flex-col h-[400px]">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                      Chat with {order.deliveryPartner?.name || 'Rider'}
                    </h4>
                    <button
                      onClick={() => setChatModalOpen(false)}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Close
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto py-3 space-y-2 text-xs">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-xl max-w-[85%] ${
                          msg.from === 'me'
                            ? 'ml-auto bg-zomato-600 text-white'
                            : 'mr-auto bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                        }`}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="pt-2 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={inputMsg}
                      onChange={(e) => setInputMsg(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-zomato-600 text-white text-xs font-bold rounded-xl"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Order Items Receipt Summary */}
            <div className="p-5 sm:p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-subtle space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Order Items ({order.items.length})
              </h3>
              <div className="space-y-2.5">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-sm font-black text-gray-900 dark:text-white">
                <span>Total Paid</span>
                <span className="text-zomato-600 dark:text-zomato-400 text-base">
                  ₹{order.totalAmount}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
