// AUTH-KIT TEMPLATE: Input Validation Rules
// Target: src/validation.js (or validation/auth.js)
// Requires: npm install express-validator

const { body } = require("express-validator");

// ---------------------------------------------------------------------------
// REGISTER VALIDATION
// Applied to POST /register before the route handler runs.
// ---------------------------------------------------------------------------
const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 100 })
    .withMessage("Name must be 100 characters or fewer."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
];

// ---------------------------------------------------------------------------
// LOGIN VALIDATION
// Applied to POST /login before the route handler runs.
// ---------------------------------------------------------------------------
const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required."),
];

module.exports = {
  registerValidation,
  loginValidation,
};
