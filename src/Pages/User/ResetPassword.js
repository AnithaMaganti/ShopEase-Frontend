import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, TextField, Button, Typography } from "@mui/material";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    
    //  Get Token from URL
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const handleResetPassword = async () => {
        try {
            const response = await axios.post("http://localhost:8081/api/auth/reset-password", { token, newPassword });

            setMessage(response.data.message);
            if (response.data.success) {
                navigate("/auth");
            }
        } catch (error) {
            setMessage("Password reset failed.");
        }
    };

    return (
        <Container maxWidth="xs" className="mt-5 p-4 shadow-lg rounded bg-light">
            <Typography variant="h4" className="text-center mb-3">Reset Password</Typography>
            <TextField
                fullWidth
                label="New Password"
                type="password"
                variant="outlined"
                className="mb-3"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
            />
            <Button variant="contained" color="primary"  
            style={{ width: "200px", margin: "auto", display: "block" }}  
            onClick={handleResetPassword}>
                Reset Password
            </Button>
            <Typography className="text-center mt-3" color="error">{message}</Typography>
        </Container>
    );
};

export default ResetPassword;
