const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { validateSignupData } = require('../utils/validation');

authRouter.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, age, gender, password } = req.body;

    const { isValid, errors } = validateSignupData(req);
    if (!isValid) {
      return res.status(400).send({ errors });
    }
     const User = require('../models/user');
         const existingUser = await User.findOne({ email: email });
         if (existingUser) {
           return res.status(401).send({ error: "Email already exist" });
         }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, email, password: passwordHash, age, gender });
    await newUser.save();

    res.status(201).send("Register successful");
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message || error);
  }

});
authRouter.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "Invalid email or password" });
    }
    // 2. Compare password
    const isPasswordMatch = await user.validatePassword(password);
    if (isPasswordMatch) {
      const token = await user.getJwt();
    // Optionally set token in HTTP-only cookie
    res.cookie('token', token, { expires: new Date(Date.now() + 8 * 3600000) });
    // 4. Convert user to plain object & remove sensitive fields
    const userObj = user.toObject();
    delete userObj.password;
    // 5. Send response
    res.status(200).send({ user: userObj, token });
    }
    else {
      res.status(400).send({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).send("ERROR" + error.message || error);
  }
});
authRouter.post('/api/auth/logout', (req, res) => {
  res.cookie('token', null, { expires: new Date(0) });
  res.status(200).send("Logout successful");
});

module.exports = authRouter;