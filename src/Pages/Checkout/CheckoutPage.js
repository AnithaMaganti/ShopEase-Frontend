import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../User/Token";
import {
  Container,
  Card,
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  Grid,
  Box ,
} from "@mui/material";

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState([]); // List of saved addresses
  const [selectedAddress, setSelectedAddress] = useState(""); // Selected address
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
  }); // New address form state
  const [showNewAddress, setShowNewAddress] = useState(false); // Toggle for new address form
  const [paymentMethods, setPaymentMethods] = useState([]); // Dynamic payment methods
  const [selectedPayment, setSelectedPayment] = useState(""); // Selected payment method
  const [cartItems, setCartItems] = useState([]); // Cart items
  const [totalPrice, setTotalPrice] = useState(0); // Total price
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    fetchAddresses();
    fetchPaymentMethods();
  }, []);

  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser || !storedUser.id) {
    alert("❌ User ID not found in localStorage.");
    return;
  }

  // 🔹 Fetch Cart Items
  const fetchCart = async () => {
    try {
      const response = await api.get("/cart", {
        params: { userId: storedUser.id },
      });
      setCartItems(response.data.items);
      setTotalPrice(response.data.totalPrice);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // 🔹 Fetch Saved Addresses
  const fetchAddresses = async () => {
    try {
      const response = await api.get("/addresses", {
        params: { userId: storedUser.id },
      });
      setAddresses(response.data);
      if (response.data.length > 0) {
        setSelectedAddress(response.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  // 🔹 Fetch Payment Methods from Backend
  const fetchPaymentMethods = async () => {
    try {
      const response = await api.get("/payments/methods");
      setPaymentMethods(response.data);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  // 🔹 Place Order & Redirect to Tracking Page
  const handlePlaceOrder = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user")); //  Get user from localStorage
    const userId = storedUser?.id;

    if (!userId) {
      alert("User is not logged in. Please log in to place an order.");
      return;
    }

    if (!selectedAddress || !selectedPayment) {
      alert("Please select an address and payment method.");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty. Add items before placing an order.");
      return;
    }

    //  Construct the request payload with items
    const orderRequest = {
      userId: userId,
      addressId: selectedAddress,
      paymentMethod: selectedPayment,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await api.post("/order/place-order", orderRequest);

      if (response.data.orderId) {
        alert("Order placed successfully! Redirecting...");
        navigate(`/order-tracking/${response.data.orderId}`);
      } else {
        alert("Order failed. Please try again.");
      }
    } catch (error) {
      alert("Order failed: " + (error.response?.data || error.message));
    }
  };

  // 🔹 Handle New Address Submission
  const handleNewAddressSubmit = async () => {
    if (!newAddress.street || !newAddress.city || !newAddress.state) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await api.post("/addresses", {
        userId: storedUser.id,
        ...newAddress,
      });

      setAddresses([...addresses, response.data]);
      setSelectedAddress(response.data.id);
      setShowNewAddress(false);
    } catch (error) {
      alert(
        "Failed to add address: " + (error.response?.data || error.message)
      );
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center" }}>
        🛍️ Checkout
      </Typography>

      {/* 📍 Address Selection */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          📍 Select Address
        </Typography>
        <Select
          fullWidth
          value={selectedAddress}
          onChange={(e) => setSelectedAddress(e.target.value)}
        >
          <MenuItem value="">Choose an Address</MenuItem>
          {addresses.map((address) => (
            <MenuItem key={address.id} value={address.id}>
              {address.street}, {address.city}, {address.state}
            </MenuItem>
          ))}
        </Select>

        {/* ➕ Add New Address Button */}
        <Button
          sx={{ mt: 2 }}
          variant="outlined"
          onClick={() => setShowNewAddress(!showNewAddress)}
        >
          {showNewAddress ? "Cancel" : "➕ Add New Address"}
        </Button>

        {/* 📝 New Address Form */}
        {showNewAddress && (
          <Card sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6">Add New Address</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Street"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, street: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="City"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="State"
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                />
              </Grid>
            </Grid>
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              onClick={handleNewAddressSubmit}
            >
              Save Address
            </Button>
          </Card>
        )}
      </Card>

      {/* 💳 Payment Selection */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          💳 Payment Method
        </Typography>
        <Select
          fullWidth
          value={selectedPayment}
          onChange={(e) => setSelectedPayment(e.target.value)}
        >
          <MenuItem value="">Choose a Payment Method</MenuItem>
          {paymentMethods.map((method) => (
            <MenuItem key={method} value={method}>
              {method}
            </MenuItem>
          ))}
        </Select>
      </Card>

      {/* 🛒 Order Summary */}
      <Card sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          🛒 Order Summary
        </Typography>
        {cartItems.map((item) => (
          <Typography key={item.id} sx={{ mt: 1 }}>
            {item.product.name} - ₹{item.product.price} x {item.quantity}
          </Typography>
        ))}
        <Typography
          variant="h5"
          sx={{ mt: 2, fontWeight: "bold", color: "#FF9800" }}
        >
          Total: ₹{totalPrice}
        </Typography>
      </Card>

      {/* 🛍️ Place Order Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#FF9900",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            width: "250px", // ✅ Adjust width to your preference
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#E68A00" },
          }}
          onClick={handlePlaceOrder}
        >
          Place Order 🛍️
        </Button>
      </Box>
    </Container>
  );
};

export default CheckoutPage;
