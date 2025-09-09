const express = require('express');
const auth = require('../middleware/adminauth');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');

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
requestRouter.post('/api/request/send/:status/:toUserId',auth, async (req, res) => {
  try {//status can be ignored or interested
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const allowedStatus = ['ignored', 'interested'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status type: '+status });
    }
    const existingRequest = await ConnectionRequest.findOne({
      $or:[{ fromUserId, toUserId },
        { fromUserId:toUserId, toUserId:fromUserId }
      ]
  });
    if (existingRequest) {
      return res.status(400).json({ message: 'Connection request already exists' });
    }



    const newRequest = new ConnectionRequest({
      fromUserId: fromUserId,
      toUserId: toUserId,
      status: 'interested'
    });
    await newRequest.save();
    res.status(200).send("Connection request sent successfully");
  
    // Handle the request logic here
    res.status(200).send(user.firstName+ "responded to connection request  ");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error responding to connection request");
  }
});


module.exports = requestRouter;

