import React, { useEffect, useState } from 'react';
import '../../pages/user/OrderSuccess.css';
import axios from 'axios';

const OrderSuccess = () => {
  const [show, setShow] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    setShow(true);
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:4000/api/user/order', {
        headers: { token },
      });

      // If API returns array of orders, show the latest
      const latestOrder = res.data.order?.at(-1);
      setOrder(latestOrder);

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={`order-success-container ${show ? 'fade-in' : ''}`}>
      <div className="order-card">
        <h1 className="title">🎉 Order Placed Successfully!</h1>
        <p className="subtitle">Thank you for shopping with us.</p>

        {order ? (
          <div className="order-details">
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Total Price:</strong> ₹{order.totalPrice?.toFixed(2)}</p>
            <p><strong>Shipping Address:</strong> {order.address}</p>
            <p><strong>Status:</strong> <span className={`status ${order.status}`}>{order.status}</span></p>
          </div>
        ) : (
          <p>Loading order details...</p>
        )}

        <button className="btn" onClick={() => window.location.href = '/orders'}>
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
