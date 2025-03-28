const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema({
    serialNo: { type: Number, required: true, unique: true },  
    studentId: { type: String, required: true, unique: true },  
    name: { type: String, required: true },  
    status: { type: String, enum: ["Placed", "Not Placed"], default: "Not Placed" }  
});

module.exports = mongoose.model("Placement", placementSchema);
