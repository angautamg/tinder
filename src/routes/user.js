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
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({ message: "Sent requests fetched successfully", data: data });
    } catch (error) {
        res.statusCode(500).send("ERROR" + error.message || error);
    }
});
userRouter.get('/api/feed', auth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        // 1. Get all users that the logged-in user has sent requests to or received requests from
        const relatedRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select('fromUserId toUserId').exec();
        
        const relatedUserIds = new Set();
        relatedRequests.forEach(req => {
            relatedUserIds.add(req.fromUserId.toString());
            relatedUserIds.add(req.toUserId.toString());
        });
        relatedUserIds.add(loggedInUser._id.toString()); // Exclude self
        // 2. Find users not in relatedUserIds
        const User = require('../models/user');
        const feedUsers = await User.find({
            $and: [
                { _id: { $nin: Array.from(relatedUserIds) } },
                { _id: { $ne: loggedInUser._id } }
            ],
        }).select(COMMON_USER_FIELDS).exec();

        res.json({ message: "User feed fetched successfully", data: feedUsers });
    } catch (error) {
        res.statusCode(500).send("ERROR" + error.message || error);
    }
});
module.exports = userRouter;
