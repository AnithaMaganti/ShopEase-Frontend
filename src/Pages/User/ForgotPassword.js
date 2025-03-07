import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography } from "@mui/material";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleForgotPassword = async () => {
        try {
            const response = await axios.post("http://localhost:8081/api/auth/forgot-password", { email });

            setMessage(response.data.message);
        } catch (error) {
            setMessage("Failed to send reset email.");
        }
    };

    return (
        <Container maxWidth="sm" className="mt-5 p-4 shadow-lg rounded bg-light">
            <Typography variant="h4" className="text-center mb-3">Forgot Password</Typography>
            <TextField
                fullWidth
                label="Enter your email"
                variant="outlined"
                className="mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleForgotPassword}>
                Send Reset Link
            </Button>
            <Typography className="text-center mt-3" color="error">{message}</Typography>
        </Container>
    );
};

export default ForgotPassword;
