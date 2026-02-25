const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        timestamp: {
            type: Date,
            required: true,
        },
        leadSource: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
            index: true,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        // These fields will be useful in later phases (assignment, status tracking)
        assignedCaller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Caller",
        },
        status: {
            type: String,
            enum: ["new", "assigned", "in_progress", "closed", "invalid"],
            default: "new",
        },
    },
    {
        timestamps: true,
    },
);

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;
