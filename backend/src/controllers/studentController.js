import Student from "../models/Student.js";

// Get all students
export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({});
        res.status(200).json({ students });
        console.log("Getting data");
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all placed students
export const getAllPlacedStudents = async (req, res) => {
    try {
        const students = await Student.find({ status: "placed" });
        res.status(200).json({ students });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all unplaced students
export const getAllUnPlacedStudents = async (req, res) => {
    try {
        const students = await Student.find({ status: "unplaced" });
        res.status(200).json({ students });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get students by branch
export const getStudentsByBranch = async (req, res) => {
    try {
        const students = await Student.find({ branch: req.params.branch });
        res.status(200).json({ students });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateStudentStatus = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { status } = req.body;

        // Validate input
        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        // Find and update student
        const updatedStudent = await Student.updateOne(
            {id:studentId},
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student status updated successfully", student: updatedStudent });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};