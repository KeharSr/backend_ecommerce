const { response } = require("express");

const userModel = require('../models/userModel');
const { checkout } = require("../routes/userRoutes");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



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
            return res.status(400).json({
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





module.exports = {
    createUser,
    loginUser,
    getCurrentUser,
    getToken
}
