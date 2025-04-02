const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

// ✅ REGISTER USER
exports.register = async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("🔴 Validation Errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    console.log("🔹 Register Request - Username:", username);

    try {
        // ✅ Check if user already exists
        let existingUser = await User.findOne({ username });
        console.log("🔹 Checking if user exists:", existingUser);
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // ✅ Hash password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("🔹 Hashed Password:", hashedPassword);

        // ✅ Save new user
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        console.log("✅ User Registered:", newUser);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("🔴 Server Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ LOGIN USER
exports.login = async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("🔴 Validation Errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    console.log("🔹 Login Request - Username:", username);

    try {
        // ✅ Check if user exists
        let user = await User.findOne({ username });
        console.log("🔹 Checking if user exists:", user);
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" }); // Secure error message
        }

        // ✅ Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("🔹 Password Match Status:", isMatch);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // ✅ Ensure JWT_SECRET is set
        if (!process.env.JWT_SECRET) {
            console.error("🔴 JWT_SECRET is missing in .env file!");
            return res.status(500).json({ message: "Internal server error" });
        }

        // ✅ Generate JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log("✅ JWT Token Generated:", token);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                role:user.role
            }
        });
    } catch (error) {
        console.error("🔴 Server Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

