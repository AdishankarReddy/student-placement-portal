const Placement = require("../models/placement");

// ✅ Add a Placement Record
exports.addPlacement = async (req, res) => {
    try {
        console.log("Incoming Request Body:", req.body); // Debugging log

        const { serialNo, studentId, name, status } = req.body;

        // ✅ Validate input fields
        if (!serialNo || !studentId || !name || !status) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Create new placement record
        const newPlacement = new Placement({ serialNo, studentId, name, status });
        await newPlacement.save();

        res.status(201).json({ message: "Placement record added successfully" });
    } catch (error) {
        console.error("Error adding placement:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Get All Placement Records
exports.getAllPlacements = async (req, res) => {
    try {
        const placements = await Placement.find();
        res.json(placements);
    } catch (error) {
        console.error("Error fetching placements:", error);
        res.status(500).json({ message: "Server error" });
    }
};

