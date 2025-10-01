import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchResults.css';
import Header from '../../components/Header'

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]); // Default min-max

  useEffect(() => {
    if (query) {
      axios.get('http://localhost:4000/api/product/all-products')
        .then(res => {
          setProducts(res.data.product);
          filterProducts(res.data.product, query, priceRange);
        })
        .catch(err => console.error(err));
    }
  }, [query]);

  useEffect(() => {
    filterProducts(products, query, priceRange);
  }, [priceRange]);

  const filterProducts = (allProducts, searchTerm, range) => {
    const result = allProducts.filter(p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      p.price >= range[0] && p.price <= range[1]
    );
    setFiltered(result);
  };

  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    setPriceRange([0, value]);
  };

  return (
    <div>
      <Header />
    <div className="search-page">
      <div className="sidebar">
        <h3>Filter by Price</h3>
        <input
          type="range"
          min="0"
          max="100000"
          step="1000"
          value={priceRange[1]}
          onChange={handlePriceChange}
        />
        <p>Up to ₹ {priceRange[1]}</p>
      </div>

      <div className="results">
        <h2>Search Results for "{query}"</h2>

        {filtered.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="product-grid">
            {filtered.map(p => (
              <div key={p._id} className="product-card" onClick={() => navigate(`/product/${p._id}`)}>
                <img src={`http://localhost:4000/${p.image}`} alt={p.title} />
                <h4>{p.title}</h4>
                <p>₹ {p.price}</p>
                <button>View</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default SearchResults;
