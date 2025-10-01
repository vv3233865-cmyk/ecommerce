const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    totalPrice:{
        type: Number,
        required: true

    },

    address : {
        type : String,
        required : true
    },
    status: {
        type : String,
        default: 'pending',
        enum: ['pending', 'comfirmed' , 'shipping' , 'delivered' , 'cancelled']
    },

},{timestamps: true})

module.exports = mongoose.model('order',orderSchema)