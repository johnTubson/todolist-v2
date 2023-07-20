process.on("unhandledRejection", async function (err) {
    //Critical Error: Log!
    console.log(err);
    throw err;
});


require("dotenv").config();
const express = require("express");
require("express-async-errors");

const app = express();

console.log(app)


require("./startup/db")();
require("./startup/setup")(app);


const port = process.env.PORT;

app.listen(port, function () {
    console.log(`Server successfully started on port ${port}`);
});
