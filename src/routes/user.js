const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/adminauth');
const userRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');

userRouter.get('/api/user/requests/received', auth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({ toUserId: loggedInUser._id, status: 'interested' })
            .populate('fromUserId', 'firstName lastName ') // Populate only firstName and lastName
            .exec();

        res.json({message: "Received requests fetched successfully", data: connectionRequests});
    } catch (error) {
        res.statusCode(500).send("ERROR" + error.message || error);
    }   
});

module.exports = userRouter;






