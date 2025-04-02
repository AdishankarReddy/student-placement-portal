const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        maxlength: 12,
        match: /^[a-zA-Z0-9]+$/
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type:String,
        default:"user"
    }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
