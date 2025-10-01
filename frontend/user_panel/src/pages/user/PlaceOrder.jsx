import React, { useState } from 'react';
import axios from 'axios';
import './placeorder.css';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
    const navigate = useNavigate()
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // default: Cash on Delivery

  const handlePlaceOrder = async () => {
    if (!name || !mobile || !pincode || !address || !paymentMethod) {
      alert('Please fill all fields');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const cartRes = await axios.get('http://localhost:4000/api/cart', {
        headers: { token }
      });

      const cart = cartRes.data.cart;

      const items = cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      }));

      const totalPrice = cart.items.reduce(
        (total, item) => total + item.productId.price * item.quantity,
        0
      );

      const fulladdress = `${name}, ${mobile}, ${pincode}, ${address}`;

      const orderRes = await axios.post(
        'http://localhost:4000/api/order/create',
        { items, totalPrice, address : fulladdress},
        { headers: { token } }

      );

       await axios.delete("http://localhost:4000/api/cart/clear",{
        headers : {token}
      })

      console.log("order data", items,totalPrice,address);
      
      navigate('/ordersSuccess') 
     
    } catch (err) {
      console.error(err);
      alert('Failed to place order');
    }
  };

  return (
    <div className="placeorder_main">
      <h2>🛒 Confirm Your Order</h2>

      <div className="form_section">
        <h3>🏠 Shipping Address</h3>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Mobile Number" value={mobile} onChange={e => setMobile(e.target.value)} />
        <input placeholder="Pincode" value={pincode} onChange={e => setPincode(e.target.value)} />
        <textarea placeholder="Address" rows={4} value={address} onChange={e => setAddress(e.target.value)} />
      </div>



      <button className="placeorder_btn" onClick={handlePlaceOrder}>PLACE ORDER</button>
    </div>
  );
};

export default PlaceOrder; 