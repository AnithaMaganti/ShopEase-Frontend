import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; //  Import axios
import { Button, TextField, Container, Typography } from "@mui/material";
import { Card } from "react-bootstrap";

const OtpVerification = () => {
    const [otp, setOtp] = useState("");
    const [resendMessage, setResendMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || ""; //  Get email from navigation state

    //  Prevent form submission & call API correctly
    const handleOtpVerification = async (e) => {
        e.preventDefault(); //  Prevent page reload

        try {
            const response = await axios.post(
                "http://localhost:8081/api/auth/verify-otp",
                { email, otp }
            );

            alert(" OTP verified successfully!");
            navigate("/"); //  Redirect to home
        } catch (error) {
            console.error("Error:", error);
            alert(error.response?.data?.message || "Something went wrong!");
        }
    };

    //  Fix: Use `axios.post()` for consistency with the backend
    const handleResendOtp = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8081/api/auth/resend-otp`,
                { email },
                { withCredentials: true }
            );

            setResendMessage(response.data.message);
        } catch (error) {
            console.error(" Error:", error);
            setResendMessage("Failed to resend OTP.");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <Card style={{ width: "100%", maxWidth: "400px", padding: "20px" }}>
                <Typography variant="h5" className="mb-4 text-center">Verify OTP</Typography>
                <form onSubmit={handleOtpVerification}> {/*  Fix Form Submission */}
                    <TextField
                        label="Enter OTP"
                        variant="outlined"
                        fullWidth
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        style={{ marginBottom: "15px" }}
                    />
                    <Button variant="contained" type="submit" fullWidth>
                        Verify OTP
                    </Button>
                </form>
                <Typography className="text-center mt-3" color="error">{resendMessage}</Typography>
                <Button variant="text" color="primary" fullWidth onClick={handleResendOtp}>
                    Resend OTP
                </Button>
            </Card>
        </Container>
    );
};

export default OtpVerification;
