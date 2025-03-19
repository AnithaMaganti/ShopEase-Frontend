import { useEffect, useState } from "react";
import api from "../User/Token";
import Slider from "react-slick";  // scrolling
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material"; //  Same color icons

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get("/featured-products")
            .then(response => setProducts(response.data))
            .catch(error => console.error("Error fetching featured products:", error));
    }, []);

    //  Custom Arrow Component
    const CustomArrow = ({ direction, onClick }) => {
        const isLeft = direction === "left";
        return (
            <div
                onClick={onClick}
                style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    [isLeft ? "left" : "right"]: "-30px", //  Position arrows outside the slider
                    zIndex: 2,
                    cursor: "pointer",
                    color: "#ff9900",  // orange color
                    fontSize: "30px",
                    backgroundColor: "white",
                    borderRadius: "50%", //  Reduced from 80% to 50% for smaller roundness
                    padding: "5px",
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                }}
            >
                {isLeft ? <ArrowBackIosNew fontSize="medium" /> : <ArrowForwardIos fontSize="medium" />}
            </div>
        );
    };
    

    //  Amazon-like Carousel Settings
    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 2000,
        prevArrow: <CustomArrow direction="left" />,  //  Same color left arrow
        nextArrow: <CustomArrow direction="right" />, //  Same color right arrow
        responsive: [
            {
                breakpoint: 1024, //  Tablets
                settings: { slidesToShow: 3, slidesToScroll: 2 },
            },
            {
                breakpoint: 768, //  Mobile
                settings: { slidesToShow: 2, slidesToScroll: 1 },
            },
        ],
    };

    return (
        <div style={{ width: "90%", margin: "auto", padding: "20px 0" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "left", padding: "10px 0" }}>
                Featured Products
            </h2>
            
            <Slider {...sliderSettings}>
                {products.map(product => (
                    <div key={product.id} style={{ padding: "10px" }}>
                        <div 
                            style={{ 
                                border: "1px solid #ddd",
                                borderRadius: "10px",
                                overflow: "hidden",
                                textAlign: "center",
                                padding: "10px",
                                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                                transition: "transform 0.3s ease-in-out",
                                cursor: "pointer"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                        >
                            <img 
                                src={`http://localhost:8081${product.image}`} 
                                alt={product.name} 
                                style={{ width: "100%", height: "180px", objectFit: "contain", padding: "10px" }}
                            />
                            <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: "10px 0" }}>
                                {product.name}
                            </h3>
                            <p style={{ fontSize: "16px", fontWeight: "bold", color: "#ff9900" }}>
                                ₹{product.price}
                            </p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default FeaturedProducts;
