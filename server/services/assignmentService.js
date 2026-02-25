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
      $or: [{ lastResetDate: { $ne: today } }, { lastResetDate: { $exists: false } }],
    },
    {
      $set: {
        leadsToday: 0,
        lastResetDate: today,
      },
    }
  );
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

  // 3. Filter pool: callers where assignedStates includes lead.state
  let poolQuery = { isActive: true };

  if (state) {
    poolQuery.assignedStates = state;
  }

  let pool = await Caller.find(poolQuery);

  // If pool is empty, use ALL active callers
  if (!pool.length) {
    pool = await Caller.find({ isActive: true });
  }

  if (!pool.length) {
    return null;
  }

  // 4. Remove callers where leadsToday >= dailyLeadLimit
  // Interpret dailyLeadLimit=0 as "no limit" to avoid blocking new callers
  const eligible = pool.filter((caller) => {
    const limit = caller.dailyLeadLimit || 0;
    const todayCount = caller.leadsToday || 0;

    if (limit <= 0) {
      return true;
    }

    return todayCount < limit;
  });

  // 5. If no one is eligible → assign null (handle gracefully)
  if (!eligible.length) {
    return null;
  }

  // 6. Sort eligible by lastAssignedAt (oldest first)
  eligible.sort((a, b) => {
    if (!a.lastAssignedAt && !b.lastAssignedAt) return 0;
    if (!a.lastAssignedAt) return -1;
    if (!b.lastAssignedAt) return 1;
    return a.lastAssignedAt - b.lastAssignedAt;
  });

  const chosen = eligible[0];

  // 7. Increment that caller's leadsToday, set lastAssignedAt = now
  chosen.leadsToday = (chosen.leadsToday || 0) + 1;
  chosen.lastAssignedAt = new Date();
  await chosen.save();

  // 8. Return caller
  return chosen;
}

module.exports = {
  assignCallerForLead,
  getTodayString,
};

