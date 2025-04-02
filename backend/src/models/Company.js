const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true
    },
    noOfVacancies: {
        type: Number,
        required: true
    },
    roles: {
        type: [String], // Array of roles
        required: true
    },
    applyLink: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Company", CompanySchema);
