import React, { useState } from "react";
import { Paper, Typography, Button, TextField, Box } from "@mui/material";
import axios from "axios";

const EditName = ({ user, setUser, setIsEditing }) => {
    const [newName, setNewName] = useState(user.name || "");
    const [message, setMessage] = useState(""); // Success/Error message

    const handleSaveProfile = async () => {
        if (newName.trim() === "") return;
    
        try {
            const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : "";
    
            const response = await axios.put(
                "http://localhost:8081/api/auth/update-name",
                {
                    userId: user.id,
                    newName: newName,
                },
                {
                    headers: { Authorization: `Bearer ${token}` } //  Attach token
                }
            );
    
            if (response.data.success) {
                const updatedUser = { ...user, name: newName };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);
                setMessage("Username updated successfully! ");
                setIsEditing(false);
            } else {
                setMessage("Failed to update username. ");
            }
        } catch (error) {
            setMessage("Error updating username. ");
        }
    };
    
    return (
        <Paper 
            elevation={4} 
            sx={{ 
                padding: "20px", 
                borderRadius: "12px", 
                textAlign: "center", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center",
                width: "100%",  
                alignSelf: "flex-start", 
                maxWidth: "100%",  
            }}
        >
            <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                Edit Profile
            </Typography>
            <TextField 
                fullWidth 
                label="New Username" 
                variant="outlined" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}
                sx={{ marginBottom: 2 }}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSaveProfile}>
                    Save Changes
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                </Button>
            </Box>
            {message && (
                <Typography sx={{ marginTop: 2, color: message.includes("successfully") ? "green" : "red" }}>
                    {message}
                </Typography>
            )}
        </Paper>
    );
};

export default EditName;
