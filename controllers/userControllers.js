const { response } = require("express");

const userModel = require('../models/userModel');
const { checkout } = require("../routes/userRoutes");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const createUser = async (req, res) => {

    
    console.log(req.body);

    
    const { firstName, lastName,userName, email, password } = req.body;


    
    if (!firstName || !lastName ||!userName || !email || !password) {
       
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
                id : user._id   },
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


module.exports = {
    createUser,
    loginUser
}




