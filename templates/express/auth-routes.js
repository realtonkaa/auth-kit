// AUTH-KIT TEMPLATE: Authentication Routes
// Target: src/routes/auth-routes.js (or routes/auth.js)
// Requires: npm install express passport bcryptjs express-validator

const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { ensureAuthenticated } = require("../middleware/auth");
const { registerValidation, loginValidation } = require("../middleware/validation");
const { validationResult } = require("express-validator");

const router = express.Router();

// ---------------------------------------------------------------------------
// POST /register -- Create a new user account
// ---------------------------------------------------------------------------
router.post("/register", registerValidation, async (req, res) => {
  // Check for validation errors.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;

    // Check if a user with this email already exists.
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    // Create the user. Password hashing is handled by the pre-save hook in
    // the User model (see user-model.js).
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    });

    // Automatically log the user in after registration.
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Registration succeeded but auto-login failed." });
      }
      return res.status(201).json({
        message: "Account created.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// ---------------------------------------------------------------------------
// POST /login -- Authenticate with email & password
// ---------------------------------------------------------------------------
router.post("/login", loginValidation, (req, res, next) => {
  // Check for validation errors.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info?.message || "Authentication failed." });
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.json({
        message: "Logged in successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    });
  })(req, res, next);
});

// ---------------------------------------------------------------------------
// POST /logout -- Destroy the session
// ---------------------------------------------------------------------------
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        return next(destroyErr);
      }
      res.clearCookie("connect.sid");
      return res.json({ message: "Logged out successfully." });
    });
  });
});

// ---------------------------------------------------------------------------
// GET /me -- Return the currently authenticated user (protected)
// ---------------------------------------------------------------------------
router.get("/me", ensureAuthenticated, (req, res) => {
  return res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

module.exports = router;
