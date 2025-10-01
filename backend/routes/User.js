const express = require('express')
const { registeruser, verifyuser, loginuser, myprofile, getAllUsers, editProfile } = require('../controller/user')
const { isauth } = require('../middleware/isauth')

const router = express.Router()

router.post("/user/register",registeruser )
router.post("/user/verify",verifyuser)
router.post("/user/login",loginuser)
router.get('/user/profile',isauth,myprofile)
router.put("/user/editprofile",isauth,editProfile)
router.get('/all-users',isauth,async(req,res,next) => {

    if(req.user.role !== 'admin'){
        return res.status(403).json({
            success: false,
            message: "Access denied: Admins only"
        })
    }
    next()
}, getAllUsers)

module.exports = router