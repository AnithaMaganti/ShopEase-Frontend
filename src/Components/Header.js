import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, InputBase, Badge, Menu, MenuItem, Box ,List,
  ListItem,
  ListItemText,
  Collapse} from '@mui/material';
import { ShoppingCart, KeyboardArrowDown, Menu as MenuIcon , ExpandLess,
  ExpandMore} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosLogOut } from "react-icons/io";
import {  Home, ShoppingBag, LocalMall, FitnessCenter, MenuBook, DirectionsCar } from "@mui/icons-material";

const Header = ({ onCategorySelect }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoriesAnchor, setCategoriesAnchor] = useState(null);
  const isMobile = useMediaQuery('(max-width:900px)');
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // ✅ Only parse if it's valid JSON
        }
    } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user"); // ✅ Remove invalid data
        setUser(null);
    }
}, []);

// ✅ Function to toggle categories inside the mobile menu
const toggleMobileCategories = () => {
  setMobileCategoriesOpen(!mobileCategoriesOpen);
};


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCategoriesOpen = (event) => {
    if (event && event.currentTarget) {
        event.preventDefault();
        event.stopPropagation();
        setCategoriesAnchor(event.currentTarget); // ✅ Ensures valid anchorEl
    }
};


  const handleCategoriesClose = () => {
    setCategoriesAnchor(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/auth");
  };

  const handleUserClick = () => {
    navigate("/user-menu");
  };

  const handleCategoryClick = (category) => {
    navigate(`/products/${category.toLowerCase()}`); // ✅ Navigate to ProductManagement with category
    handleCategoriesClose();
  };

  
  return (
    <AppBar position="sticky" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" ,flexWrap: "wrap"  }}>
        {/* Logo */}
        <Typography variant="h6" sx={{ fontWeight: "bold", flexShrink: 0 }}>
          Shopease
        </Typography>

        {/* Search Bar (Hidden on Small Screens) */}
        {!isMobile && (
          <InputBase
            placeholder="Search for products"
            sx={{
              backgroundColor: 'white',
              borderRadius: 1,
              padding: '5px 15px',
              width: '300px',
              marginRight: 2,
              flexGrow: 0,
            }}
          />
          
        )}

        {/* User Section & Cart Icon */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, justifyContent: "center" }}>
          {!isMobile && (
            <>
              <Button color="inherit" component={Link} to="/">Home</Button>
              {/* ✅ Categories Dropdown */}
              <Button color="inherit" onClick={handleCategoriesOpen} endIcon={<KeyboardArrowDown />}>Categories</Button>
              <Menu anchorEl={categoriesAnchor} open={Boolean(categoriesAnchor)} onClose={handleCategoriesClose}
               
               sx={{ maxHeight: "400px", overflowY: "auto" }}
               anchorOrigin={{
                 vertical: 'bottom', 
                 horizontal: 'left'
               }}
               transformOrigin={{
                 vertical: 'top', 
                 horizontal: 'left'
               }}
               >
              <MenuItem onClick={() => handleCategoryClick("Electronics")}> <ShoppingBag sx={{ marginRight: 1 }} /> Electronics</MenuItem>
              <MenuItem onClick={() => handleCategoryClick("Fashion")}> <LocalMall sx={{ marginRight: 1 }} /> Fashion</MenuItem>
              <MenuItem onClick={() => handleCategoryClick("Home & Kitchen")}><Home sx={{ marginRight: 1 }} /> Home & Kitchen</MenuItem>
              <MenuItem onClick={() => handleCategoryClick("Beauty & Personal Care")}>💄 Beauty & Personal Care</MenuItem>
              <MenuItem onClick={() => handleCategoryClick("Groceries & Essentials")}>  🛒 Groceries & Essentials</MenuItem>
              <MenuItem onClick={() => handleCategoryClick("Books & Stationery")}>  <MenuBook sx={{ marginRight: 1 }} /> Books & Stationery</MenuItem>
              <MenuItem onClick={() => handleCategoryClick("Sports & Fitness")}> <FitnessCenter sx={{ marginRight: 1 }} /> Sports & Fitness</MenuItem>
              <MenuItem onClick={() => handleCategoryClick("Toys & Baby Products")}> 🧸 Toys & Baby Products</MenuItem>
              <MenuItem onClick={() => handleCategoryClick("Automotive & Accessories")}> <DirectionsCar sx={{ marginRight: 1 }} /> Automotive & Accessories</MenuItem>
              </Menu>
              <Button color="inherit" component={Link} to="/offers">Offers</Button>
            </>
          )}

          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={handleUserClick}>
              <IconButton color="inherit">
                <FaUserCircle size={30} />
              </IconButton>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "white",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "150px",
                }}
              >
                {user.name}
              </Typography>
            </Box>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/auth">Sign In</Button>
              <Button color="inherit" component={Link} to="/auth">Sign Up</Button>
            </>
          )}

          {/* Cart Icon */}
          <IconButton color="inherit" component={Link} to="/cart">
            <Badge badgeContent={0} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {/* Mobile Menu Icon */}
          {isMobile && (
            <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
          )}
        </Box>

        {/* Mobile Dropdown Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem component={Link} to="/" onClick={handleMenuClose}>Home</MenuItem>
         
          {/* Categories Toggle */}
  <MenuItem onClick={toggleMobileCategories}>
    Categories {mobileCategoriesOpen ? <ExpandLess /> : <ExpandMore />}
  </MenuItem>

  {/* Collapsible Categories List */}
  <Collapse in={mobileCategoriesOpen} timeout="auto" unmountOnExit>
    <List component="div" disablePadding>
      <ListItem button onClick={() => handleCategoryClick("Electronics")}>
        <ShoppingBag sx={{ marginRight: 1 }} /> Electronics
      </ListItem>
      <ListItem button onClick={() => handleCategoryClick("Fashion")}>
        <LocalMall sx={{ marginRight: 1 }} /> Fashion
      </ListItem>
      <ListItem button onClick={() => handleCategoryClick("Home & Kitchen")}>
        <Home sx={{ marginRight: 1 }} /> Home & Kitchen
      </ListItem>
      <ListItem button onClick={() => handleCategoryClick("Beauty & Personal Care")}>
        💄 Beauty & Personal Care
      </ListItem>
      <ListItem button onClick={() => handleCategoryClick("Groceries & Essentials")}>
        🛒 Groceries & Essentials
      </ListItem>
      <ListItem button onClick={() => handleCategoryClick("Books & Stationery")}>
        <MenuBook sx={{ marginRight: 1 }} /> Books & Stationery
      </ListItem>
      <ListItem button onClick={() => handleCategoryClick("Sports & Fitness")}>
        <FitnessCenter sx={{ marginRight: 1 }} /> Sports & Fitness
      </ListItem>
      <ListItem button onClick={() => handleCategoryClick("Toys & Baby Products")}>
        🧸 Toys & Baby Products
      </ListItem>
      <ListItem button onClick={() => handleCategoryClick("Automotive & Accessories")}>
        <DirectionsCar sx={{ marginRight: 1 }} /> Automotive & Accessories
      </ListItem>
    </List>
  </Collapse>
          <MenuItem component={Link} to="/offers" onClick={handleMenuClose}>Offers</MenuItem>

          {user ? (
            <MenuItem onClick={handleLogout}>
              <IoIosLogOut size={22} style={{ marginRight: "8px", color: "red" }} />
              Logout
            </MenuItem>
          ) : (
            <>
              <MenuItem component={Link} to="/auth" onClick={handleMenuClose}>Sign In</MenuItem>
              <MenuItem component={Link} to="/auth" onClick={handleMenuClose}>Sign Up</MenuItem>
            </>
          )}

          <MenuItem component={Link} to="/cart" onClick={handleMenuClose}>
            <Badge badgeContent={9} color="secondary" sx={{ marginRight: 1 }}>
              <ShoppingCart />
            </Badge>
            Cart
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;