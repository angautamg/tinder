const express = require('express');
const profileRouter = express.Router();
const auth = require('../middleware/adminauth');
const { validateEditProfileData } = require('../utils/validation');
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

profileRouter.patch("/api/user/editprofile", auth, async (req, res) => {
  try {
    const isEditAllow = validateEditProfileData(req);
    if (!isEditAllow) {
      return res.status(400).send({ error: "Invalid updates!" });
    }
    const user = req.user;
    const updates = Object.keys(req.body);
    updates.forEach((update) => user[update] = req.body[update]);
    await user.save();
    const userObj = user.toObject();
    delete userObj.password;
    res.status(200).send({ user: userObj });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating profile");
  }
});
module.exports = profileRouter;