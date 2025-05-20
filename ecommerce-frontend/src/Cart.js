import React from 'react';
import './Cart.css';

function Cart({ cartItems, onUpdateQuantity, onRemoveItem }) {
  return (
    <div className="cart-container">
      <h2>Mi Carrito</h2>
      {/* Botón "Limpiar datos antiguos" eliminado */}

      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-product-image" />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={e => onUpdateQuantity(item.id, parseInt(e.target.value))}
                className="quantity-input"
              />
              <div className="cart-item-actions">
                <button className="update-btn" onClick={() => onUpdateQuantity(item.id, item.quantity)}>
                  Actualizar
                </button>
                <button className="remove-btn" onClick={() => onRemoveItem(item.id)}>
                  Eliminar
                </button>
              </div>
              <p className="item-price">{item.quantity} × ${item.price}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Cart;
