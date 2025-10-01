import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [anchorElMore, setAnchorElMore] = useState(null);
  const [searchText, setSearchText] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleProfileMenuOpen = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleMoreMenuOpen = (event) => {
    setAnchorElMore(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElProfile(null);
    setAnchorElMore(null);
  };

  const handleMenuOrder = () => {
    handleMenuClose();
    navigate('/orders');
  };
  const handleMenuProfile = () => {
    handleMenuClose();
    navigate('/myprofile');
  };

  const handleLogin = () => {
    navigate('/login');
    handleMenuClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    handleMenuClose();
    navigate('/login');
  };

  const handleCart = () => {
    navigate('/cart');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchText.trim() !== '') {
        navigate(`/search?query=${encodeURIComponent(searchText.trim())}`);
      }
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          dreamcart
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* Search Bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: '0 8px',
            borderRadius: 1,
            width: '300px',
          }}
        >
          <SearchIcon
            sx={{ color: 'gray', cursor: 'pointer' }}
            onClick={handleSearch}
          />
          <InputBase
            placeholder="Search…"
            sx={{ ml: 1, flex: 1 }}
            inputProps={{ 'aria-label': 'search' }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleSearch}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton size="large" color="inherit" onClick={handleCart}>
          <Badge badgeContent={4} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        {isLoggedIn ? (
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleProfileMenuOpen}
          >
            <Avatar alt="User Avatar" src="/static/images/avatar/1.jpg" />
          </IconButton>
        ) : (
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleLogin}
          >
            <AccountCircle />
            <Typography sx={{ ml: 1 }}>login</Typography>
          </IconButton>
        )}

        <IconButton
          size="large"
          edge="end"
          color="inherit"
          onClick={handleMoreMenuOpen}
        >
          <MoreVertIcon />
        </IconButton>
      </Toolbar>

      <Menu
        anchorEl={anchorElProfile}
        open={Boolean(anchorElProfile)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={ handleMenuProfile}>My Profile</MenuItem>
        <MenuItem onClick={handleMenuOrder}>Orders</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      <Menu
        anchorEl={anchorElMore}
        open={Boolean(anchorElMore)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
        <MenuItem onClick={handleMenuClose}>Help</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
