const express = require('express');
const auth = require('../middleware/adminauth');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const mongoose = require('mongoose');

// send Connection Request
requestRouter.post('/api/request/send/:status/:toUserId', auth, async (req, res) => {
  try {//status can be ignored or interested (OR pending)
    const user = req.user;
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const allowedStatus = ['ignored', 'interested'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status type: ' + status });
    }
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
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
    newRequest.status = status;
    await newRequest.save();
    res.status(200).send(user.firstName + " responded to connection request to " + toUserId + " with status: " + status);
  } catch (error) {
    res.status(500).send("ERROR  "+error.message || error);
  }
});
requestRouter.post('/api/request/review/:status/:requestId', auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params; // ✅ use object destructuring for clarity

    // ✅ Validate status
    const allowedStatus = ["accepted", "rejected"];
    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({ message: `Invalid status type: ${status}` });
    }

    // ✅ Validate requestId format (must be ObjectId)
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: "Invalid requestId format" });
    }

    // ✅ Check if connection request exists & is still 'interested' (OR pending)
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested"
    });

    if (!connectionRequest) {
      return res.status(404).json({
        message: "Connection request not found or already reviewed"
      });
    }

    // ✅ Update status
    connectionRequest.status = status;
    await connectionRequest.save();

    return res.status(200).json({
      message: `Connection request ${status} successfully`,
      data: connectionRequest
    });

  } catch (error) {
    console.error("ERROR updating connection request: ", error);
    return res.status(500).json({
      message: "Server error while handling connection request",
      error: error.message
    });
  }
});


module.exports = requestRouter;

