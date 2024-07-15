const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
    },
    role: {
      type: String,
      required: "admin",
      enum: ["admin", "super-admin"],
      default: "admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("admin", adminSchema);
