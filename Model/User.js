const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender:{
      type:String,
      required:true
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: String, 
        required: true
    },
    curr_semester: {
        type: Number,
        required: true
    },
    otpToken: {
        type: String
    },
    otpExpire: {
        type: Date 
    },
    resetPwdToken: {
        type: String,
        default: null
    },
    resetPwdExpire: {
        type: Date,
        default: null
    },
    verified: {
        type: Boolean,
        default: false // Field to mark if email is verified
    }
});

const userModel = mongoose.model("UsersLogins", userSchema);
module.exports = userModel;
