import React, { useEffect, useState } from 'react';
import '../style/Dashboard.css';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: "",
    orders : "",
    users: ""
  });

  useEffect(() => {

      const fetchproduct = async() => {
          const token = localStorage.getItem('token')
       try {
           const product = await axios.get("http://localhost:4000/api/product/all-products")
           const order = await axios.get("http://localhost:4000/api/admin/order",{
            headers:{ token }
           })
           const user = await axios.get("http://localhost:4000/api/all-users",{
            headers : { token }
           })
           
        setStats({
            products: product.data.product.length,
            orders : order.data.order.length,
            users: user.data.users.length
         
          })
       } catch (error) {
        console.log(error.message);
        
        
       }
      }
   fetchproduct()
    
  }, []);

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Welcome to Admin Dashboard</h1>
      <div className="dashboard-cards">
        <div className="dashboard-card fade-in">
          <h2>Products</h2>
          <p>{stats.products}</p>
        </div>
        <div className="dashboard-card fade-in delay-1">
          <h2>Orders</h2>
          <p>{stats.orders}</p>
        </div>
        <div className="dashboard-card fade-in delay-2">
          <h2>Users</h2>
          <p>{stats.users}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
