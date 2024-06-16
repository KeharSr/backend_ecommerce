// import jwt
const jwt = require('jsonwebtoken');
const authGuard= (req, res, next) => {
    //check incoming data
    console.log(req.headers); // passed going to next


    // get authorization data fromheader
    const authHeader = req.headers.authorization;

    // check or validate
    if (!authHeader) {
        return res.status(400).json({
            success: false,
            message: "Auth header not found"
        })
    }


    // Split the data(Format: Bearer token)
    const token = authHeader.split(' ')[1];


    // if token not found : stop the process (res)
    if (!token || token ==="") {
        return res.status(400).json({
            success: false,
            message: "Token not found"
        })
    }

    // verify
    try{
        const decodeUserData= jwt.verify(token, process.env.JWT_SECRET);
        req.user= decodeUserData;
        next();

    }catch(error){
        res.status(500).json({
            sucess: false,
            message: "Not Authorized",
        })
    }
    // if verified : next (function is controller)



    // not verified : not auth
}

// Admin guard
const adminGuard= (req, res, next) => {
    //check incoming data
    console.log(req.headers);
   // passed going to next


    // get authorization data fromheader
    const authHeader = req.headers.authorization;

    // check or validate
    if (!authHeader) {
        return res.status(400).json({
            success: false,
            message: "Auth header not found"
        })
    }


    // Split the data(Format: Bearer token)
    const token = authHeader.split(' ')[1];


    // if token not found : stop the process (res)
    if (!token || token ==="") {
        return res.status(400).json({
            success: false,
            message: "Token not found"
        })
    }

    // verify
    try{
        const decodeUserData= jwt.verify(token, process.env.JWT_SECRET);
        req.user= decodeUserData; //id, isAdmin
        if(!req.user.isAdmin){
            return res.status(400).json({
                success: false,
                message: "Prabesh Nised!", //Permission Denied
            })
        }
        next();

    }catch(error){
        res.status(500).json({
            sucess: false,
            message: "Not Authorized",
        })
    }
    // if verified : next (function is controller)



    // not verified : not auth
}

module.exports = {
    authGuard,
    adminGuard

}