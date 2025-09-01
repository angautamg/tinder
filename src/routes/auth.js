const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send({ error: "Invalid token format" });
    }
    //const decoded = jwt.verify(token, "process.env.JWT_SECRET");
     const decoded = await jwt.verify(token, "Dev@Tinder");
     if (!decoded) {
       return res.status(401).send({ error: "Invalid token" });
     }
     const user = require('../models/user');
     const existingUser = await user.findById(decoded._id);
     if (!existingUser) {
       return res.status(401).send({ error: "User not found" });
     }
     req.user = existingUser;
    next();
  } catch (err) {
    res.status(401).send({ error: "Invalid token found" });
  }
};

module.exports = auth;
