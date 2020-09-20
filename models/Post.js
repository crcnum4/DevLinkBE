const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: "profiles" },
    content: String,
    repostId: { type: mongoose.Schema.Types.ObjectId, ref: "posts" },
    reposts: { type: Number, default: 0 },
  },
  { timestamps: {} }
);

module.exports = Post = mongoose.model("posts", postSchema);
