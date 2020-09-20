const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", unique: true },
  handle: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: String,
  lastName: String,
  name: String,
  avatar: String,
  bio: String,
  twitter: String,
  facebook: String,
  github: String,
  skills: { type: [String], default: [] },
});

module.exports = Profile = mongoose.model("profiles", profileSchema);
