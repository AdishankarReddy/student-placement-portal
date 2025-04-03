const express = require("express");
const verifyAdmin = require("../middleware/isAdmin");
const { getAllPlacedStudents, getAllStudents, getAllUnPlacedStudents, getStudentsByBranch, updateStudentStatus } = require("../controllers/studentController");

const studentRouter = express.Router();

studentRouter.get("/", verifyAdmin,getAllStudents); // Public route (students can access)
studentRouter.get("/placed", verifyAdmin,getAllPlacedStudents); // Admin-only
studentRouter.get("/unplaced", verifyAdmin, getAllUnPlacedStudents); // Admin-only
studentRouter.get("/:branch", verifyAdmin, getStudentsByBranch); // Admin-only
studentRouter.put("/edit/:studentId",verifyAdmin,updateStudentStatus);

module.exports = studentRouter;
