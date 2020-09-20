const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const authWithProfile = require("../../middleware/authWithProfile");

const Post = require("../../models/Post");
const Like = require("../../models/Like");

// @route		POST api/likes/:id
// @desc		Like a post
// @access	private
router.post("/:id", authWithProfile, async (req, res) => {
  try {
    const _ = await Like.update(
      { profileId: req.profile._id, postId: req.params.id },
      { profileId: req.profile._id, postId: req.params.id },
      { upsert: true }
    );
    return res.json({ message: "success" });
  } catch (error) {
    console.error("ERROR", error.message);
    return res.status(500).json({ message: error.message, error });
  }
});

// @route		DELETE api/likes/:id
// @desc		delete a like
// @access	private
router.delete("/:id", authWithProfile, async (req, res) => {
  try {
    const _ = await Like.findOneAndDelete({
      profileId: req.profile._id,
      postId: req.params.id,
    });
    return res.json({ message: "success" });
  } catch (error) {
    console.error("ERROR", error.message);
    return res.status(500).json({ message: error.message, error });
  }
});

module.exports = router;
