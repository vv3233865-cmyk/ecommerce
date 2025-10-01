const cart = require('../model/cart');
const Cart = require('../model/cart')

const Product = require('../model/Product');
const { create } = require('../model/User');


// add to cart

exports.addToCart = async (req, res) => {
    try {
        const userId = req.user._id
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                message: "product not found"
            })
        }

        let cart = await Cart.findOne({ user: userId })

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [{ productId, quantity }]
            })
        } else {
            const itemindex = cart.items.findIndex(item => item.productId.toString() === productId)
            if (itemindex > -1) {
                cart.items[itemindex].quantity += quantity
            } else {
                cart.items.push({ productId, quantity })
            }
            await cart.save()
        }


        return res.status(200).json({
            success: true,
            cart 
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

// getcart

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.productId')
        if (!cart) {
            return res.status(200).json({
              success: true,
              cart: {
                items: []
              }
            });
          }
          
        return res.json({ success: true, cart })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}


// update the cart

exports.updateCart = async (req, res) => {
    const {quantity} = req.body

    try {
        const cart = await Cart.findOne({ user: req.user._id })
        if(!cart){
            return res.status(404).json({
                message : "cart not found"
            })
        }

        const item = cart.items.find(item => item.productId.toString() === req.params.productId)
        if(!item){
            return res.status(404).json({
                message : "item not found"
            })
        }

        console.log(item);
        

        item.quantity = quantity

        await cart.save()


        const updateCart = await Cart.findOne({user : req.user._id}).populate('items.productId')

        return res.status(200).json({
            message: " updated succesfully",
            cart : updateCart
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

// remove cart

exports.removeCart = async(req,res) => {
    try {

        const cart = await Cart.findOne({user : req.user._id})
        if(!cart){
            return res.status(404).json({
                message : "cart not found"
            })
        }
        
        cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId)

        await cart.save()


        const removecart = await Cart.findOne({user : req.user._id}).populate('items.productId')

        return res.status(200).json({
            message: "cart removed successfully",
            cart : removecart
        })

    } catch (error) {
        return res.status(500).json({
            message: error,message
        })
    }
}

// cart clear

exports.clearCart = async(req,res) => {
    try {
        
        await Cart.findOneAndUpdate({user : req.user._id} , {items: []})
        return res.status(200).json({
            message : "cart was successfully cleared",
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message
        })
    }
}