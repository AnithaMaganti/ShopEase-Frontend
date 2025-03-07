import { useState, useEffect } from "react";
import {
  Button,
  MenuItem,
  Select,
  TextField,
  AppBar,
  Toolbar,
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Rating,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import SearchBar from "../../Components/SearchBar";
import AddToCart from "../Cart/AddToCart";

export default function ProductManagement() {
  const { category: categoryFromUrl } = useParams();
  const [category, setCategory] = useState(categoryFromUrl || "All");
  const [subcategory, setSubcategory] = useState("All");
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showCustomRange, setShowCustomRange] = useState(false); // Track custom range selection
  const [filters, setFilters] = useState({
    brand: "",
    color: "",
    selectedPriceRange: "",
    minPrice: "",
    maxPrice: "",
  });
  
  const [cartUpdated, setCartUpdated] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Track search input

  // ✅ Predefined price ranges with "Custom Range"
  const priceRanges = [
    { label: "Below ₹500", min: 0, max: 499 },
    { label: "₹500 - ₹1000", min: 500, max: 1000 },
    { label: "₹1000 - ₹5000", min: 1000, max: 5000 },
    { label: "₹5000 - ₹10,000", min: 5000, max: 10000 },
    { label: "₹10,000 - ₹20,000", min: 10000, max: 20000 },
    { label: "Above ₹20,000", min: 20001, max: Infinity },
    { label: "Custom Range", min: null, max: null }, // Custom Range option
  ];

 

  //  Fetch all products by category when the page loads
  useEffect(() => {
    if (category && category !== "All") {
      fetchProductsByCategory();
      fetchSubcategories();
    }
  }, [category]);

  // ✅ Fetch products only when subcategory or filters change
  useEffect(() => {
    if (subcategory !== "All") {
      fetchProductsBySubcategory();
    } else {
      fetchProductsByCategory(); // Show category products when subcategory is "All"
    }
  }, [subcategory]);

  useEffect(() => {
    fetchFilteredProducts();
  }, [filters]);

  // ✅ Fetch subcategories when category changes
  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/products/subcategories/name/${category}`
      );
      console.log("Subcategories:", response.data);
      setSubcategories(["All", ...response.data]);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // ✅ Fetch all products by category (without filters)
  const fetchProductsByCategory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/products/category/name/${category}`
      );
      console.log("Category Products:", response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products by category:", error);
    }
  };

  // ✅ Fetch products by subcategory
  const fetchProductsBySubcategory = async () => {
    try {
      setSearchQuery(""); // ✅ Reset search bar when filters change
      const response = await axios.get(
        `http://localhost:8081/api/products/subcategory/name/${subcategory}`
      );
      console.log("Subcategory Products:", response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products by subcategory:", error);
    }
  };

  // ✅ Fetch filtered products when filters are applied
  const fetchFilteredProducts = async () => {
    try {
      setSearchQuery(""); // ✅ Reset search when filters change

      let params = {};
      const hasFilters = Object.keys(filters).some(
        (key) => filters[key] !== "" && filters[key] !== "All"
      );

      if (subcategory !== "All") params.subcategory = subcategory;
      if (filters.brand) params.brand = filters.brand;
      if (filters.color) params.color = filters.color;
      if (filters.minPrice !== "") params.minPrice = filters.minPrice;
      if (filters.maxPrice !== "" && filters.maxPrice !== Infinity)
        params.maxPrice = filters.maxPrice;

      const response = await axios.get(
        `http://localhost:8081/api/products/category/name/${category}/${
          hasFilters ? "price" : ""
        }`,
        hasFilters ? { params } : {}
      );

      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    }
  };



    // const handleAddToCart = (product) => {
    //   setCart((prevCart) => {
    //     const existingProduct = prevCart.find((item) => item.id === product.id);
    //     if (existingProduct) {
    //       // If the product already exists in the cart, increase its quantity
    //       return prevCart.map((item) =>
    //         item.id === product.id
    //           ? { ...item, quantity: item.quantity + 1 }
    //           : item
    //       );
    //     } else {
    //       // If it's a new product, add it to the cart
    //       return [...prevCart, { ...product, quantity: 1 }];
    //     }
    //   });
    // };
    
  
     // ✅ Refresh cart when item is added
  const refreshCart = () => {
    setCartUpdated((prev) => !prev);
  };
  

  return (
    <Box className="bg-white shadow-md p-4 flex flex-col gap-1 relative">
      <AppBar
  position="static"
  sx={{
    backgroundColor: "white",
    paddingY: 1.5,
    boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
  }}
>
  <Toolbar
    sx={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 1,
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        width: "100%",
        justifyContent: { xs: "center", sm: "space-between" }, // ✅ Centered on mobile, spread on desktop
        alignItems: "center",
      }}
    >
      {/* 🔹 Subcategory Dropdown */}
      {category !== "All" && subcategories.length > 0 && (
        <Select
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          displayEmpty
          sx={{
            backgroundColor: "#f8f9fa",
            borderRadius: 2,
            padding: "8px",
            minWidth: "160px",
            border: "1px solid #ddd",
            "&:hover": { borderColor: "#ff9f00" },
          }}
        >
          {subcategories.map((subcat) => (
            <MenuItem key={subcat} value={subcat}>
              {subcat}
            </MenuItem>
          ))}
        </Select>
      )}

      {/* 🔹 Price Range Dropdown */}
      <Select
        value={filters.selectedPriceRange}
        onChange={(e) => {
          const selectedLabel = e.target.value;
          if (selectedLabel === "Custom Range") {
            setShowCustomRange(true);
            setFilters({
              ...filters,
              selectedPriceRange: "Custom Range",
              minPrice: "",
              maxPrice: "",
            });
          } else {
            setShowCustomRange(false);
            const selectedRange = priceRanges.find(
              (range) => range.label === selectedLabel
            );
            if (selectedRange) {
              setFilters({
                ...filters,
                selectedPriceRange: selectedLabel,
                minPrice: selectedRange.min,
                maxPrice: selectedRange.max,
              });
            }
          }
        }}
        displayEmpty
        sx={{
          backgroundColor: "#f8f9fa",
          borderRadius: 2,
          padding: "8px",
          minWidth: "180px",
          border: "1px solid #ddd",
          "&:hover": { borderColor: "#ff9f00" },
        }}
      >
        <MenuItem value="">Select Price Range</MenuItem>
        {priceRanges.map((range) => (
          <MenuItem key={range.label} value={range.label}>
            {range.label}
          </MenuItem>
        ))}
      </Select>

      {/* 🔹 Custom Range Inputs (if selected) */}
      {showCustomRange && (
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            type="number"
            label="Min ₹"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: e.target.value })
            }
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              width: "120px",
              border: "1px solid #ddd",
              "&:hover": { borderColor: "#ff9f00" },
            }}
          />
          <TextField
            type="number"
            label="Max ₹"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value })
            }
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              width: "120px",
              border: "1px solid #ddd",
              "&:hover": { borderColor: "#ff9f00" },
            }}
          />
        </Box>
      )}

      {/* 🔹 Brand Dropdown */}
      <Select
        value={filters.brand}
        onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
        displayEmpty
        sx={{
          backgroundColor: "#f8f9fa",
          borderRadius: 2,
          padding: "8px",
          minWidth: "160px",
          border: "1px solid #ddd",
          "&:hover": { borderColor: "#ff9f00" },
        }}
      >
        <MenuItem value="">Select Brand</MenuItem>
        <MenuItem value="Samsung">Samsung</MenuItem>
        <MenuItem value="Apple">Apple</MenuItem>
        <MenuItem value="OnePlus">OnePlus</MenuItem>
      </Select>

      {/* 🔹 Color Dropdown */}
      <Select
        value={filters.color}
        onChange={(e) => setFilters({ ...filters, color: e.target.value })}
        displayEmpty
        sx={{
          backgroundColor: "#f8f9fa",
          borderRadius: 2,
          padding: "8px",
          minWidth: "160px",
          border: "1px solid #ddd",
          "&:hover": { borderColor: "#ff9f00" },
        }}
      >
        <MenuItem value="">Select Color</MenuItem>
        <MenuItem value="Phantom Black">Phantom Black</MenuItem>
        <MenuItem value="Titanium Blue">Titanium Blue</MenuItem>
        <MenuItem value="Iron Gray">Iron Gray</MenuItem>
      </Select>

      {/* 🔍 Search Bar */}
      <Box
        sx={{
          minWidth: "200px",
          width: { xs: "100%", sm: "auto" },
        }}
      >
        <SearchBar
          onResults={setProducts}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </Box>

      {/* ❌ Clear Filters Button */}
      <Button
        variant="contained"
        color="error"
        onClick={() => {
          setFilters({
            brand: "",
            color: "",
            selectedPriceRange: "",
            minPrice: "",
            maxPrice: "",
          });
          setSubcategory("All");
          fetchFilteredProducts();
        }}
        sx={{
          backgroundColor: "#ff4d4d",
          fontWeight: "bold",
          textTransform: "none",
          borderRadius: 2,
          paddingX: 3,
          "&:hover": { backgroundColor: "#cc0000" },
        }}
      >
        Clear Filters
      </Button>
    </Box>
  </Toolbar>
