import React from 'react';
import { Link } from 'react-router-dom';
import { CITIES } from '../data/mockData';
import { Globe, Heart, Smartphone, ShieldCheck, Award, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800 transition-colors pt-12 pb-24 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Brand & App row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zomato-600 text-white flex items-center justify-center font-black text-2xl italic shadow-md shadow-zomato-600/30">
              Z
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                Zoma<span className="text-zomato-600 dark:text-zomato-400">Bite</span>
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Never have an ordinary meal. Doorstep delight in minutes.
              </p>
            </div>
          </div>

          {/* App download simulator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs cursor-pointer hover:border-gray-400 transition-colors">
              <Smartphone className="w-5 h-5 text-gray-900 dark:text-white" />
              <div className="text-left">
                <p className="text-[9px] uppercase font-semibold text-gray-400 leading-tight">Download on</p>
                <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">App Store</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs cursor-pointer hover:border-gray-400 transition-colors">
              <Smartphone className="w-5 h-5 text-zomato-600" />
              <div className="text-left">
                <p className="text-[9px] uppercase font-semibold text-gray-400 leading-tight">Get it on</p>
                <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">Google Play</p>
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-gray-200 dark:border-gray-800 text-xs">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              About ZomaBite
            </h4>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400 font-medium">
              <li><Link to="/restaurants" className="hover:text-zomato-600 transition-colors">Who We Are</Link></li>
              <li><Link to="/restaurants" className="hover:text-zomato-600 transition-colors">Blog & Stories</Link></li>
              <li><Link to="/restaurants" className="hover:text-zomato-600 transition-colors">Work With Us</Link></li>
              <li><Link to="/restaurants" className="hover:text-zomato-600 transition-colors">Investor Relations</Link></li>
              <li><Link to="/restaurants" className="hover:text-zomato-600 transition-colors">Report Fraud</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              ZomaVerse
            </h4>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400 font-medium">
              <li><Link to="/restaurants?tab=delivery" className="hover:text-zomato-600 transition-colors">ZomaBite Delivery</Link></li>
              <li><Link to="/restaurants?tab=dining" className="hover:text-zomato-600 transition-colors">Dining & Booking</Link></li>
              <li><Link to="/restaurants?tab=nightlife" className="hover:text-zomato-600 transition-colors">Nightlife & Lounges</Link></li>
              <li><Link to="/restaurants" className="hover:text-zomato-600 transition-colors">Feeding India Charity</Link></li>
              <li><Link to="/restaurants" className="hover:text-zomato-600 transition-colors">Hyperpure Fresh</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              For Restaurants
            </h4>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400 font-medium">
              <li><Link to="/restaurants" className="hover:text-zomato-600 transition-colors">Partner With Us</Link></li>
              <li><Link to="/restaurants" className="hover:text-zomato-600 transition-colors">Apps for Food Partners</Link></li>
              <li><Link to="/restaurants" className="hover:text-zomato-600 transition-colors">Restaurant Toolkit</Link></li>
              <li><Link to="/restaurants" className="hover:text-zomato-600 transition-colors">Safety Standards</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              Learn More
            </h4>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400 font-medium">
              <li><Link to="/privacy" className="hover:text-zomato-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/security" className="hover:text-zomato-600 transition-colors">Security & Trust</Link></li>
              <li><Link to="/terms" className="hover:text-zomato-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/help" className="hover:text-zomato-600 transition-colors">Help & FAQ Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Cities Directory */}
        <div className="py-6 border-b border-gray-200 dark:border-gray-800">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Top Delivery Locations
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
            {CITIES.map((c) => (
              <span key={c.id} className="hover:text-zomato-600 cursor-pointer transition-colors">
                Food Delivery in {c.name}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            © 2026 ZomaBite Ltd. All rights reserved. Built as a full-featured showcase food delivery website.
          </p>
          <div className="flex items-center gap-1 text-gray-500">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for hungry foodies everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
