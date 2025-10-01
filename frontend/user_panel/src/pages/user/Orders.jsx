import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../user/order.css';
import Header from '../../components/Header';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:4000/api/user/order', {
          headers: { token },
        });
        setOrders(res.data.order || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner" />
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-msg">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div>
        <Header />
        <div className="empty-msg">No orders found.</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="order-main">
        <div className="order-page">
          <h1>Your Orders</h1>
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <h3>Order ID: {order._id}</h3>
                <p><strong>Status:</strong> <span className={`status ${order.status}`}>{order.status}</span></p>
                <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Ordered On:</strong> {new Date(order.createdAt).toLocaleString()}</p>

                <div className="items-list">
                  <h4>Items:</h4>
                  {order.items.map(({ productId, quantity }, i) => (
                    <div key={i} className="item">
                      <img
                        src={
                          productId && productId.image
                            ? `http://localhost:4000/${productId.image}`
                            : 'https://via.placeholder.com/50?text=No+Image'
                        }
                        alt={productId ? productId.name : 'Deleted Product'}
                      />
                      <div>
                        <p>{productId ? productId.name : 'Product deleted'}</p>
                        <p>Qty: {quantity}</p>
                        <p>Price: ₹{productId ? productId.price : 'N/A'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
