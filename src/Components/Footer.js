import React from 'react';
import { Container, Typography, Link, Box, IconButton, Stack } from '@mui/material';
import { Facebook, Instagram, Twitter } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ backgroundColor: '#232F3E', color: 'white', py: 4 }}>
      <Container>
        {/* Footer Links */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="space-between">
          <Box>
            <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>About Us</Typography>
            <Link href="#" color="inherit" display="block" sx={{ color: '#ddd', '&:hover': { color: '#ff9900' } }}>
              Company Info
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ color: '#ddd', '&:hover': { color: '#ff9900' } }}>
              Careers
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ color: '#ddd', '&:hover': { color: '#ff9900' } }}>
              Contact Us
            </Link>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>Help</Typography>
            <Link href="#" color="inherit" display="block" sx={{ color: '#ddd', '&:hover': { color: '#ff9900' } }}>
              Customer Service
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ color: '#ddd', '&:hover': { color: '#ff9900' } }}>
              Returns & Exchange
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ color: '#ddd', '&:hover': { color: '#ff9900' } }}>
              Track Your Order
            </Link>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>Policies</Typography>
            <Link href="#" color="inherit" display="block" sx={{ color: '#ddd', '&:hover': { color: '#ff9900' } }}>
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ color: '#ddd', '&:hover': { color: '#ff9900' } }}>
              Terms & Conditions
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ color: '#ddd', '&:hover': { color: '#ff9900' } }}>
              Shipping & Delivery
            </Link>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>Follow Us</Typography>
            <Stack direction="row" spacing={1}>
              <IconButton color="inherit" href="https://facebook.com" sx={{ color: '#ddd', '&:hover': { color: '#ff9900' } }}>
                <Facebook />
              </IconButton>
              <IconButton color="inherit" href="https://instagram.com" sx={{ color: '#ddd', '&:hover': { color: '#ff9900' } }}>
                <Instagram />
              </IconButton>
              <IconButton color="inherit" href="https://twitter.com" sx={{ color: '#ddd', '&:hover': { color: '#ff9900' } }}>
                <Twitter />
              </IconButton>
            </Stack>
          </Box>
        </Stack>

        {/* Footer Text */}
        <Typography variant="body2" align="center" sx={{ mt: 3, color: '#ddd' }}>
          © 2025 Shopease. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
