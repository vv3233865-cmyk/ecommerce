import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/AdminProductPage.css';

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    stock: ''
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/product/all-products");
      setProducts(res.data.product);
    } catch (err) {
      console.error("Failed to fetch products:", err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('title', formData.title);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('stock', formData.stock);
    if (image) data.append('image', image);

    try {
      if (editMode) {
        // Update product
        await axios.put(
          `http://localhost:4000/api/product/update/${editId}`,
          data,
          { headers: { token, 'Content-Type': 'multipart/form-data' } }
        );
        alert('Product updated successfully!');
      } else {
        // Create product
        await axios.post(
          'http://localhost:4000/api/product/new',
          data,
          { headers: { token, 'Content-Type': 'multipart/form-data' } }
        );
        alert('Product created successfully!');
      }

      setShowForm(false);
      setEditMode(false);
      setEditId(null);
      setFormData({ title: '', price: '', category: '', description: '', stock: '' });
      setImage(null);
      fetchProducts();

    } catch (err) {
      console.error('Error saving product:', err.message);
      alert('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:4000/api/product/delete/${id}`, {
        headers: { token }
      });
      alert("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err.message);
      alert("Failed to delete product");
    }
  };

  const handleEdit = (prod) => {
    setEditMode(true);
    setEditId(prod._id);
    setFormData({
      title: prod.title,
      price: prod.price,
      category: prod.category,
      description: prod.description,
      stock: prod.stock
    });
    setImage(null);
    setShowForm(true);
  };

  return (
    <div className="admin-product-page">
      <div className="header">
        <h1>Product Management</h1>
        <button onClick={() => {
          setShowForm(true);
          setEditMode(false);
          setFormData({ title: '', price: '', category: '', description: '', stock: '' });
          setImage(null);
        }}>
          + Create Product
        </button>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((prod, index) => (
              <tr key={prod._id}>
                <td>{index + 1}</td>
                <td>{prod.title}</td>
                <td>{prod.price}</td>
                <td>{prod.category}</td>
                <td>{prod.stock}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(prod)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(prod._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No products found</td>
            </tr>
          )}
        </tbody>
      </table>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editMode ? 'Edit Product' : 'Create Product'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="title" placeholder="Product Name" value={formData.title} onChange={handleChange} required />
              <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
              <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required></textarea>
              <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
              <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
              <div className="form-actions">
                <button type="submit">{editMode ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductPage;
