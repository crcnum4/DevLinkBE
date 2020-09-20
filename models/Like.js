const mongoose = require("mongoose");

const likeSchema = mongoose.Schema(
  {
    profileId: mongoose.Schema.Types.ObjectId,
    postId: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: {} }
);

module.exports = Like = mongoose.model("likes", likeSchema);
