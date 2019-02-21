const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const mongoose = require("mongoose");
//const cookieSession = require("cookie-session");
const googleClientID =
  "143744997221-beel7cashghtgkedogftbhali63ru4l5.apps.googleusercontent.com";
const googleClientSecret = "qqiN8U7BTSfaY6n7siTLQIJr";

const facebookClientID = "303083823661041";
const facebookClientSecret = "29e94492c71d63c75a370c7b081ead1f";

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientID,
      clientSecret: googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({
        email: profile.emails[0].value
      });
      if (existingUser) {
        return done(null, existingUser);
      }
      const user = await new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        isAdmin: false
      }).save();
      done(null, user);
    }
  )
);

/* Sign in / log in using facebook */
passport.use(
  new FacebookStrategy(
    {
      clientID: facebookClientID,
      clientSecret: facebookClientSecret,
      callbackURL:
        "https://secure-plateau-87671.herokuapp.com/auth/facebook/callback",
      profileFields: ["id", "displayName", "email", "first_name", "last_name"]
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ email: profile._json.email });
      if (existingUser) {
        return done(null, existingUser);
      } else {
        const user = await new User({
          facebookId: profile.id,
          email: profile._json.email,
          name: profile.displayName,
          isAdmin: false
        }).save();
        done(null, user);
      }
    }
  )
);
