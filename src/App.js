import React, { useEffect,useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OtpVerification from './Pages/User/OtpVerification';
import Auth from './Pages/User/Auth';
import Home from './Pages/Landingpg/Home';
import ForgotPassword from './Pages/User/ForgotPassword';
import ResetPassword from './Pages/User/ResetPassword';
import UserMenu from './Pages/User/UserMenu';
import ProductManagement from './Pages/Products/ProductManagement';
import Cart from './Pages/Cart/Cart';
import { checkTokenExpiration, getAccessToken } from './Pages/User/Token';
import OrderConfirmation from './Pages/Checkout/OrderConfirmation';
import CheckoutPage from './Pages/Checkout/CheckoutPage';
import ManageAddresses from "./Pages/Checkout/ManageAddresses";
import OrderTracking from "./Pages/Checkout/OrderTracking";
import Offers from "./Components/Offers";


function App() {

  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    if (!tokenChecked) { // ✅ Only check token once
      const token = getAccessToken();
      if (token) {
        checkTokenExpiration().then(() => setTokenChecked(true)); // ✅ Ensure it's only checked once
      } else {
        setTokenChecked(true);
      }
    }
  }, [tokenChecked]); // ✅ Dependency prevents re-running infinitely

  
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} /> {/*  Auth handles Login/Register Switching */}
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/" element={<Home />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/user-menu" element={<UserMenu />} />
        <Route path="/products/:category" element={<ProductManagement />} /> 
        <Route path="/cart" element={<Cart />} /> 
        <Route path="/checkout" element={<CheckoutPage />} /> {/* ✅ New Checkout Route */}
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/manage-addresses" element={<ManageAddresses />} />
        <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
        <Route path="/offers" element={<Offers />} />

      </Routes>
    </Router>
  );
}

export default App;
