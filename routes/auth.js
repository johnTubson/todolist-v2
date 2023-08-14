const passport = require("../authentication/passport/authentication");
const Router = require("express").Router();

//AUTHENTICATION ROUTES

Router.get("/login", passport.authenticate("google"));

Router.get(
	"/oauth2/redirect/google",
	passport.authenticate("google", {
		failureRedirect: "/",
		successReturnToOrRedirect: "/lists",
	})
);

Router.post("/logout", function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
});

module.exports = Router;
