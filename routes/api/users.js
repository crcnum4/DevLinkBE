const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route		POST api/users
// @desc		create new user account
// @access	public
router.post(
  "/",
  [
    check("email", "Email Required").notEmpty(),
    check("email", "Invalid Email").isEmail(),
    check("handle", "Handle Required").notEmpty(),
    check("password", "Password must contain at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userData = {
        email: req.body.email.toLowerCase(),
        password: await bcrypt.hash(req.body.password, 10),
      };

      // check for existing items:
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        return res.status(400).json({
          errors: [
            {
              msg: "Account already exists, please login",
              param: "form",
              location: "body",
            },
          ],
        });
      }

      const existingHandle = await Profile.findOne({ handle: req.body.handle });
      console.log(existingHandle);
      if (existingHandle) {
        return res.status(400).json({
          errors: [
            {
              msg: "Handle already taken",
              param: "handle",
              location: "body",
            },
          ],
        });
      }

      const user = await User.create(userData);
      const payload = {
        id: user._id,
      };

      const token = await jwt.sign(payload, process.env.SECRET_OR_KEY, {});

      res.json({ token });
    } catch (error) {
      console.error("ERROR", error.message);
      return res.status(500).json({ message: error.message, error });
    }
  }
);

// @route		PUT api/users
// @desc		Login user account
// @access	public
router.put(
  "/",
  [
    check("password", "Password Required").notEmpty(),
    check("login", "Email or Password Required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let login = await User.findOne({ email: req.body.login.toLowerCase() });

      if (!login) {
        login = await Profile.findOne({ handle: req.body.login.toLowerCase() });
        if (!login)
          return res.status(400).json({
            errors: [
              {
                msg: "Invalid Login",
                param: "form",
                location: "body",
              },
            ],
          });
        login = await User.findById(login.userId);
      }

      const match = await bcrypt.compare(req.body.password, login.password);
      if (!match) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid Login",
              param: "form",
              location: "body",
            },
          ],
        });
      }

      const payload = {
        id: login._id,
      };

      const token = await jwt.sign(payload, process.env.SECRET_OR_KEY, {});

      return res.json({
        token,
      });
    } catch (error) {
      console.error("ERROR", error.message);
      return res.status(500).json({ message: error.message, error });
    }
  }
);

module.exports = router;
