const express = require('express')
const {isauth} = require('../middleware/isauth')
const { createproduct, fetchAllProduct, fetchSingleProduct, deleteProduct, updateProduct } = require('../controller/product')
const uploadfile = require('../middleware/multer')

const router = express.Router()

router.post("/product/new", isauth,uploadfile,createproduct)
router.get("/product/all-products", fetchAllProduct)
router.get("/product/single/:id", fetchSingleProduct)
router.delete("/product/delete/:id",isauth,deleteProduct)
router.put("/product/update/:id",isauth, uploadfile,updateProduct)

module.exports = router
