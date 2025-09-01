const express = require('express');
const { adminAuth } = require('./middleware/adminauth');
const connectDB = require('./config/database');
const { validateSignupData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const auth = require('./routes/auth');


const app = express()
const port = 3000;
app.use(express.json());
app.use(cookieParser());

app.post('/api/auth/register', async (req, res) => {
  try {
    const User = require('./models/user');
    const { firstName, lastName, email, age, gender, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: passwordHash, age, gender });
    await user.save();

    res.status(201).send("Register successful");
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message || error);
  }

});
app.post('/api/auth/login', async (req, res) => {
  try {
    const User = require('./models/user');
    const { email, password } = req.body;
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "Invalid email or password" });
    }
    // 2. Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).send({ error: "Invalid email or password" });
    }
    // 3. Generate JWT token
    const token = await user.getJwt();
    // Optionally set token in HTTP-only cookie
    res.cookie('token', token, { expires: new Date(Date.now() + 8 * 3600000) });
    // 4. Convert user to plain object & remove sensitive fields
    const userObj = user.toObject();
    delete userObj.password;
    // 5. Send response
    res.status(200).send({ user: userObj, token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Login failed. Please try again later." });
  }
});
app.get("/api/user/profile", auth, async (req, res) => {
  try {
    // 1. Extract token from Authorization header or cookies
    const user = req.user;
    const userObj = user.toObject();
    delete userObj.password;
    res.status(200).send({ user: userObj });
  } catch (error) {
    console.error(error);
    res.status(401).send({ error: "Invalid token" });
  }

});

connectDB().then(() => {
  console.log('Database connected successfully');
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}).catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});
