import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cartLogin from '../../assets/cart-login.webp';
import '../user/cart.css';
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import emptyCart from '../../assets/empty-cart.png'

const Cart = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      fetchCart(token);
    } else {
      setLoading(false); // No need to load if not logged in
    }
  }, []);

  const fetchCart = async (token) => {
    try {
      const res = await axios.get('http://localhost:4000/api/cart', {
        headers: { token },
      });
      setCart(res.data.cart);
      setFetchError('');
    } catch (error) {
      console.error('Failed to load cart:', error.message);
      setFetchError('Failed to load cart. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(
        `http://localhost:4000/api/cart/update/${productId}`,
        { quantity: newQty },
        { headers: { token } }
      );
      setCart(res.data.cart);
    } catch (error) {
      alert('Failed to update quantity');
      console.error(error.message);
    }
  };

  const removeCart = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.delete(
        `http://localhost:4000/api/cart/remove/${productId}`,
        { headers: { token } }
      );
      setCart(res.data.cart);
    } catch (error) {
      alert('Failed to remove item');
      console.error(error.message);
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    navigate('/placeorder');
  };

  // -------------------- Render States --------------------

  if (!isLoggedIn) {
    return (
      <div className="cart-login-prompt">
        <Header />
        <div className="cart_main">
          <h1>MY CART</h1>
          <p>Please login to view your cart</p>
          <img src={cartLogin} alt="Login to view cart" />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-loading">
        <Header />
        <div className="cart_main">
          <h1>MY CART</h1>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="cart-error">
        <Header />
        <div className="cart_main">
          <h1>MY CART</h1>
          <p>{fetchError}</p>
        </div>
      </div>
    );
  }

  if (cart?.items?.length === 0) {
    return (
      <div className="cart-empty">
        <Header />
        <div className="cart_main">
          <h1>MY CART</h1>
          <div className='cart-empty-1'>
          <p>Your cart is empty</p>
          <img src= {emptyCart} alt="" srcset="" />

          </div>
        
        </div>
      </div>
    );
  }

  // -------------------- Normal cart view --------------------
  return (
    <div className="main">
      <Header />
      <div className="cart_main">
        <h1>MY CART</h1>
        <div className="cart_content_main">
          <div className="content_container">
            {cart.items.map((item) => (
              <div key={item.productId._id} className="cart_content1">
                <div>
                  <img
                    src={`http://localhost:4000/${item.productId.image}`}
                    alt={item.productId.title}
                  />
                </div>
                <div className="cart_content2">
                  <h4>{item.productId.title}</h4>
                  <p>Price: ₹{item.productId.price}</p>
                  <p>
                    Qty :
                    <button onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}>
                      -
                    </button>
                    <span> {item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}>
                      +
                    </button>
                  </p>
                  <button
                    className="removebtn"
                    onClick={() => removeCart(item.productId._id)}
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="price_main">
            <p>Price Details</p>
            <h3>
              TOTAL AMOUNT
              <br />
              <span>
                ₹
                {cart.items.reduce(
                  (total, item) => total + item.productId.price * item.quantity,
                  0
                )}
              </span>
            </h3>
            <button onClick={handlePlaceOrder}>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
