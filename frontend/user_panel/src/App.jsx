import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Login from './pages/auth/Login'
import Otp from './pages/auth/Otp'
import Home from './pages/user/Home'
import Register from './pages/auth/Register'
import Cart from './pages/user/Cart'
import PlaceOrder from './pages/user/PlaceOrder'
import OrderSuccess from './pages/user/OrderSuccess'
import Orders from './pages/user/Orders'
import ProductDetails from './pages/user/ProductDetails'
import SearchResults from './pages/user/SearchResults'
import Dashboard from './pages/admin/pages/Dashboard'
import ProductList from './pages/admin/pages/ProductList'
import AdminLayout from './components/AdminLayout';
import OrderList from './pages/admin/pages/OrderList'
import UserList from './pages/admin/pages/UserList'
import Myprofile from './pages/user/MyProfile'


const App = () => {
  return (
    <BrowserRouter>


      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register/otp' element={<Otp />} />
        <Route path='/' element={<Home />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/placeorder' element={<PlaceOrder />} />
        <Route path='/ordersSuccess' element={<OrderSuccess />} />
        <Route path='/orders' element={<Orders />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path='/search' element={<SearchResults />} />
        <Route path='/myprofile' element={<Myprofile />} />


        <Route path='/admin/dashboard' element={
          <AdminLayout><Dashboard /></AdminLayout>
        } />
        <Route path='/admin/products' element={
          <AdminLayout><ProductList /></AdminLayout>
        } />

        <Route path='/admin/orders' element={
          <AdminLayout><OrderList /></AdminLayout>
        } />

        <Route path='/admin/users' element={
          <AdminLayout><UserList /></AdminLayout>
        } />


      </Routes>


    </BrowserRouter>



  )
}

export default App
