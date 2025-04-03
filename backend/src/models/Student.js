const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    id:String,
    name:String,
    branch:String,
    status:{
        type:String,
        enum:['placed','unplaced'],
        default:'unplaced'
    }

})

const Student = mongoose.model("Student",studentSchema);
module.exports = Student;