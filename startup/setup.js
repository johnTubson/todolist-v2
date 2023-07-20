const {urlencoded, static} = require("express");


function setup (app) {
  app.use(urlencoded({ extended: true }));

  app.set("view engine", "ejs");

  app.use(static("public"));

  const session = require("../authentication/session")(app);
  app.use(session);

  const passport = require("../authentication/passport/authentication");
  app.use(passport.session());

  const lists = require("../routes/lists");
  const auth = require("../routes/auth");
  const home = require("../routes/home");

  app.use("/", home);
  app.use("/", auth);
  app.use("/lists", lists);

  const {
    error404Handler,
    centralErrorHandler,
  } = require("../middlewares/error");
  
  app.use(error404Handler);
  app.use(centralErrorHandler);
}

module.exports = setup;