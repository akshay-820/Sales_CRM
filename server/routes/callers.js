const express = require("express");
const {
  getAllCallers,
  createCaller,
  updateCaller,
  deleteCaller,
} = require("../controllers/callerController");

const router = express.Router();

router.get("/", getAllCallers);
router.post("/", createCaller);
router.put("/:id", updateCaller);
router.delete("/:id", deleteCaller);

module.exports = router;

