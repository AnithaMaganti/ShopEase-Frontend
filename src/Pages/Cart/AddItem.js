import React, { useState } from "react";
import { Button, Box, IconButton, Typography } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import api from "../User/Token"; // ✅ Import the centralized `api`

const AddItem = ({ userId, productId, currentQuantity, fetchCart }) => {
  const [quantity, setQuantity] = useState(currentQuantity || 1);

  // ✅ Function to update quantity
 // Function to update quantity
 const handleUpdateQuantity = async (newQuantity) => {
  if (newQuantity < 1) return; // Prevent quantity below 1

  console.log("Updating quantity to:", newQuantity);

  // ✅ Store previous quantity before updating UI
  const previousQuantity = quantity;

  // ✅ Optimistically update the UI
  setQuantity(newQuantity);

  try {
    const response = await api.put(`/cart/items/${productId}`, newQuantity, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("✅ Item quantity updated successfully", response.data);

    // ✅ Ensure fresh data is fetched after API call
    fetchCart();
  } catch (error) {
    console.error("❌ Error updating quantity:", error.response?.data || error.message);

    // ❌ Revert UI to previous quantity if API fails
    setQuantity(previousQuantity);

    if (error.response) {
      if (error.response.status === 400) {
        alert("❌ Not enough stock available!");
      } else if (error.response.status === 404) {
        alert("⚠️ Product not found in cart.");
      } else if (error.response.status === 403) {
        alert("⚠️ Forbidden: You might not have permission.");
      } else {
        alert("⚠️ Failed to update quantity. Try again.");
      }
    } else {
      alert("⚠️ Server error. Check your connection.");
    }
  }
};



  // ✅ Function to add a new item if not already in cart
  const handleAddToCart = () => {
    console.log("Adding product to cart...");

    api
      .post("/cart/items", { userId, productId, quantity }) // ✅ Token automatically added
      .then(() => {
        fetchCart(); // ✅ Refresh cart after adding item
        alert("✅ Item added to cart!");
      })
      .catch((error) => {
        console.error("❌ Error adding item:", error);
        alert("⚠️ Failed to add item. Try again.");
      });
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
      {/* ✅ Decrease Quantity */}
      <IconButton color="primary" onClick={() => handleUpdateQuantity(quantity - 1)}>
        <Remove />
      </IconButton>

      {/* ✅ Display Quantity */}
      <Typography sx={{ marginX: 2, fontSize: "18px", fontWeight: "bold" }}>
        {quantity}
      </Typography>

      {/* ✅ Increase Quantity */}
      <IconButton color="primary" onClick={() => handleUpdateQuantity(quantity + 1)}>
        <Add />
      </IconButton>

      {/* ✅ Add to Cart Button (only shown if item is not already in cart) */}
      {currentQuantity === 0 && (
        <Button variant="contained" color="success" onClick={handleAddToCart} sx={{ marginLeft: 2 }}>
          Add to Cart
        </Button>
      )}
    </Box>
  );
};

export default AddItem;
