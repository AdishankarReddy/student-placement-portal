const express = require("express");
const { getAllCompanies, addCompany, updateCompany, deleteCompany } = require("../controllers/companyController");
const verifyAdmin = require("../middleware/isAdmin");

const companyRouter = express.Router();

companyRouter.get("/", getAllCompanies); // Public route (students can access)
companyRouter.post("/", verifyAdmin,addCompany); // Admin-only
companyRouter.put("/:id", verifyAdmin, updateCompany); // Admin-only
companyRouter.delete("/:id", verifyAdmin, deleteCompany); // Admin-only

module.exports = companyRouter;
