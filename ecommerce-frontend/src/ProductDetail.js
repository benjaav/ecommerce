const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
      });

      trackFacebookEvent('AddToCart', {
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: 'CLP'
      });

      navigate('/cart');
    }
  };

  if (error) return (
    <div><NavBar /><p style={{ color:'red', textAlign:'center' }}>{error}</p></div>
  );
  if (!product) return (
    <div><NavBar /><p style={{ textAlign:'center' }}>Cargando producto...</p></div>
  );

  return (
    <div className="container">
      <NavBar />
      <div className="detail-container">
        <button onClick={handleGoBack} className="back-btn">Volver</button>
        <div className="detail-header">
          <h2>{product.name}</h2>
          <p className="price">${product.price}</p>
        </div>
        <div className="detail-images">
          {product.images && product.images.length > 0
            ? product.images.map(imgObj => {
                const src = imgObj.image.startsWith('http')
                  ? imgObj.image
                  : `/media/${imgObj.image}`;
                return (
                  <img key={imgObj.id} src={src} alt={product.name} className="detail-img" />
                );
              })
            : <p>No hay imágenes para este producto.</p>
          }
        </div>
        <div className="detail-info">
          <h3>Descripción</h3>
          <p>{product.description}</p>
        </div>
        <button onClick={handleAddToCart} className="submit">
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
