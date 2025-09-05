const express = require('express');
const profileRouter = express.Router();
const auth = require('../middleware/adminauth');

profileRouter.get("/api/user/profile", auth, async (req, res) => {
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
module.exports = profileRouter;