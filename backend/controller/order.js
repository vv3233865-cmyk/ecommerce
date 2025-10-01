const Order = require('../model/Order');
const order = require('../model/Order');
const User = require('../model/User');
const Cart = require('../model/cart')


//create order 

exports.createorder = async (req, res) => {

    try {

        const userid = req.user._id;
        const {address} = req.body

        const cart = await Cart.findOne({ user: userid }).populate('items.productId')
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "cart was empty"
            })
        }

        const orderItems = cart.items.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity
        }))

        const totalPrice = cart.items.reduce(
            (total, item) => total + item.productId.price * item.quantity, 0
        )

        const newOrder = await order.create({
            user: userid,
            items: orderItems,
            totalPrice,
            address
        })

        return res.status(200).json({
            message: "order placed successfully",
            order: newOrder
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }

}

// get login user orders
exports.getUserOrder = async (req, res) => {

    try {

        const order = await Order.find({ user: req.user._id }).populate('items.productId')
        return res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}


// get all order

exports.getAllProduct = async (req, res) => {

    try {

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: "unauthorized access"
            })
        }

        const order = await Order.find().populate('user').populate('items.productId')
        return res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}


// update order statuse

exports.updateOrderStatus = async(req,res) => {
    
    try {
        
        if(req.user.role !== "admin"){
            return res.status(403).json({
                message : "unathorized access"
            })
        }

        const order = await Order.findById(req.params.id)
        if(!order){
            return res.status(403).json({
                message: "order not found"
            })
        }
        const {status} = req.body
        const validStatus = ['pending' , 'comfirmed' , 'shipping' , 'delivered' , 'cancelled']

        if(!validStatus.includes(status)){
            return res.status(403).json({
                message : "invalid status value"
            })
        }

        order.status = status
       await order.save()

       return res.status(200).json({
        message : "order status updated",order
       })
    } catch (error) {
        return res.status(500).json({
            message : error.message
        })
    }
}