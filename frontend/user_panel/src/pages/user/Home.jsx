import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './home.css';
import Header from '../../components/Header'


const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:4000/api/product/all-products')
      .then(res => {
        setProducts(res.data.product);
      })
      .catch(err => {
        console.error("Error fetching products", err);
      });
  }, []);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div>
      <Header />


      <div className="home-page">
        {/* Banner */}
        <div className="hero-banner">
          <h1>Big Sale is Live!</h1>
          <p>Get the best deals on top products</p>
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {products.map(product => (
            <div className="product-card" key={product._id}>
              <div className="product-img" onClick={() => handleProductClick(product._id)}>
                <img src={`http://localhost:4000/${product.image}`} alt={product.title} />
              </div>
              <div className="product-info">
                <h3>{product.title}</h3>
                <p className="price">₹{product.price}</p>
                <button onClick={() => handleProductClick(product._id)}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default Home;


