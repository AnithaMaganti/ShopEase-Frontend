import React, { useState } from "react";
import { Container, TextField, Button, Typography, Paper, MenuItem, Select, InputLabel, FormControl  } from "@mui/material";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = ({ onSwitch }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false); // ✅ Track success state
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await axios.post("http://localhost:8081/api/auth/register", {
                name,
                email,
                password,
                role,
            });

            if (response.data.success) {
                setIsSuccess(true); //  Set success state
                setMessage("✅ Account registered successfully! OTP sent to your email.");
                setTimeout(() => navigate("/verify-otp", { state: { email } }), 1000); //  Delay navigation by 2 sec
            } else {
                setIsSuccess(false);
                setMessage(response.data.message || "Registration failed");
            }
        } catch (error) {
            setIsSuccess(false);
            setMessage(error.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Paper elevation={4} className="p-4 shadow-lg rounded bg-light" style={{ width: "350px" }}>
                
                {/*  Success/Error Message at the Top */}
                {message && (
                    <Typography 
                        variant="subtitle1" 
                        className="text-center mb-3" 
                        color={isSuccess ? "success.main" : "error"} 
                        style={{ fontWeight: "bold" }}
                    >
                        {message}
                    </Typography>
                )}

                <Typography variant="h4" className="text-center mb-3">Register</Typography>
                <TextField fullWidth label="Name" variant="outlined" sx={{ marginBottom: 2 }} value={name} onChange={(e) => setName(e.target.value)} />
                <TextField fullWidth label="Email" variant="outlined" sx={{ marginBottom: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField fullWidth label="Password" type="password" variant="outlined" sx={{ marginBottom: 2 }} value={password} onChange={(e) => setPassword(e.target.value)} />
                
                {/* Role Dropdown */}
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel id="role-select-label">Role</InputLabel>
                    <Select
                        labelId="role-select-label"
                        id="role-select"
                        value={role}
                        label="Role"
                        onChange={(e) => setRole(e.target.value)}
                        variant="outlined"
                    >
                        <MenuItem value="USER">User</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>

                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} onClick={handleRegister}>
                    Register
                </Button>

                <Typography className="text-center mt-3">
                    Already have an account?{" "}
                    <Button color="secondary" onClick={onSwitch}>Login</Button>
                </Typography>
            </Paper>
        </Container>
    );
};

export default Register;
