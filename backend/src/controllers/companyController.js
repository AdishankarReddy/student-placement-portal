const Company = require("../models/Company");

// 🟢 Get all companies (Accessible to students & admins)
const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// 🔵 Add a new company (Admins only)
const addCompany = async (req, res) => {
    try {
        const { companyName, noOfVacancies, roles, applyLink } = req.body;

        const companyExists = await Company.findOne({ companyName });
        if (companyExists) {
            return res.status(400).json({ message: "Company already exists" });
        }

        const newCompany = new Company({
            companyName,
            noOfVacancies,
            roles,
            applyLink
        });

        await newCompany.save();
        res.status(201).json({ message: "Company added successfully", company: newCompany });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// 🟠 Update a company (Admins only)
const updateCompany = async (req, res) => {
    try {
        const { companyName, noOfVacancies, roles, applyLink } = req.body;
        const companyId = req.params.id;

        const updatedCompany = await Company.findByIdAndUpdate(
            companyId,
            { companyName, noOfVacancies, roles, applyLink },
            { new: true }
        );

        if (!updatedCompany) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.json({ message: "Company updated successfully", company: updatedCompany });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// 🔴 Delete a company (Admins only)
const deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const deletedCompany = await Company.findByIdAndDelete(companyId);

        if (!deletedCompany) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.json({ message: "Company deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getAllCompanies, addCompany, updateCompany, deleteCompany };
