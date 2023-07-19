const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      trim: true,
      minlength: 8,
      maxlength: 128,
    },
    role: {
      type: String,
      required: [true, "role is required"],
      trim: true,
      enum: ["admin", "manager", "employee"],
      default: "employee",
    },
    active: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);