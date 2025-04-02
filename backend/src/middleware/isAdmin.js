const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../../config");


const verifyAdmin = async (req, res, next) => {
    try {
        // 1️⃣ Get Token from Headers
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(403).json({ message: "Access denied. No token provided." });
        }

        // 2️⃣ Verify and Decode Token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Store decoded user info in req

        // 3️⃣ Fetch User from DB
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // 4️⃣ Check If User Is Admin
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        // 5️⃣ Proceed to Next Middleware
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};

module.exports = verifyAdmin;
