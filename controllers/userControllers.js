const { response } = require("express");

const userModel = require('../models/userModel');
const { checkout } = require("../routes/userRoutes");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendOtp = require("../service/sentOtp");



const createUser = async (req, res) => {

    
    console.log(req.body);

    
    const { firstName, lastName,userName, email, phoneNumber, password } = req.body;


    
    if (!firstName || !lastName ||!userName || !email || !phoneNumber || !password) {
       
        return res.status().json({
            sucess: false,
            message: 'Plz enter all details!'
        })

    }



   
    try {
        
        const existingUser = await userModel.findOne({ email: email })

        
        if (existingUser) {
            return res.json({
                sucess: false,
                message: 'User Already Exist!'
            })
        }
       
        const randomSalt = await bcrypt.genSalt(10)
        const hasedPassword = await bcrypt.hash(password, randomSalt)


        
        const newUser = new userModel({
            
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            email: email,
            phoneNumber:phoneNumber,
            password: hasedPassword
        })

        
        await newUser.save()

        
        res.json({
            sucess: true,
            message: 'User Created Sucesfully'
        })


        


    } catch (error) {
        console.log(error)
        res.json({
            sucess: false,
            message: 'Internal Server Error!'
        })

    }




}



const loginUser = async (req, res) => {
   

    console.log(req.body)
    
    const { email, password } = req.body;

   
    if (!email  || !password ) {
        return res.json({
            sucess: false,
            message: 'Please enter all the fields'
        })
    }


    try {
        
        const user = await userModel.findOne({ email: email });
        
        if(!user){
            return res.json({
                sucess: false,
                message: 'Email Doesnt Exist !'
            })

        }
       
        const isValidPassword = await bcrypt.compare(password,user.password)
        

        if (!isValidPassword){
            return res.json({
                sucess: false,
                message: 'Password Doesnt Matched !'
            })

        }
        
        const token = await jwt.sign(
            {
                id : user._id, isAdmin : user.isAdmin},
                process.env.JWT_SECRET

        )

        
        res.json({
            sucess: true,
            message: 'User Logined Sucessfully !',
            token : token,
            userData : user
        })
        


    } catch (error) {
        console.log(error)
        return res.json({
            sucess: false,
            message: 'Internal Server Error'
        })
    }
}

const getCurrentUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password'); // Do not return the password

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found!'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User found!',
            user: user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const getToken = async (req, res) => {
    try {
      console.log(req.body);
      const { id } = req.body;
   
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'User not found',
        });
      }
   
      const token = await jwt.sign(
            {
                id : user._id, isAdmin : user.isAdmin},
                process.env.JWT_SECRET
      );
   
      return res.status(200).json({
        success: true,
        message: 'Token generated successfully!',
        token: token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error,
      });
    }
  };

  const forgotPassword = async (req, res) => {
    const { phoneNumber} = req.body;
  
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Please enter your phone number",
      });
    }
    try{
  
      // finding user by phone number
      const user = await userModel.findOne({ phoneNumber: phoneNumber });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }
  
      // Generate OTP random 6 digit number
      const otp = Math.floor(100000 + Math.random() * 900000);
      // generate expiry time for OTP
      const expiry = Date.now() + 10 * 60 * 1000;
      // save to database for verification
      user.resetPasswordOTP = otp;
      user.resetPasswordExpires = expiry;
      await user.save();
      // set expiry time for OTP
  
      // send OTP to registered phone number
      const isSent = await sendOtp(phoneNumber, otp)
      if(isSent){
        return res.status(400).json({
          sucess : false,
          message : 'Error sending OTP'
        })
      }
  
      //If sucess
      res.status(200).json({
        sucess : true,
        message : "OTP send sucesfully"
  
      })
      
  
  
  
    }catch(error){
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  const verifyOtpAndResetPassword = async (req, res) => {
    const { phoneNumber, otp, newPassword } = req.body;
    if (!phoneNumber || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }
    try{
      const user = await userModel.findOne({phoneNumber: phoneNumber});
  
      //Verify OTP
      if(user.resetPasswordOTP != otp){
        return res.status(400).json({
          success: false,
          message: "Invalid OTP"
        })
      }
  
      //Check if OTP is expired
      if(user.resetPasswordExpires < Date.now()){
        return res.status(400).json({
          success: false,
          message: "OTP expired"
        })
      }
  
      //Hash the password
      const randomSalt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, randomSalt);
  
      //update to database
      user.password = hashedPassword;
      await user.save();
  
      //Send response
      res.status(200).json({
        success: true,
        message: "Password reset successfully"
      })
  
    }catch(error){
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
    }  





module.exports = {
    createUser,
    loginUser,
    getCurrentUser,
    getToken,
    forgotPassword,
    verifyOtpAndResetPassword

}
