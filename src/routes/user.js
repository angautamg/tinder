const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/adminauth');
const userRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const COMMON_USER_FIELDS = 'firstName lastName email age';

userRouter.get('/api/user/requests/received', auth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({ toUserId: loggedInUser._id, status: 'interested' })
            .populate('fromUserId', COMMON_USER_FIELDS) // Populate only firstName and lastName
            .exec();

        res.json({ message: "Received requests fetched successfully", data: connectionRequests });
    } catch (error) {
        res.statusCode(500).send("ERROR" + error.message || error);
    }
});
userRouter.get('/api/user/connections', auth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate('toUserId', COMMON_USER_FIELDS)
            .populate('fromUserId', COMMON_USER_FIELDS)  // Populate only firstName and lastName
            .exec();
        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){  
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({ message: "Sent requests fetched successfully", data: data });
    } catch (error) {
        res.statusCode(500).send("ERROR" + error.message || error);
    }
});

module.exports = userRouter;






