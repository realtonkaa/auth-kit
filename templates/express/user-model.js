// AUTH-KIT TEMPLATE: Mongoose User Model
// Target: src/models/user-model.js (or models/User.js)
// Requires: npm install mongoose bcryptjs

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ---------------------------------------------------------------------------
// Number of salt rounds used by bcrypt. A higher value is more secure but
// slower. 12 is a good balance for most production workloads.
// ---------------------------------------------------------------------------
const SALT_ROUNDS = 12;

// ---------------------------------------------------------------------------
// USER SCHEMA
// ---------------------------------------------------------------------------
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters."],
      // Never return the password field by default in queries.
      select: false,
    },
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      maxlength: [100, "Name must be 100 characters or fewer."],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    // Automatically manage createdAt and updatedAt timestamps.
    timestamps: true,
  }
);

// ---------------------------------------------------------------------------
// PRE-SAVE HOOK -- Hash password before persisting
// This runs every time a document is saved. It only re-hashes the password
// if the password field was modified (e.g., on create or password change).
// ---------------------------------------------------------------------------
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// ---------------------------------------------------------------------------
// INSTANCE METHOD -- Compare a candidate password against the stored hash.
// Because the password field has `select: false`, you must explicitly select
// it before calling this method:
//   const user = await User.findOne({ email }).select("+password");
//   const isMatch = await user.comparePassword(candidatePassword);
// ---------------------------------------------------------------------------
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ---------------------------------------------------------------------------
// Ensure the password hash is never accidentally serialized to JSON.
// ---------------------------------------------------------------------------
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
