const mongoose = require("mongoose");

const callerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            required: true,
            trim: true,
        },
        // e.g. ["Hindi", "English", "Kannada"]
        languages: {
            type: [String],
            default: [],
        },
        dailyLeadLimit: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        // e.g. ["Maharashtra", "Karnataka"]
        assignedStates: {
            type: [String],
            default: [],
            set: function (states) {
                return states.map((s) => s.trim()); // Clean input data
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        // Assignment-related fields
        leadsToday: {
            type: Number,
            default: 0,
            min: 0,
        },
        // YYYY-MM-DD string to track when we last reset leadsToday
        lastResetDate: {
            type: String,
        },
        lastAssignedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
);

const Caller = mongoose.model("Caller", callerSchema);

module.exports = Caller;
