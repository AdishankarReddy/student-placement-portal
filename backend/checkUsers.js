const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log("✅ Connected to MongoDB");

    // Fetch all users from the "users" collection
    const users = await mongoose.connection.db.collection("users").find().toArray();

    console.log("📌 Users in database:", users);
    mongoose.connection.close();
})
.catch(err => console.error("❌ MongoDB connection error:", err));
