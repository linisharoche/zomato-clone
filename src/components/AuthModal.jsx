import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Phone, Lock, User, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authMode, setAuthMode, login, showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    password: '',
  });
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState(['1', '2', '3', '4']);

  if (!authModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.emailOrPhone) {
      showToast('Please enter your email or phone number', 'error');
      return;
    }

    if (!otpStep && authMode === 'login') {
      setOtpStep(true);
      showToast('Demo OTP sent: 1234', 'info');
      return;
    }

    login({
      name: formData.name || (formData.emailOrPhone.includes('@') ? formData.emailOrPhone.split('@')[0] : 'Foodie Friend'),
      email: formData.emailOrPhone.includes('@') ? formData.emailOrPhone : `${formData.emailOrPhone}@zomabite.demo`,
      phone: !formData.emailOrPhone.includes('@') ? formData.emailOrPhone : '+91 98765 00000',
      membership: 'ZomaBite Gold Member',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    });
    setAuthModalOpen(false);
    setOtpStep(false);
  };

  const handleDemoQuickLogin = (demoName, demoEmail, demoPhone) => {
    login({
      name: demoName,
      email: demoEmail,
      phone: demoPhone,
      membership: 'ZomaBite Gold Member',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    });
    setAuthModalOpen(false);
    setOtpStep(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 animate-scale-in relative overflow-hidden">
        {/* Decorative Top Gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-zomato-600 via-rose-500 to-amber-500"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-zomato-500 text-white flex items-center justify-center font-black text-xl italic shadow-md shadow-zomato-500/30">
              Z
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
              Zoma<span className="text-zomato-600 dark:text-zomato-400">Bite</span>
            </span>
          </div>
          <button
            onClick={() => {
              setAuthModalOpen(false);
              setOtpStep(false);
            }}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setOtpStep(false);
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              authMode === 'login'
                ? 'bg-white dark:bg-gray-900 text-zomato-600 dark:text-zomato-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setOtpStep(false);
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              authMode === 'signup'
                ? 'bg-white dark:bg-gray-900 text-zomato-600 dark:text-zomato-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="mb-6 p-3 bg-red-50/60 dark:bg-zomato-950/40 rounded-2xl border border-red-100 dark:border-zomato-900/50">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zomato-700 dark:text-zomato-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Logins (1-Click)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoQuickLogin('Rohan Sharma', 'rohan.sharma@example.com', '+91 98765 12345')}
              className="px-3 py-2 text-xs font-medium bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl border border-gray-200 dark:border-gray-700 transition-all text-left flex items-center gap-2 shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Rohan (Foodie)</span>
            </button>
            <button
              onClick={() => handleDemoQuickLogin('Priya Nair', 'priya.nair@example.com', '+91 98111 22334')}
              className="px-3 py-2 text-xs font-medium bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl border border-gray-200 dark:border-gray-700 transition-all text-left flex items-center gap-2 shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>Priya (Student)</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-zomato-500 focus:ring-2 focus:ring-zomato-500/20"
                />
              </div>
            </div>
          )}

          {!otpStep ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Phone Number or Email
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter phone or email"
                    value={formData.emailOrPhone}
                    onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-zomato-500 focus:ring-2 focus:ring-zomato-500/20"
                  />
                </div>
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-zomato-500 focus:ring-2 focus:ring-zomato-500/20"
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">
                Enter 4-digit verification code sent to {formData.emailOrPhone}
              </label>
              <div className="flex justify-center gap-3 my-4">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[i] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-12 h-12 text-center text-lg font-bold rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-zomato-500"
                  />
                ))}
              </div>
              <p className="text-center text-xs text-gray-500">
                Demo code is prefilled as <span className="font-semibold text-zomato-600">1 2 3 4</span>
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-zomato-600 hover:bg-zomato-700 text-white font-semibold text-sm shadow-md shadow-zomato-600/30 transition-all hover:scale-[1.01]"
          >
            {otpStep ? 'Verify & Continue' : authMode === 'login' ? 'Send One-Time Password' : 'Create Account'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-gray-400">
          By continuing, you agree to our{' '}
          <span className="underline hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">Terms of Service</span> &{' '}
          <span className="underline hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
