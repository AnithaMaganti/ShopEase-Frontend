import React, { useState } from "react";
import { Container, Paper, Typography, Button, Divider, Avatar, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import EditName from "./EditName"; //  Import the new component

const UserMenu = () => {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("user")) || {}; // Prevent errors if user data is missing
    const [user, setUser] = useState(storedUser);
    const [isEditing, setIsEditing] = useState(false); // Track editing mode

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
        window.location.reload();
    };

    return (
        <Container sx={{ display: "flex", justifyContent: "start", alignItems: "center", minHeight: "80vh" }}>
            <Box 
                sx={{ 
                    display: "grid", 
                    gridTemplateColumns: "1fr 1fr", 
                    gap: 4, 
                    width: "750px",
                    maxWidth: "100%"
                }}
            >
                {/*  Left Side - Profile View */}
                <Paper 
                    elevation={4} 
                    sx={{ padding: "20px", borderRadius: "12px", textAlign: "center" }}
                >
                    <Avatar sx={{ bgcolor: "primary.main", width: 80, height: 80, margin: "auto" }}>
                        <FaUserCircle size={60} />
                    </Avatar>

                    <Typography variant="h5" sx={{ fontWeight: "bold", marginTop: 2 }}>
                        {user.name ? user.name : "Guest User"}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "gray", marginBottom: 2 }}>
                        {user.email || "Not Available"}
                    </Typography>

                    <Divider sx={{ marginBottom: 2 }} />

                    <Box sx={{ textAlign: "left" }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
                            Account Settings
                        </Typography>
                        <Button 
                            variant="text" 
                            fullWidth 
                            sx={{ textAlign: "left", justifyContent: "flex-start" }} 
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </Button>
                        <Button variant="text" fullWidth sx={{ textAlign: "left", justifyContent: "flex-start" }}>
                            Change Password
                        </Button>

                        <Divider sx={{ marginY: 2 }} />

                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
                            Orders & Support
                        </Typography>
                        <Button variant="text" fullWidth sx={{ textAlign: "left", justifyContent: "flex-start" }}>
                            My Orders
                        </Button>
                        <Button variant="text" fullWidth sx={{ textAlign: "left", justifyContent: "flex-start" }}>
                            Help & Support
                        </Button>
                    </Box>

                    <Divider sx={{ marginY: 2 }} />

                    <Button 
                        variant="contained" 
                        color="error" 
                        fullWidth 
                        sx={{ marginTop: 2, borderRadius: "8px" }}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Paper>

                {/*  Right Side - Edit Profile (Using the New Component) */}
                {isEditing && <EditName user={user} setUser={setUser} setIsEditing={setIsEditing} />}
            </Box>
        </Container>
    );
};

export default UserMenu;
