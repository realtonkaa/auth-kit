// AUTH-KIT TEMPLATE: Authentication Middleware (Route Guards)
// Target: src/middleware/auth-middleware.js (or middleware/auth.js)
// Requires: passport (session-based auth must be configured)

// ---------------------------------------------------------------------------
// ensureAuthenticated
// Checks that the request has a valid, authenticated session. If not, the
// request is rejected with a 401 Unauthorized response.
//
// Usage:
//   const { ensureAuthenticated } = require("../middleware/auth-middleware");
//   router.get("/dashboard", ensureAuthenticated, (req, res) => { ... });
// ---------------------------------------------------------------------------
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Authentication required." });
}

// ---------------------------------------------------------------------------
// ensureAdmin
// Checks that the authenticated user has the "admin" role. This middleware
// should be placed AFTER ensureAuthenticated in the middleware chain so that
// req.user is guaranteed to exist.
//
// Usage:
//   router.delete(
//     "/users/:id",
//     ensureAuthenticated,
//     ensureAdmin,
//     (req, res) => { ... }
//   );
// ---------------------------------------------------------------------------
function ensureAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access required." });
}

module.exports = {
  ensureAuthenticated,
  ensureAdmin,
};
