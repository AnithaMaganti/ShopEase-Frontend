import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../User/Token";
import { Container, Card, Typography, CircularProgress } from "@mui/material";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);


  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(`/order/${orderId}`);
        setOrderDetails(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#4CAF50" }}>
        ✅ Order Confirmed!
      </Typography>
      {orderDetails ? (
        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>📦 Order ID: {orderDetails.id}</Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FF9800" }}>
            Status: {orderDetails.status}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>🛒 Order Items:</Typography>
          {orderDetails.items.map((item) => (
            <Typography key={item.id}>
              {item.product.name} - ₹{item.product.price} x {item.quantity}
            </Typography>
          ))}
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FF9800", mt: 3 }}>
            Total: ₹{orderDetails.totalAmount}
          </Typography>
        </Card>
      ) : (
        <CircularProgress sx={{ mt: 3 }} />
      )}
    </Container>
  );
};

export default OrderConfirmation;
