import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  List,
  ListItem,
  Box,
  Grid,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import AddItem from "./AddItem"; // ✅ Import AddItem component
import api from "../User/Token";
import ProceedToCheckout from './../Checkout/ProceedToCheckout.js';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userId, setUserId] = useState(null);

  // ✅ Fetch userId from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.id) {
      setUserId(storedUser.id);
    }
  }, []);

  // ✅ Fetch cart when userId changes or cart is updated
  const fetchCart = async () => {
    if (!userId) return;

    try {
      const response = await api.get(`/cart`, { params: { userId } });

      console.log("Cart data received:", response.data);

      setCartItems(response.data.items || []);
      setTotalPrice(response.data.totalPrice || 0);
    } catch (error) {
      console.error("Error fetching cart:", error.response || error.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  // ✅ Remove item from cart
  const handleRemoveItem = (itemId) => {
    api
      .delete(`/cart/items/${itemId}`)
      .then(() => fetchCart()) // ✅ Refetch cart after removing item
      .catch((error) => console.error("Error removing item:", error));
  };

  return (
    <Container>
      <Typography
        variant="h4"
        sx={{ marginBottom: 3, fontWeight: "bold", color: "#212121" }}
      >
        🛒 Shopping Cart
      </Typography>

      {cartItems.length > 0 ? (
        <List>
          {cartItems.map((item) => {
            const product = item.product || {}; // ✅ Ensure product exists
            const productTotal = item.quantity * (product.price || 0); // ✅ Calculate total for each product

            return (
              <ListItem
                key={item.id}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    width: "100%",
                    maxWidth: 900,
                    padding: 2,
                    boxShadow: 3,
                    borderRadius: "10px",
                  }}
                >
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      {/* ✅ Product Image */}
                      <Grid item xs={3}>
                        <img
                          src={`http://localhost:8081${product.imageUrl}`}
                          alt={product.name}
                          style={{ width: "100%", borderRadius: "8px" }}
                        />
                      </Grid>

                      {/* ✅ Product Details */}
                      <Grid item xs={6}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ color: "#212121" }}
                        >
                          {product.name || "Unknown Product"}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "18px",
                            color: "#ff5722",
                            fontWeight: "bold",
                          }}
                        >
                          ₹{product.price || 0} <small>(per item)</small>
                        </Typography>

                        {/* ✅ Show Total Price for Each Product */}
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "20px",
                            color: "#4CAF50",
                            fontWeight: "bold",
                            marginTop: "8px",
                          }}
                        >
                           Total: ₹{productTotal}
                        </Typography>

                        <Typography variant="body2" sx={{ color: "#757575" }}>
                          ✅ In Stock | Ships within 2 days
                        </Typography>

                        {/* ✅ Use AddItem Component for Quantity Management */}
                        <AddItem
                          userId={userId}
                          productId={item.id}
                          currentQuantity={item.quantity}
                          fetchCart={fetchCart} // ✅ Ensure cart refreshes after updates
                        />
                      </Grid>

                      {/* ✅ Remove Button */}
                      <Grid
                        item
                        xs={3}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleRemoveItem(item.id)}
                          sx={{
                            marginTop: 2,
                            borderRadius: "10px",
                            textTransform: "none",
                            fontSize: "14px",
                          }}
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Typography variant="h6" color="text.secondary">
          Your cart is empty.
        </Typography>
      )}

      {/* ✅ Right-Aligned Total Price & Checkout Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: 4,
        }}
      >
        {/* ✅ Total Price */}
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#212121", marginRight: 3 }}
        >
          🏷️ Total Price: ₹{totalPrice}
        </Typography>

        {/* ✅ Checkout Button (Amazon/Ajio Style) */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#ff9f00",
            color: "#fff",
            fontWeight: "bold",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "16px",
            "&:hover": { backgroundColor: "#fb8c00" },
          }}
        >
           {/* ✅ Render Proceed to Checkout only if cart has items */}
        {cartItems.length > 0 && <ProceedToCheckout cartItems={cartItems} />}
        </Button>
      </Box>
    </Container>
  );
};

export default Cart;
