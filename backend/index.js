require('dotenv').config();
const express = require("express");
const connectDB = require('./database/db');
const userRoutes = require('./routes/User');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/Order');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);

// Static files
app.use("/uploads", express.static("uploads"));

// Test route
app.get("/", (req, res) => {
    res.send("Server is running");
});

// Connect to MongoDB and start server
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
    });
}).catch(err => {
    console.error("❌ Failed to connect to MongoDB. Server not started.", err);
});
