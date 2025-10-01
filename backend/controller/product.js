const product = require('../model/Product')
const Product = require('../model/Product')
const fs = require('fs')
const { findById } = require('../model/User')



// add new product

exports.createproduct = async (req, res) => {
    try {
      console.log("REQ BODY:", req.body);
      console.log("REQ FILE:", req.file);
  
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized access" });
      }
  
      const { title, description, category, price, stock } = req.body;
      const image = req.file;
  
      if (!title || !description || !category || !price || !image) {
        return res.status(400).json({ message: "All fields including image are required" });
      }
  
      const product = await Product.create({
        title,
        description,
        category,
        price,
        stock,
        image: image.path
      });
  
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        product
      });
    } catch (err) {
      console.error("Server error:", err);
      res.status(500).json({ message: err.message });
    }
  };
  

// fetch all product

exports.fetchAllProduct = async(req,res) => {
    try {
        const product = await Product.find()
        return res.status(200).json({
            message : "list of product",product,
            success : true
        })
    } catch (error) {

        res.status(500).json({
            success : false ,
            message : error.message
     })
        
    }
}

exports.fetchSingleProduct = async(req,res) => {


    try {
        const id = req.params.id
        const product = await Product.findById(id)
        return res.status(200).json({
            message:"product detail",product,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success : false
        })
    }
   
}


exports.deleteProduct = async(req,res) => {
    try {
        
        if(req.user.role != "admin"){
            return res.status(403).json({
                message : 'unauthorized user'
            })
        }

        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status(403).json({
                message : "invalid product details"
            })
        }

        fs.rm(product.image , () => {
            console.log("image deleted")
        })


        await product.deleteOne()
        return res.json({
            message : "product details deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message
        })
    }
}


// edit products

exports.updateProduct = async(req,res) => {
    try {
        
        if(req.user.role !== "admin"){
            return res.status(404).json({
                message: "unauthorized user"
            })
        }

        const {title,description,category,price,stock} = req.body;
        const productId = req.params.id;
        const newImage = req.file;
        
        const product = await Product.findById(productId)
        if(!product){
            return res.status(404).json({
                message:"product not found"
            })
        }

        // delete old image

        fs.rm(product.image ,{force : true} ,(err) => {
            if(err) console.log("failed to delete old image",err)
                else console.log("old image deleted");
                
        })

        // update product fields

        product.title = title || product.title
        product.description = description ||  product.description
        product.category = category || product.category 
        product.price = price || product.price
        product.stock = stock || product.stock

        if(newImage){
            product.image = newImage.path
        }

        await product.save();

        return res.status(200).json({
            message : "product update successfully",
            product
        })
    } catch (error) {

        return res.status(500).json({
            message : error.message
        })
        
    }
}
