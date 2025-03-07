import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Modal,
  Box,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { saveTokens } from "./Token";
import api from "./Token";

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); //  Track success state
  const [openModal, setOpenModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log("Attempting login for:", email); //  Debugging log

      const response = await api.post(
        "/auth/login",
        {
          email: email.trim(),
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json", //  Ensure JSON format
            Accept: "application/json", //  Specify accepted response type
          },
        }
      );

      console.log("Login Response:", response.data); //  Log API response

      //  Ensure the response contains the necessary data
      if (response.data.accessToken && response.data.refreshToken) {
        //  Store tokens securely
        saveTokens(response.data.accessToken, response.data.refreshToken);

        //  Ensure user details exist before storing
        if (response.data.id && response.data.name && response.data.email) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: response.data.id,
              name: response.data.name,
              email: response.data.email,
            })
          );
        } else {
          console.warn("⚠️ No user data found in response!");
        }

        console.log(" User data stored:", localStorage.getItem("user"));

        setMessage(" Login successful!");

        //  Wait a short time before navigating to ensure tokens are saved
        setTimeout(() => {
          navigate("/"); // Redirect without reloading
        }, 500);
      } else {
        setMessage(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8081/api/auth/forgot-password",
        {
          email: forgotEmail,
        }
      );
      alert(response.data.message || "Password reset link sent to your email.");
      setOpenModal(false);
    } catch (error) {
      alert(error.response?.data?.message || "Error sending reset link.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Paper
        elevation={4}
        className="p-4 shadow-lg rounded bg-light"
        style={{ width: "350px" }}
      >
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

        <Typography variant="h4" className="text-center mb-3">
          Login
        </Typography>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          sx={{ marginBottom: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          sx={{ marginBottom: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Typography className="text-center mt-3">
          <Button color="secondary" onClick={() => setOpenModal(true)}>
            Forgot Password?
          </Button>
        </Typography>
        <Typography className="text-center mt-3">
          Don't have an account?{" "}
          <Button color="secondary" onClick={onSwitch}>
            Register
          </Button>
        </Typography>
      </Paper>

      {/* Forgot Password Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          className="p-4 bg-white shadow-lg rounded"
          style={{ width: "350px", margin: "10% auto", padding: "20px" }}
        >
          <Typography variant="h6" className="mb-3">
            Forgot Password
          </Typography>
          <TextField
            fullWidth
            label="Enter your email"
            variant="outlined"
            sx={{ marginBottom: 2 }}
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleForgotPassword}
          >
            Send Reset Link
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default Login;
