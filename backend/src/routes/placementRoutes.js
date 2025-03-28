const express = require("express");
const { addPlacement, getAllPlacements } = require("../controllers/placementController");

const router = express.Router();

// ✅ Add a new placement record
router.post("/", addPlacement);

// ✅ Get all placement records
router.get("/placements", getAllPlacements);

module.exports = router;

