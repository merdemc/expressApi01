const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("node:crypto");
// name, email. password, confirmPassword, photo
// Schema is a constructor. So we should use "new" keyword
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your email.\n"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email.\n"],
    unique: true,
    lowercase: true, // It converts characters to lowercase whne saving them
    validate: [validator.isEmail, "Please enter a valid email.\n"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please enter a password.\n"],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password\n"],
    validate: {
      // This validator works only for save and create method
      validator: function (value) {
        return value == this.password;
      },
      message:
        "Password & Confirm Password didn't match!. Please try again. \n",
    },
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExprires: Date,
});

// Encrypting the password
userSchema.pre("save", async function (next) {
  // Chech if password modified or not. If not, continue to the next step
  if (!this.isModified("password")) {
    return next();
  }

  // Hashing/encrypting the password before saving it
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

// not send inacteve users in case of find query
// we use "/^find/"reqular expression to run pre middleware to run all query starts with find
userSchema.pre("/^find/", function (next) {
  // this keyword in the function points to the cırrent query
  this.find({ active: { $ne: false } });
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (
  providedPassword,
  storedPassword
) {
  return await bcrypt.compare(providedPassword, storedPassword);
};

userSchema.methods.IsPasswordChanged = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < passwordChangedTimestamp;
  }
  return false;
};

userSchema.methods.createResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  //const resetToken = crypto.randomBytes(32);
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExprires = Date.now() + 10 * 60 * 1000; // It will expire after 10 minutes.

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
