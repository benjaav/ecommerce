import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import axios from 'axios';

export default function MaterialUIStoreExample() {
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products/?page=1');
      if (response.data.results) {
        setProducts(response.data.results);
      } else {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddToCart = (productId) => {
    // Aquí puedes integrar la lógica para agregar al carrito, similar a Products.js
    setSuccessMessage(productId);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                sx={{
                  pt: '56.25%',
                }}
                image={product.images && product.images.length > 0 ? product.images[0].image : ''}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography>
                  {product.description || 'Sin descripción disponible.'}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  ${parseInt(product.price).toLocaleString()}
                </Typography>
              </CardContent>
              <Button variant="contained" color="primary" sx={{ m: 2 }} onClick={() => handleAddToCart(product.id)}>
                Comprar
              </Button>
              {successMessage === product.id && (
                <Typography color="success.main" sx={{ textAlign: 'center', mb: 2 }}>
                  ¡Producto agregado con éxito!
                </Typography>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
