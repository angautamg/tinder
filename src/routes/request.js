const express = require('express');
const auth = require('../middleware/adminauth');
const requestRouter = express.Router();

requestRouter.post('/api/request/sendconnectionrequest',auth, async (req, res) => {
  try {
    const user = req.user;
    // Handle the request logic here
    res.status(200).send(user.firstName+ "sent connection request  ");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending connection request");
  }
});

module.exports = requestRouter;

