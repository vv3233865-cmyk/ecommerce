const express = require('express')
const {isauth} = require('../middleware/isauth')
const { createorder, getUserOrder, getAllProduct, updateOrderStatus } = require('../controller/order')


const router = express.Router()


router.post("/order/create",isauth,createorder)
router.get('/user/order',isauth,getUserOrder)
router.get('/admin/order',isauth,getAllProduct)
router.put('/orderStatus/update/:id', isauth,updateOrderStatus)

module.exports = router