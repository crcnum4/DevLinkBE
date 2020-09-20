const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const authWithProfile = require("../../middleware/authWithProfile");

const Post = require("../../models/Post");

// @route		POST api/posts
// @desc		create new post
// @access	profile
router.post(
  "/",
  authWithProfile,
  [
    check("content", "Empty posts not allowed").notEmpty(),
    check("content", "Must be less then 250 characters").isLength({ max: 250 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const postData = {
        profileId: req.profile._id,
        content: req.body.content,
      };
      if (req.body.repostId) postData.repostId = req.body.repostId;

      const newPost = await Post.create(postData);

      if (newPost.repostId) {
        await Post.findByIdAndUpdate(newPost.repostId, {
          $inc: { reposts: 1 },
        });
      }
      return res.json(newPost);
    } catch (error) {
      console.error("ERROR", error.message);
      return res.status(500).json({ message: error.message, error });
    }
  }
);

// @route		GET api/posts?pg=page
// @desc		get posts per page
// @access	private
router.get("/", authWithProfile, async (req, res) => {
  const pageCount = 30;
  const page = parseInt(req.query.pq || 0);
  try {
    let posts = await Post.aggregate([
      {
        $match: {},
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: pageCount * page,
      },
      {
        $limit: pageCount,
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "postId",
          as: "likes_docs",
        },
      },
      {
        $project: {
          _id: 1,
          profileId: 1,
          content: 1,
          repostId: 1,
          reposts: 1,
          likes: { $size: "$likes_docs" },
          liked: { $in: [req.profile._id, "$likes_docs.profileId"] },
        },
      },
    ]);

    posts = await Post.populate(posts, [
      {
        path: "profileId",
        select: "name avatar handle",
      },
      {
        path: "repostId",
        select: "profileId content",
      },
    ]);
    posts = await Profile.populate(posts, {
      path: "repostId.profileId",
      select: "name avatar handle",
    });

    res.json(posts);
  } catch (error) {
    console.error("ERROR", error.message);
    return res.status(500).json({ message: error.message, error });
  }
});

module.exports = router;
