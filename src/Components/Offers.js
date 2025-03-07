import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardMedia, Typography, Container, Grid } from "@mui/material";

const Offers = () => {
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8081/api/offers")
            .then(response => setOffers(response.data))
            .catch(error => console.error("Error fetching offers:", error));
    }, []);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ textAlign: "center", mb: 3, fontWeight: "bold", color: "#ff9900" }}>
                🔥 Exclusive Offers
            </Typography>

            <Grid container spacing={3}>
                {offers.map(offer => (
                    <Grid item xs={12} sm={6} md={4} key={offer.id}>
                        <Card sx={{ boxShadow: 3, transition: "transform 0.3s", "&:hover": { transform: "scale(1.05)" } }}>
                            <CardMedia component="img" height="200" image={`http://localhost:8081${offer.imageUrl}`} alt={offer.title} />
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>{offer.title}</Typography>
                                <Typography variant="body2" color="textSecondary">{offer.description}</Typography>
                                <Typography variant="h5" color="error" sx={{ mt: 1 }}>
                                    {offer.discountPercentage}% OFF
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Offers;
