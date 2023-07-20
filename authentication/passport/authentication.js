require("dotenv").config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {User} = require("../../models/database");
const passport = require("passport");
const {newUserAction} = require("../../controllers/lists");
 


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/oauth2/redirect/google",
      scope: ["profile", "email"],
      state: true,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const user = await User.findOne({ google_id: profile.id });
        if (!user) {
          const new_user  = await newUserAction(profile);
          return cb(null, new_user);
        }
        return cb(null, user.toObject());
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);
	


passport.serializeUser(function(user, done) {
  process.nextTick(function() {
    return done(null, {
      _id: user._id, 
      name: user.name, 
      google_id: user.google_id, 
      default_list: user.default_list,
    });
  });
});

passport.deserializeUser(function(user, done) {
  process.nextTick(function() {
    return done(null, user);
  });
});



module.exports = passport;














