const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    title:{
        type:String,
        required : true
    },
    description:{
        type:String,
        required : true
    },
    stock:{
        type: Number,
        required : true
    },
    category:{
        type:String,
        required : true
    },
    price:{
        type: Number,
        required : true
    },
    image:{
        type:String,
        required : true
    },
    sales:{
        type: Number,
        default : 0
    },
    role:{
        type: String
    }

},{timestamps:true})

const product = mongoose.model('product',schema)

module.exports = product