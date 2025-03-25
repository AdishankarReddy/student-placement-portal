const express = require("express");
const { body } = require("express-validator");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// Validation rules
const validateUser = [
    body("username")
        .isLength({ min: 6, max: 12 }).withMessage("Username must be between 6-12 characters")
        .matches(/^[a-zA-Z0-9]+$/).withMessage("Username must be alphanumeric (A-Z, a-z, 0-9)"),

    body("password")
        .isLength({ min: 6, max: 12 }).withMessage("Password must be between 6-12 characters")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one numeric character")
        .matches(/[\W_]/).withMessage("Password must contain at least one special character (!@#$%^&*)")
];

// Register Route
router.post("/register", validateUser, register);

// Login Route
router.post("/login", validateUser, login);

module.exports = router;