</AppBar>


      {/*  Display Products */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(auto-fit, minmax(140px, 1fr))", // Mobile view
            sm: "repeat(auto-fit, minmax(180px, 1fr))", // Tablet view
            md: "repeat(auto-fit, minmax(220px, 1fr))", // PC view
          },
          gap: 3,
          marginTop: 3,
          padding: 2,
        }}
      >
        {products.length === 0 ? (
          <Typography variant="h6" sx={{ margin: "auto", padding: 2 }}>
            No products found.
          </Typography>
        ) : (
          products.map((product) => (
            <Card
              key={product.id}
              sx={{
                width: "100%",
                maxWidth: 250, // ✅ Consistent card size
                height: 420, // ✅ Uniform height for better UI
                boxShadow: 3,
                borderRadius: 2,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "white",
                transition: "transform 0.2s ease-in-out",
                "&:hover": { transform: "scale(1.05)", boxShadow: 5 }, // ✅ Hover effect like Amazon
              }}
            >
              {/* ✅ Product Image */}
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:8081${product.imageUrl}`}
                alt={product.name}
                sx={{
                  objectFit: "contain",
                  padding: 1,
                  backgroundColor: "#f8f8f8",
                }} // ✅ White background like Amazon
              />

              {/* ✅ Product Details */}
              <CardContent sx={{ padding: 2, textAlign: "left" }}>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: 16 }}
                >
                  {product.name}
                </Typography>
                <Typography color="textSecondary" sx={{ fontSize: 14 }}>
                  Brand: {product.brand}
                </Typography>
                <Typography color="textSecondary" sx={{ fontSize: 14 }}>
                  Color: {product.color}
                </Typography>

                {/* ✅ Price & Discount */}
                <Typography
                  variant="h6"
                  sx={{ color: "#b12704", fontWeight: "bold" }}
                >
                  ₹{product.price}{" "}
                  <span style={{ fontSize: "14px", color: "red" }}>
                    ({product.discount}% OFF)
                  </span>
                </Typography>

                {/* ✅ Rating (if available) */}
                {product.rating && (
                  <Rating
                    value={product.rating}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                )}

                {/* ✅ Add to Cart Button */}
                {/* <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    marginTop: 1,
                    backgroundColor: "#ff9f00", // ✅ Amazon-like yellow button
                    "&:hover": { backgroundColor: "#fb8c00" },
                  }}
                  // onClick={() => handleAddToCart(product)}
                >
                  <AddToCart productId={product.id} refreshCart={refreshCart} />
                </Button> */}
                <AddToCart productId={product.id} refreshCart={refreshCart} />
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
}
