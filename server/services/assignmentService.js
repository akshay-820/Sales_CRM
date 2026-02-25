const Caller = require("../models/Caller");

function getTodayString() {
    // Use local date instead of UTC so resets align with your local day
    // Format: YYYY-MM-DD (en-CA locale gives this by default)
    return new Date().toLocaleDateString("en-CA");
}

async function resetDailyCountersIfNeeded() {
    const today = getTodayString();

    // Reset leadsToday for callers whose lastResetDate is not today
    await Caller.updateMany(
        {
            $or: [
                { lastResetDate: { $ne: today } },
                { lastResetDate: { $exists: false } },
            ],
        },
        {
            $set: {
                leadsToday: 0,
                lastResetDate: today,
            },
        },
    );
}

function getSystemDateInfo() {
    const now = new Date();
    return {
        date: now.toLocaleDateString("en-CA"), // YYYY-MM-DD
        day: now.toLocaleDateString("en-US", { weekday: "long" }), // e.g., "Monday"
        timestamp: now.toISOString(),
    };
}

/**
 * Assign a caller for a given lead, using:
 * - State-based pool
 * - Daily caps (per caller)
 * - Round-robin via lastAssignedAt
 *
 * @param {{ state?: string }} lead Like a Lead document or object with a `state` field
 * @returns {Promise<Caller|null>} The assigned caller or null if none eligible
 */
async function assignCallerForLead(lead) {
    const state = lead?.state;
    await resetDailyCountersIfNeeded();

    // 1. Try to find eligible callers in the specific state
    let eligible = [];
    if (state) {
        const statePool = await Caller.find({
            isActive: true,
            assignedStates: state,
        });

        eligible = statePool.filter((caller) => {
            const limit = caller.dailyLeadLimit || 0;
            const todayCount = caller.leadsToday || 0;
            return limit <= 0 || todayCount < limit;
        });
    }

    // 2. Fallback: If no one in that state is eligible, check ALL active callers
    if (eligible.length === 0) {
        const generalPool = await Caller.find({ isActive: true });

        eligible = generalPool.filter((caller) => {
            const limit = caller.dailyLeadLimit || 0;
            const todayCount = caller.leadsToday || 0;
            return limit <= 0 || todayCount < limit;
        });
    }

    // 3. Final Exit: No one available anywhere
    if (eligible.length === 0) {
        return null;
    }

    // 4. Round-Robin Sorting (Oldest assignment first)
    eligible.sort((a, b) => {
        const timeA = a.lastAssignedAt
            ? new Date(a.lastAssignedAt).getTime()
            : 0;
        const timeB = b.lastAssignedAt
            ? new Date(b.lastAssignedAt).getTime()
            : 0;
        return timeA - timeB;
    });

    const chosen = eligible[0];

    // 5. Update and Save
    chosen.leadsToday = (chosen.leadsToday || 0) + 1;
    chosen.lastAssignedAt = new Date();
    await chosen.save();

    return chosen;
}

module.exports = {
    assignCallerForLead,
    getTodayString,
    resetDailyCountersIfNeeded,
};
