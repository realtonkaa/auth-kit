// AUTH-KIT TEMPLATE: Express Session Configuration
// Target: src/config/session-config.js (or config/session.js)
// Requires: npm install express-session connect-mongo

const session = require("express-session");
const { MongoStore } = require("connect-mongo");

// ---------------------------------------------------------------------------
// SESSION CONFIGURATION
// Creates and returns an express-session middleware instance. Call this in
// your main app file:
//
//   const sessionMiddleware = require("./config/session-config");
//   app.use(sessionMiddleware);
// ---------------------------------------------------------------------------

const sessionConfig = session({
  // Secret used to sign the session ID cookie. Must be kept private.
  secret: process.env.SESSION_SECRET || "change-me-to-a-random-string",

  // Do not re-save the session if it was not modified during the request.
  resave: false,

  // Do not create a session until something is stored in it.
  saveUninitialized: false,

  // -- Cookie Settings -----------------------------------------------------
  cookie: {
    // httpOnly prevents client-side JavaScript from reading the cookie,
    // mitigating XSS-based session theft.
    httpOnly: true,

    // In production, cookies should only be sent over HTTPS.
    secure: process.env.NODE_ENV === "production",

    // "lax" provides a reasonable balance between security and usability.
    // Use "strict" if your app never needs cross-site cookie access.
    sameSite: "lax",

    // Session lifetime in milliseconds. Default: 7 days.
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },

  // -- Session Store -------------------------------------------------------
  // Persist sessions in MongoDB so they survive server restarts.
  store: new MongoStore({
    mongoUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/myapp",
    // Name of the MongoDB collection that holds sessions.
    collectionName: "sessions",
    // Automatically remove expired sessions (interval in seconds).
    ttl: 60 * 60 * 24 * 7, // 7 days -- should match cookie.maxAge
  }),

  // -- PostgreSQL Alternative -----------------------------------------------
  // If you prefer PostgreSQL, swap connect-mongo for connect-pg-simple:
  //
  //   npm install connect-pg-simple pg
  //
  //   const pgSession = require("connect-pg-simple")(session);
  //   store: new pgSession({
  //     conString: process.env.DATABASE_URL,
  //     tableName: "session",
  //   }),
});

module.exports = sessionConfig;
