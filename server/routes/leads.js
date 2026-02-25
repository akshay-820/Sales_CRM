const express = require("express");
const { ingestLead, getAllLeads } = require("../controllers/leadController");

const router = express.Router();

// Ingest from Google Sheets / external sources
router.post("/ingest", ingestLead);

// List all leads (with assignedCaller populated)
router.get("/", getAllLeads);

module.exports = router;

