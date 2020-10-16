const { validationResult } = require("express-validator/check");
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const AdminUser = require("../Models/Admin");
const jwt = require("jsonwebtoken");

exports.Login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const isAdmin = req.body.Admin;

  let loadedUser;
  if (!isAdmin) {
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          const error = new Error("A user with this e-mail is not registered");
          error.statusCode = 401;
          throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
      })
      .then((isEqual) => {
        if (!isEqual) {
          const error = new Error("Wrong Password !");
          error.statusCode = 401;
          throw error;
        }

        const token = jwt.sign(
          {
            email: loadedUser.email,
            userId: loadedUser._id.toString(),
          },
          "somesupersecret",
          { expiresIn: "1h" }
        );
        res
          .status(200)
          .json({ userId: loadedUser._id.toString(), token: token });

        // res.status(200).json({ userId: loadedUser._id.toString() });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  } else if (isAdmin) {
    AdminUser.findOne({ email: email })
      .then((user) => {
        console.log(user);
        if (!user) {
          const error = new Error("A user with this e-mail is not registered");
          error.statusCode = 401;
          throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
      })
      .then((isEqual) => {
        if (!isEqual) {
          const error = new Error("Wrong Password !");
          error.statusCode = 401;
          throw error;
        }

        const token = jwt.sign(
          {
            email: loadedUser.email,
            userId: loadedUser._id.toString(),
          },
          "somesupersecret",
          { expiresIn: "1h" }
        );
        res
          .status(200)
          .json({ userId: loadedUser._id.toString(), token: token });

        // res.status(200).json({ userId: loadedUser._id.toString() });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }
};

exports.SignUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("User SignUp Validation Failed !");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const username = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const isAdmin = req.body.isAdmin;
  console.log(isAdmin);
  if (!isAdmin) {
    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          email: email,
          password: hashedPassword,
          name: username,
          role: "User",
        });
        return user.save();
      })
      .then((result) => {
        res
          .status(201)
          .json({ message: "User Created Successfully !", userId: result._id });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  } else if (isAdmin) {
    console.log("executing admin Route");
    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const adminUser = new AdminUser({
          name: username,
          email: email,
          password: hashedPassword,
          role: "Admin",
        });
        return adminUser.save();
      })
      .then((result) => {
        res.status(200).json({
          message: "Admin User Created Successfully !",
          userId: result.id,
        });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }
};
