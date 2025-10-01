import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './productDetails.css';
import Header from '../../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [allRelated, setAllRelated] = useState([]);
  const [filteredRelated, setFilteredRelated] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/product/single/${id}`)
      .then(res => {
        setProduct(res.data.product);
        fetchRelated(res.data.product.category, res.data.product._id);
      })
      .catch(err => console.error(err));
  }, [id]);

  const fetchRelated = (category, productId) => {
    axios.get(`http://localhost:4000/api/product/all-products`)
      .then(res => {
        const relatedProducts = res.data.product.filter(
          p => p.category === category && p._id !== productId
        );
        setAllRelated(relatedProducts);
        setFilteredRelated(relatedProducts);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    const filtered = allRelated.filter(
      p => p.price >= minPrice && p.price <= maxPrice
    );
    setFilteredRelated(filtered);
  }, [minPrice, maxPrice, allRelated]);

  const handleCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.warning("Please login to add items to cart.");
      navigate('/login');
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/cart/add",
        {
          productId: product._id,
          quantity
        },
        {
          headers: { token }
        }
      );

      if (res.data.success) {
        toast.success("Item added to cart!");
      } else {
        toast.error(res.data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  if (!product) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="product-details-container">
        <div className="left-filter">
          <h3>Filter by Price</h3>
          <div className="slider-container">
            <label>Min: ₹{minPrice}</label>
            <input
              type="range"
              min="0"
              max="100000"
              step="100"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
            />
            <label>Max: ₹{maxPrice}</label>
            <input
              type="range"
              min="0"
              max="100000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="right-content">
          <div className="product-main">
            <div className="image-section">
              <img src={`http://localhost:4000/${product.image}`} alt={product.title} />
            </div>
            <div className="info-section">
              <h1>{product.title}</h1>
              <div className="rating-review">
                <span className="rating-badge">4.3 ★</span>
                <span className="rating-text">542 ratings & 112 reviews</span>
              </div>
              <p className="price">₹ {product.price}</p>
              <p className="description">{product.description}</p>
              <p className="stock">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>

              <div className="quantity-section">
                <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(prev => prev + 1)}>+</button>
              </div>

              <div className="actions">
                <button className="cart-btn" onClick={handleCart}>Add to Cart</button>
                <button className="buy-btn">Buy Now</button>
              </div>
            </div>
          </div>

          <div className="related-section">
            <h2>Related Products</h2>
            <div className="related-grid">
              {filteredRelated.map(r => (
                <div key={r._id} className="related-card" onClick={() => navigate(`/product/${r._id}`)}>
                  <img src={`http://localhost:4000/${r.image}`} alt={r.title} />
                  <h4>{r.title}</h4>
                  <p>₹ {r.price}</p>
                  <button>View</button>
                </div>
              ))}
              {filteredRelated.length === 0 && (
                <p>No related products in this price range</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
