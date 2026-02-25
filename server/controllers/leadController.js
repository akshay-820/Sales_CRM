const Lead = require("../models/Lead");
const {
    assignCallerForLead,
    getTodayString,
} = require("../services/assignmentService");
const { getIO } = require("../socket");

// POST /api/leads/ingest
// Save lead -> call assignmentService -> emit "new_lead"
async function ingestLead(req, res, next) {
    try {
        const { name, phone, timestamp, leadSource, city, state, metadata } =
            req.body;

        const leadData = {
            name,
            phone,
            timestamp: timestamp ? new Date(timestamp) : new Date(),
            leadSource,
            city,
            state,
            metadata: metadata || {},
        };

        // First create the lead (unassigned)
        let lead = await Lead.create(leadData);

        // Run assignment logic based on lead state
        const caller = await assignCallerForLead({ state: lead.state });

        if (caller) {
            lead.assignedCaller = caller._id;
            lead.status = "assigned";
            await lead.save();
            await lead.populate("assignedCaller");
        }

        // Emit socket event so UI gets the new lead in real time
        try {
            const io = getIO();
            io.emit("new_lead", {
                lead,
            });
        } catch (socketErr) {
            // Don't fail the request just because socket isn't available
            console.error("Failed to emit new_lead event:", socketErr);
        }

        res.status(201).json({
            success: true,
            data: lead,
            systemInfo: {
                today: getTodayString(),
                day: new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                }),
            },
        });
    } catch (err) {
        next(err);
    }
}

// GET /api/leads
// Get all leads, populate assignedCaller
async function getAllLeads(req, res, next) {
    try {
        const leads = await Lead.find()
            .populate("assignedCaller")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: leads,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    ingestLead,
    getAllLeads,
};
