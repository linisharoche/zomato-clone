import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import ConflictModal from './components/ConflictModal';
import AuthModal from './components/AuthModal';
import ToastContainer from './components/ToastContainer';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import RestaurantListingPage from './pages/RestaurantListingPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import OrdersHistoryPage from './pages/OrdersHistoryPage';
import ProfilePage from './pages/ProfilePage';
import FavouritesPage from './pages/FavouritesPage';
import SearchResultsPage from './pages/SearchResultsPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-[#f8f9fa] dark:bg-[#0f1115] text-gray-900 dark:text-gray-100 transition-colors duration-200">
          {/* Top Sticky Navbar */}
          <Navbar />

          {/* Main Views Container */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/restaurants" element={<RestaurantListingPage />} />
              <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />
              <Route path="/orders" element={<OrdersHistoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/favourites" element={<FavouritesPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Interactive Drawers & Overlays */}
          <CartDrawer />
          <ConflictModal />
          <AuthModal />
          <ToastContainer />

          {/* Footer */}
          <Footer />

          {/* Mobile Persistent Bottom Tab Bar */}
          <MobileBottomNav />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
