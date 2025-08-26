const mongoose = require('mongoose');

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

}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);