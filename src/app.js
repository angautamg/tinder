const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express()
const port = 3000;
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// Connect to the database and start the server



connectDB().then(() => {
  console.log('Database connected successfully');
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}).catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});
