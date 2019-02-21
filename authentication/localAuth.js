const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

const User = mongoose.model("users");

passport.serializeUser(function(user, next) {
  next(null, user.id);
});

passport.deserializeUser(function(id, next) {
  User.findById(id, function(err, user) {
    next(err, user);
  });
});

/* Sign in using Email and Password */
passport.use(
  "local-login",
  new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
      // callback with email and password from our form

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({ email: email }, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err) return done(err);

        // if no user is found, return the message
        if (!user)
          return done(null, false, req.flash("errors", "Invalid Credentials")); // req.flash is the way to set flashdata using connect-flash

        // if the user is found but the password is wrong
        if (!user.comparePassword(password))
          return done(null, false, req.flash("errors", "Invalid Credentials")); // create the loginMessage and save it to session as flashdata

        // all is well, return successful user

        return done(null, user);
      });
    }
  )
);
