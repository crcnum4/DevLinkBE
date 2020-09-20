const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const authWithProfile = require("../../middleware/authWithProfile");

const keys = ["bio", "twitter", "facebook", "github", "skills"];

// @route		POST api/profiles
// @desc		create profile
// @access	private
router.post(
  "/",
  auth,
  [
    check("firstName", "Name Required").notEmpty(),
    check("lastName", "Name Required").notEmpty(),
    check("handle", "Handle Required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profileData = {
        userId: req.user.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        handle: req.body.handle,
        name: `${req.body.firstName} ${req.body.lastName}`,
      };
      keys.forEach(
        (key) => (profileData[key] = req.body[key] ? req.body[key] : null)
      );
      const profile = await Profile.create(profileData);
      await User.findByIdAndUpdate(profile.userId, { profileId: profile._id });
      return res.json(profile);
    } catch (error) {
      console.error("ERROR", error.message);
      return res.status(500).json({ message: error.message, error });
    }
  }
);

// @route		PUT api/profiles
// @desc		update existing profile
// @access	private
router.put(
  "/",
  auth,
  [
    check("firstName", "Name Required").notEmpty(),
    check("lastName", "Name Required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profileData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        name: `${req.body.firstName} ${req.body.lastName}`,
      };
      keys.forEach((key) => {
        if (req.body[key]) profileData[key] = req.body[key];
      });
      const profile = await Profile.findOneAndUpdate(
        { userId: req.user.id },
        profileData,
        { new: true }
      );
      return res.json(profile);
    } catch (error) {
      console.error("ERROR", error.message);
      return res.status(500).json({ message: error.message, error });
    }
  }
);

// @route		GET api/profiles
// @desc		get list of profiles
// @access	private
router.get("/", auth, async (req, res) => {
  try {
    const profiles = await Profile.find({}, { name: 1, avatar: 1, skills: 1 });
    return res.json(profiles);
  } catch (error) {
    console.error("ERROR", error.message);
    return res.status(500).json({ message: error.message, error });
  }
});

// @route		GET api/profiles/self
// @desc		get logged in profile
// @access	owner
router.get("/self", authWithProfile, async (req, res) => {
  delete req.profile.userId;
  return res.json(req.profile);
});

module.exports = router;
