const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const placementRoutes = require("./routes/placementRoutes"); // ✅ Import Placement Routes
const connectDB = require("./db");
const companyRoutes = require("./routes/companyRoutes");

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to Database
connectDB();

// ✅ Initialize Express App BEFORE using it!
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});


// ✅ Register Routes (After app is initialized)
app.use("/api/auth", authRoutes);
app.use("/api", placementRoutes); // ✅ Moved this below 'app' declaration
app.use("/api/companies", companyRoutes);

// ✅ Use the correct PORT value
const PORT = process.env.PORT || 8080;
app.get("/", (req, res) => {
    res.send("Server is up and running!");
});


// ✅ Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});



