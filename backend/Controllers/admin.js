const admin = require("../Models/Admin");
const products = require("../Models/Product");

exports.getProducts = (req, res, next) => {
  const userId = req.userId;
  admin
    .findById(userId)
    .then((user) => {
      //   console.log(user);
      if (!user) {
        const error = new Error("User with the id is not present");
        error.statusCode = 404;
        throw error;
      }
      return products.find({ creator: userId });
    })
    .then((products) => {
      if (!products) {
        const error = new Error("No Product found");
        error.statusCode = 422;
        throw error;
      }
      res.status(200).json({
        message: "All Product of current User Admin are fetched successfully",
        products: products,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  console.log(userId);
};
