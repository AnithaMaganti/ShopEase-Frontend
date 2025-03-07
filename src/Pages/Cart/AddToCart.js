import React from "react";
import { Button } from "@mui/material"; // ✅ Import Button from MUI
import api from "../User/Token";

const AddToCart = ({ productId, refreshCart }) => {
  // ✅ Fetch userId from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser ? storedUser.id : null;

  const handleAddToCart = () => {
    if (!userId) {
      alert("Please log in to add items to the cart.");
      return;
    }

    const cartItem = {
      userId,
      productId,
      quantity: 1, // ✅ Default quantity to 1
    };




    api
      .post("/cart/items", cartItem)
      .then(() => {
        alert("Item added to cart!");
        refreshCart(); // ✅ Refresh cart after adding item
      })
      .catch((error) => {
        console.error("Error adding item to cart:", error);
        alert("Error adding item to cart. Please try again.");
      });
  };

  return (
    <Button
      variant="contained"
      fullWidth
      sx={{
        marginTop: 1,
        backgroundColor: "#ff9f00", // ✅ Amazon-like yellow button
        "&:hover": { backgroundColor: "#fb8c00" }
      }}
      onClick={handleAddToCart}
    >
      Add to Cart
    </Button>
  );
};

export default AddToCart;
