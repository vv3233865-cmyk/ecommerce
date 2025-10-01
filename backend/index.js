require('dotenv').config();
const express = require("express")
const dotenv = require('dotenv')
const connectdb = require('./database/db')
const userroutes = require('./routes/User')
const cors = require('cors')
const product = require('./routes/product')
const Cart = require('./routes/cart')
const order = require('./routes/Order')




const app = express()
dotenv.config();
app.use(cors())
app.use(express.json())
const port = process.env.PORT;

app.use("/api/",userroutes)
app.use('/api',product)
app.use("/api",Cart)
app.use('/api',order)

// static files

app.use("/uploads" , express.static("uploads"))


 

app.get("/",(req,res) => {
    res.send("server is running")
})

app.listen(port,() => {
    console.log(`server is running in port ${port}`)
    connectdb()
})