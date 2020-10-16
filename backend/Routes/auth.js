const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const authController = require("../Controllers/auth");
const User = require("../Models/User");

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid e-mail")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("User with the eamil already exist");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    // body("passwordConfirmation").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authController.SignUp
);
router.post("/login", authController.Login);

module.exports = router;
