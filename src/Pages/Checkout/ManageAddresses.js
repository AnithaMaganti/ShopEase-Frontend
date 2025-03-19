import { useState, useEffect } from "react";
import api from "../User/Token";
import { Container, Card, Typography, Button, TextField, Grid, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

const ManageAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ street: "", city: "", state: "", zipCode: "" });
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;
    console.log(userId);
  
    if (!storedUser || !storedUser.id) {
      console.error("User ID not found in localStorage.");
      return; // Stop execution if user is not found
    }
  
    try {
      const response = await api.get("/addresses", {
        params: { userId },
      });
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error.response?.data || error.message);
    }
  };
  

  const handleSaveAddress = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user")); //  Parse user object
  const userId = storedUser?.id; //  Extract userId

  if (!userId) {
    alert("User ID is missing. Please log in again.");
    return;
  }
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
      alert("Please fill all fields.");
      return;
    }

    try {
      if (editingAddress) {
        await api.put(`/addresses/${editingAddress.id}`, newAddress);
      } else {
        await api.post("/addresses/save", { userId, ...newAddress });
      }

      fetchAddresses(); // Refresh list
      setNewAddress({ street: "", city: "", state: "", zipCode: "" });
      setEditingAddress(null);
    } catch (error) {
      alert("Failed to save address: " + (error.response?.data || error.message));
    }
  };

  const handleEditAddress = (address) => {
    setNewAddress(address);
    setEditingAddress(address);
  };

  const handleDeleteAddress = async (id) => {
    try {
      await api.delete(`/addresses/${id}`);
      fetchAddresses();
    } catch (error) {
      alert("Failed to delete address: " + (error.response?.data || error.message));
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
        📍 Manage Addresses
      </Typography>

      {/* Address List */}
      {addresses.map((address) => (
        <Card key={address.id} sx={{ p: 2, mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography>
            {address.street}, {address.city}, {address.state} - {address.zipCode}
          </Typography>
          <div>
            <IconButton onClick={() => handleEditAddress(address)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleDeleteAddress(address)} color="error">
              <Delete />
            </IconButton>
          </div>
        </Card>
      ))}

      {/* Add / Edit Address Form */}
      <Card sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6">{editingAddress ? "Edit Address" : "➕ Add New Address"}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Street"
              value={newAddress.street}
              onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="State"
              value={newAddress.state}
              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Zip Code"
              value={newAddress.zipCode}
              onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
            />
          </Grid>
        </Grid>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          fullWidth
          onClick={handleSaveAddress}
        >
          {editingAddress ? "Update Address" : "Save Address"}
        </Button>
      </Card>
    </Container>
  );
};

export default ManageAddresses;
