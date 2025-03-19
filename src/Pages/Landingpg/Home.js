import React from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { Button, Card, CardContent, Grid, Container, Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import FeaturedProducts from "./FeaturedProducts";
import { useMediaQuery } from "@mui/material";

const categories = [
  { name: "Electronics", image: "/images/Electronics.jpg", path: "/products/electronics" },
  { name: "Fashion", image: "/images/Fashion.jpg", path: "/products/fashion" },
  { name: "Home & Kitchen", image: "/images/Home&Kitchen.jpg", path: "/products/home-kitchen" },
  { name: "Beauty & Personal Care", image: "/images/Beauty&PersonalCare.jpeg", path: "/products/beauty-personal-care" },
  { name: "Books", image: "/images/Books.jpeg", path: "/products/books" },
  { name: "Toys", image: "/images/Toys.jpeg", path: "/products/toys" },
];

const bannerImages = [
  // "/images/banner1.jpg",
  // "/images/banner2.jpg",
  // "/images/banner3.jpg",
  // "/images/banner4.jpg",
  "/images/banner8.jpg",
  "/images/banner6.jpg",
  "/images/banner7.jpg",
  
];

const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 1000,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  cssEase: "linear",
  pauseOnHover: false,
  arrows: false,
};

const Home = () => {
  const navigate = useNavigate();

  //  Responsive breakpoints
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:1024px)");

  return (
    <div style={{ backgroundColor: "#f1f1f1" }}>
      <Header />

      {/*  Hero Banner with Sliding Images */}
      <div
        style={{
          width: isMobile ? "95vw" : isTablet ? "85vw" : "80vw",
          margin: "auto",
          padding: isMobile ? "10px 0" : "20px 0",
          overflow: "hidden",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        <Slider {...carouselSettings}>
          {bannerImages.map((img, index) => (
            <div key={index} style={{ position: "relative", textAlign: "center", width: "100%" }}>
              <img
                src={img}
                alt={`Banner ${index + 1}`}
                style={{
                  width: "100%",
                  height: isMobile ? "200px" : isTablet ? "300px" : "350px",
                  objectFit: "cover",
                  display: "block",
                  borderRadius: "10px",
                  aspectRatio: "16/5", // Ensures consistent aspect ratio
                }}
              />
            </div>
          ))}
        </Slider>
      </div>

      {/*  Category Section */}
      <Container sx={{ my: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "start", mb: 2 }}>
          Shop by Category
        </Typography>
        <Grid container spacing={isMobile ? 1 : 2} justifyContent="center">
          {categories.map((category, index) => (
            <Grid item xs={6} sm={4} md={2} key={index}>
              <Card
                sx={{
                  cursor: "pointer",
                  textAlign: "center",
                  p: 2,
                  height: isMobile ? "140px" : "180px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  "&:hover": { boxShadow: 3 },
                }}
                onClick={() => navigate(category.path)}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  style={{
                    width: isMobile ? "60px" : "80px",
                    height: isMobile ? "60px" : "80px",
                    objectFit: "cover",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    fontSize: isMobile ? "12px" : "14px",
                    fontWeight: "bold",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                  }}
                >
                  {category.name}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/*  Featured Products Section */}
      <FeaturedProducts />

      <Footer />
    </div>
  );
};

export default Home;
