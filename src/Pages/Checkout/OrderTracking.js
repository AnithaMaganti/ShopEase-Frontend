import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../User/Token"; // ✅ Ensure correct API import
import { 
  Container, Typography, Card, CardContent, Grid, List, ListItem, Divider, Box, Chip 
} from "@mui/material";

const OrderTracking = () => {
  const { orderId } = useParams(); // ✅ Get orderId from URL
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(`/order/${orderId}`);
        setOrderDetails(response.data);
      } catch (error) {
        setError("Failed to fetch order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
      setError("Invalid order ID.");
    }
  }, [orderId]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center", color: "#333" }}>
        📦 Order Tracking
      </Typography>

      {loading ? (
        <Typography variant="h6" color="textSecondary" sx={{ textAlign: "center" }}>
          Loading order details...
        </Typography>
      ) : error ? (
        <Typography variant="h6" color="error" sx={{ textAlign: "center" }}>
          {error}
        </Typography>
      ) : (
        <Card sx={{ p: 3, mt: 3, boxShadow: 3 }}>
          {/* Order Info Section */}
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Order ID: <span style={{ color: "#1976D2" }}>#{orderDetails.orderId}</span>
            </Typography>
            <Typography sx={{ mt: 1, fontSize: "16px" }}>
              <strong>Status:</strong> 
              <Chip 
                label={orderDetails.status}
                color={orderDetails.status === "DELIVERED" ? "success" : "warning"}
                sx={{ ml: 1 }}
              />
            </Typography>
            <Typography sx={{ fontSize: "16px", mt: 1 }}>
              <strong>Total Amount:</strong> ₹{orderDetails.totalAmount}
            </Typography>
          </CardContent>

          <Divider sx={{ my: 2 }} />

          {/* Order Items Section */}
          <Typography variant="h6" sx={{ fontWeight: "bold", ml: 2 }}>🛍️ Order Items</Typography>
          <List>
  {orderDetails.items.map((item) => (
    <ListItem key={item.id} sx={{ display: "flex", alignItems: "center", px: 3 }}>
      {/* Product Image */}
      <Box 
        component="img"
        src="https://via.placeholder.com/80" // You can replace with a dynamic image if available
        alt={item.productName || "Product"}
        sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 2, mr: 2 }}
      />

      {/* Product Details */}
      <Grid container spacing={2} sx={{ flex: 1 }}>
        <Grid item xs={6}>
          <Typography sx={{ fontWeight: "bold" }}>
            {item.productName || "Product Name Not Available"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Price: ₹{item.price || 0} x {item.quantity}
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "18px", color: "#FF9900" }}>
            ₹{item.price * item.quantity}
          </Typography>
        </Grid>
      </Grid>
    </ListItem>
  ))}
</List>

        </Card>
      )}
    </Container>
  );
};

export default OrderTracking;
