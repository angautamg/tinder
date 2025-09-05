const express = require('express');
const connectDB = require('./config/database');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const app = express()
const port = 3000;
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
//const requestRouter = require('./routes/request');
app.use("/", authRouter);
app.use("/", profileRouter);
//app.use("/", requestRouter);



connectDB().then(() => {
  console.log('Database connected successfully');
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}).catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});
