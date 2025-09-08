const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
    },
    age: {
        type: Number,
        min: [0, "Age cannot be negative"],
        max: [120, "Age seems unrealistic"],
    },
    gender: {
        type: String,
        required: [true, "Gender is required"], // field must be present
        enum: {
            values: ["Male", "Female", "Other"],  // allowed values
            message: "{VALUE} is not a valid gender", // custom error
        },
        trim: true, // remove extra spaces
    },
    about: {
        type: String,
        trim: true,
    },
    interests: {
        type: [String],
        default: ['Traveling', 'Reading books'],
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]    
            default: [0, 0]
        }
    },

}, { timestamps: true });

userSchema.methods.getJwt=async function() {
const user=this;
const token= await jwt.sign({_id:user._id.toString()},"Dev@Tinder",{expiresIn:"1h"});
return token;
};
userSchema.methods.validatePassword =async function(passwordByUser) {
    const user = this;
    const passwordHash = user.password;
    return await bcrypt.compare(passwordByUser, passwordHash);
};
module.exports = mongoose.model('User', userSchema);