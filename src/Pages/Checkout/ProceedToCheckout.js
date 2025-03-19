import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../User/Token";
import { Button } from "@mui/material";


const ProceedToCheckout = ({ cartItems }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user
  const [hasAddress, setHasAddress] = useState(false);

  useEffect(() => {
    const checkUserAddresses = async () => {
      if (!user) return;
      try {
        const response = await api.get("/addresses", { params: { userId: user.id } });
        setHasAddress(response.data.length > 0);
      } catch (error) {
        console.error("Error checking addresses:", error);
      }
    };

    checkUserAddresses();
  }, [user]);

  const handleCheckout = () => {
    if (!user) {
      alert("Please log in to continue checkout.");
      navigate("/auth"); //  Redirect to login if user is not logged in
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!hasAddress) {
      alert("You need to add an address before checking out.");
      navigate("/manage-addresses"); //  Redirect to manage addresses if none exist
      return;
    }

    navigate("/checkout"); //  Redirect to checkout page if an address exists
  };

  return (
    <Button onClick={handleCheckout} className="checkout-btn"
    sx={{
     
      color: "#fff",               //  White Text
      fontWeight: "bold",
      "&:hover": {
        backgroundColor: "#fb8c00", // Darker Orange on Hover
        color: "#fff",             // Ensure text remains white
      },
    }}>
      Proceed to Checkout
    </Button>
  );
};

export default ProceedToCheckout;
