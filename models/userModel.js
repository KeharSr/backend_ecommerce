const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },

    userName : {
        type : String,
        required : true
    },


    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    // for the admin
    isAdmin : {
        type : Boolean,
        default : false
    },
    cart : {
        type : Array,
        default : []
    }

})

const User = mongoose.model('user', userSchema)
module.exports = User;





