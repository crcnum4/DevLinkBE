const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: "profiles" },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: {} }
);

module.exports = User = mongoose.model("users", userSchema);
