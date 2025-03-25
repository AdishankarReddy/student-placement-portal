const mongoose = require("mongoose");
const { MONGO_URL } = require("../../config");


const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
