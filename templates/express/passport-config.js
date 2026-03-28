// AUTH-KIT TEMPLATE: Passport.js Local Strategy Configuration
// Target: src/config/passport-config.js (or config/passport.js)
// Requires: npm install passport passport-local bcryptjs

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// ---------------------------------------------------------------------------
// LOCAL STRATEGY
// Authenticates users with an email + password combination.
// The strategy looks up the user by email, then compares the supplied
// password against the stored bcrypt hash.
// ---------------------------------------------------------------------------
passport.use(
  new LocalStrategy(
    {
      // By default Passport expects "username". Override to use "email".
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // 1. Find the user by email.
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          return done(null, false, { message: "Invalid email or password." });
        }

        // 2. Compare the plaintext password with the stored hash.
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password." });
        }

        // 3. Authentication successful -- pass the user object to Passport.
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// ---------------------------------------------------------------------------
// SERIALIZE USER
// Determines which piece of data is stored in the session. We store only the
// user ID to keep the session payload small.
// ---------------------------------------------------------------------------
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// ---------------------------------------------------------------------------
// DESERIALIZE USER
// On each request Passport retrieves the full user document from the DB using
// the ID stored in the session. The result is attached to req.user.
// ---------------------------------------------------------------------------
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password");
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
