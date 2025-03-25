require("dotenv").config();
const MONGO_URL=process.env.MONGO_URL;
const PORT=process.env.PORT;
const JWT_SECRET=process.env.JWT_SECRET;
module.exports={
    MONGO_URL,PORT,JWT_SECRET
}
