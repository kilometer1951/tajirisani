const passport = require("passport");
const localAuth = require("../authentication/localAuth");
//const socialAuth = require("../authentication/socialAuth");
const authFunctions = require("../functions/authfunctions");
const mongoose = require("mongoose");

const User = mongoose.model("users");
module.exports = app => {
  //POST SIGNUP DATA TO DB
  app.post("/api/signup", function(req, res, next) {
    //  check if user already exist
    User.findOne({ email: req.body.data.email_signup }, function(
      err,
      existingUser
    ) {
      if (existingUser) {
        //if user exist redirect to login page
        return res.send({
          suc: false
        }); //res.send({ error: "User Already exist try signing in " });
      } else {
        //user does not exist save and authenticate user
        var newUser = new User();
        newUser.name = authFunctions.capitalize(req.body.data.name);
        newUser.email = req.body.data.email_signup;
        newUser.password = newUser.encryptPassword(req.body.data.pass_signup);
        newUser.isAdmin = false;
        newUser.save(function(err) {
          //  log the user in after you save
          req.logIn(newUser, function(err) {
            if (err) {
              console.log(err);
              return next(err);
            } else {
              return res.send({ suc: true });
            }
          });
        });
      }
    });
  });
  //LOGIN
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local-login", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send({ suc: false });
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.send({ suc: true });
      });
    })(req, res, next);
  });

  //social logIn
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.redirect("/");
    }
  );

  //social logIn
  //facebook auth
  app.get(
    "/auth/facebook",
    passport.authenticate("facebook", {
      scope: ["public_profile,email,user_friends"]
    })
  );

  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/",
      failureFlash: true
    })
  );
  //end facebook auth

  //logout
  app.get("/api/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
};
