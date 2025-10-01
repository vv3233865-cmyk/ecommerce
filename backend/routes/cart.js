const express = require('express')
const { isauth } = require('../middleware/isauth')
const { addToCart, getCart, updateCart, removeCart, clearCart } = require('../controller/cart')


const router = express.Router()

router.post("/cart/add",isauth,addToCart)
router.get("/cart", isauth , getCart)
router.put("/cart/update/:productId",isauth,updateCart)
router.delete('/cart/remove/:productId', isauth ,removeCart)
router.delete('/cart/clear', isauth ,clearCart)

module.exports = router