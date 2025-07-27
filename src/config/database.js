const mongoose = require('mongoose');
const connectDB =async ()=>
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true, 
    });

    module.exports = connectDB;