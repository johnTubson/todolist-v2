require("dotenv").config();
const mongoose = require("mongoose");


module.exports = async function () {
    await mongoose.connect(process.env.MONGO_DB_URL);
    return mongoose;
}