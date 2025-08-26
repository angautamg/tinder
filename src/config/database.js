const mongoose = require('mongoose');
const connectDB = async () => {
    //await mongoose.connect(process.env.MONGO_URI, {
    await mongoose.connect("", {
        useNewUrlParser: true,
      useUnifiedTopology: true,
    });
}
module.exports = connectDB;