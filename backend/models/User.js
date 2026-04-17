// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: String,
//     email: { type: String, unique: true },
//     password: String,
//     role: {
//       type: String,
//       enum: ["admin", "user"],
//       default: "user",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);

console.log("🚀 START User model");

const mongoose = require("mongoose");
console.log("mongoose loaded");

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    date: String,
    gender: {
      type: String,
      enum: ["Nam", "Nữ", "Khác"],
      default: "Khác",
    },
    dob: String,
    address: String,
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    resetOtp: String,
    resetOtpExpires: Date,
  },
  { timestamps: true }
);

console.log("schema created");

const User = mongoose.model("User", userSchema);
console.log("model created");

module.exports = User;