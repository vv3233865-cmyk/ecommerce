import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/AdminOrderPage.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:4000/api/admin/order', {
        headers: { token }
      });
      setOrders(res.data.order || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err.message);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(
        `http://localhost:4000/api/orderStatus/update/${orderId}`,
        { status: newStatus },
        { headers: { token } }
      );
      alert(res.data.message);
      fetchOrders(); // Refresh orders
    } catch (err) {
      console.error('Error updating status:', err.message);
      alert('Failed to update status');
    }
  };

  return (
    <div className="admin-order-page">
      <h1 className="title">Orders Management</h1>
      <div className="order-table-container fade-in">
        <table className="order-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>User</th>
              <th>Total Price</th>
              <th>Items</th>
              <th>Status</th>
              <th>Change Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={order._id} className="slide-up">
                  <td>{index + 1}</td>
                  <td>{order._id}</td>
                  <td>{order.user?.name || 'N/A'}</td>
                  <td>${order.totalPrice}</td>
                  <td>
                    {order.items.map((item, i) => (
                      <span key={i}>
                        {item.quantity}x {item.productId?.name || 'Product'}
                        <br />
                      </span>
                    ))}
                  </td>
                  <td className={`status ${order.status}`}>{order.status}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="comfirmed">Confirmed</option>
                      <option value="shipping">Shipping</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
