import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute, { GuestRoute } from './components/ProtectedRoute';
import SEO from './components/SEO';
import CookieConsent from './components/CookieConsent';
import { useCookieConsent } from './hooks/useCookieConsent';
import ScrollToTop from './components/ScrollToTop';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const UploadDesign = lazy(() => import('./pages/UploadDesign'));
const DesignDetails = lazy(() => import('./pages/DesignDetails'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const MyPurchases = lazy(() => import('./pages/MyPurchases'));
const MyWishlist = lazy(() => import('./pages/MyWishlist'));
const Cart = lazy(() => import('./pages/Cart'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Category = lazy(() => import('./pages/Category'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const Bundles = lazy(() => import('./pages/Bundles'));
const BundleDetails = lazy(() => import('./pages/BundleDetails'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const BuyerProtection = lazy(() => import('./pages/BuyerProtection'));
const AppwriteSetup = lazy(() => import('./pages/AppwriteSetup'));

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center bg-[#f8f9fc]">
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 border-2 border-gray-200 border-t-[#111] rounded-full animate-spin"></div>
      <span className="text-gray-500 font-bold text-sm tracking-wide">LOADING</span>
    </div>
  </div>
);

function App() {
  const { consent, acceptAll, rejectAll, saveCustom } = useCookieConsent();

  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <SEO />
        <div className="flex flex-col min-h-screen bg-[#f8f9fc] text-gray-900 font-sans selection:bg-black selection:text-white">
          <Navbar />
          <main className="flex-grow w-full">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
                <Route path="/design/:id" element={<DesignDetails />} />
                <Route path="/category/:categoryId" element={<Category />} />
                <Route path="/bundles" element={<Bundles />} />
                <Route path="/bundle/:id" element={<BundleDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/buyer-protection" element={<BuyerProtection />} />
                <Route path="/appwrite-setup" element={<AppwriteSetup />} />
                <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
                <Route path="/reset-password/:token" element={<GuestRoute><ResetPassword /></GuestRoute>} />

                <Route path="/upload" element={
                  <ProtectedRoute requireAdmin={true}>
                    <UploadDesign />
                  </ProtectedRoute>
                } />

                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/my-purchases" element={
                  <ProtectedRoute>
                    <MyPurchases />
                  </ProtectedRoute>
                } />

                <Route path="/my-wishlist" element={
                  <ProtectedRoute>
                    <MyWishlist />
                  </ProtectedRoute>
                } />

                <Route path="/cart" element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } />

                <Route path="/payment-success" element={
                  <ProtectedRoute>
                    <PaymentSuccess />
                  </ProtectedRoute>
                } />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
        <CookieConsent
          consent={consent}
          acceptAll={acceptAll}
          rejectAll={rejectAll}
          saveCustom={saveCustom}
        />
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            borderRadius: '100px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
          },
        }} />
      </AuthProvider>
    </Router>
  );
}

export default App;
