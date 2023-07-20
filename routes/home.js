const Router = require("express").Router();

// Homepage
Router.get("/", async function (req, res) {
    res.render("home");
});

module.exports = Router;