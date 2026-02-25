const Caller = require("../models/Caller");

// GET /api/callers
async function getAllCallers(req, res, next) {
  try {
    const callers = await Caller.find().sort({ createdAt: -1 });
    res.json({ success: true, data: callers });
  } catch (err) {
    next(err);
  }
}

// POST /api/callers
async function createCaller(req, res, next) {
  try {
    const { name, role, languages, dailyLeadLimit, assignedStates, isActive } =
      req.body;

    const caller = await Caller.create({
      name,
      role,
      languages,
      dailyLeadLimit,
      assignedStates,
      isActive,
    });

    res.status(201).json({ success: true, data: caller });
  } catch (err) {
    next(err);
  }
}

// PUT /api/callers/:id
async function updateCaller(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const caller = await Caller.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!caller) {
      const error = new Error("Caller not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({ success: true, data: caller });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/callers/:id
async function deleteCaller(req, res, next) {
  try {
    const { id } = req.params;

    const caller = await Caller.findByIdAndDelete(id);

    if (!caller) {
      const error = new Error("Caller not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({ success: true, message: "Caller deleted successfully" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllCallers,
  createCaller,
  updateCaller,
  deleteCaller,
};

