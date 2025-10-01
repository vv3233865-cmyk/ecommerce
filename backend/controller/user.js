
const bcrypt = require('bcrypt');

const smail = require('../middleware/sendmail')


const jwt = require('jsonwebtoken');
const User = require("../model/User");

exports.registeruser = async (req, res) => {
    try {
        console.log(req.body)
        const { name, email, password, contact,role } = req.body;

        let user = await User.findOne({ email });


        if (user) {
            return res.status(400).json({
                message: "user email already exits"
            })
        }

        const hashpassword = await bcrypt.hash(password, 10)

        user = await User({
            name,
            email,
            password: hashpassword, // Use the hashed password
            contact,
            role
        });

        const otp = Math.floor(Math.random() * 1000000)

        // create signed activation token

        const activationToken = jwt.sign({ user, otp }, process.env.ACTIVATION_SECRET, {
            expiresIn: "50m"
        })




        // send mail to use
        const message = `please verify your account using otp your otp is ${otp}`
        await smail(email, "welcome to vishwa", message)

        res.status(200).json({
            message: "otp send to your mail",
            activationToken
        })

    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}

exports.verifyuser = async (req, res) => {
    try {
        const { otp, activationToken } = req.body;
        const verify = jwt.verify(activationToken, process.env.ACTIVATION_SECRET)
        if (!verify) {
            return res.json({
                message: "otp expired"
            })
        }
        if (verify.otp !== parseInt(otp)) {
            return res.json({
                message: "wrong otp"
            })

        }

        await User.create({
            name: verify.user.name,
            email: verify.user.email,
            password: verify.user.password,
            contact: verify.user.contact,
            role:verify.user.role
        })

        res.status(200).json({
            success: true ,
            message: "User successfully registered",
        });

    } catch (error) {
        res.status(500).json({
            success : false,
            message: error.message,
        })
    }
}


exports.loginuser = async(req,res) => {
    try {
        const {email,password} = req.body
        // check user email address

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success : false,
                message:"invalid email"
            })
        }

        // check user password
        const matchpassword = await bcrypt.compare(password,user.password)

        if(!matchpassword){
            return res.status(400).json({
                success : false,
                message:"invalid password"
            })
        }

        // generate signed token

        const token = jwt.sign({_id : user.id},process.env.JWT_SECRET, {expiresIn: "15d"})

        const { password: userpassword, ...userdetail} = user.toObject()

        return res.status(200).json({
            success: true,
            message:"welcome " + user.name,
            token,
            userdetail,
            
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            
        })
    }
}

// getAllUser

exports.getAllUsers = async(req,res) => {

    try {
        
        const users = await User.find().select('-password')

        return res.status(200).json({
            success: true,
            users
        })
    } catch (error) {

        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}


 // user profile

 exports.myprofile = async(req,res) => {
    try {
        const user = await User.findById(req.user._id).select('-password')
        return res.status(200).json({
            user,
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        })
    }
}

// edit profile

exports.editProfile = async (req, res) => {
    try {
      const { name, contact, email } = req.body;
  
      // Find the user
      const user = await User.findById(req.user._id);
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      // Update fields if provided
      if (name) user.name = name;
      if (contact) user.contact = contact;
      if (email) user.email = email;
  
      await user.save();
  
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

