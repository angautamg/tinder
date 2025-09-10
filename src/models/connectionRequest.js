const mongoose = require('mongoose');

const ConnectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    status: {
        type: String,
        enum: {
            values: ['pending','ignored','interested', 'accepted', 'rejected'],
            message: '{VALUE} is not a valid status',
        },
        default: 'pending',
    },
}, { timestamps: true });

ConnectionRequestSchema.pre('save', function (next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("fromUserId and toUserId cannot be the same");
    }
    next();
});

module.exports = mongoose.model('ConnectionRequest', ConnectionRequestSchema);
