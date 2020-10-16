const fs = require("fs");
const path = require("path");
const Product = require("../Models/Product");
const User = require("../Models/User");
const AdminUser = require("../Models/Admin");

exports.getProducts = (req, res, next) => {
  Product.find()
    .populate("creator")
    .then((posts) => {
      console.log(posts);
      res.status(200).json({
        message: "Posts Fetched Succcessfully",
        products: posts,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  console.log(productId);
  Product.findOne({ _id: productId })
    .populate("creator")
    .then((product) => {
      if (!product) {
        const error = new Error("No Product with the id was found");
        error.statusCode = 404;
        throw error;
      }
      res
        .status(200)
        .json({ message: "Product Fetched Successfully", product: product });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createProduct = (req, res, next) => {
  if (!req.file) {
    const error = new Error("No image Provided");
    error.statusCode = 422;
    console.log("file is not being fetching");
    throw error;
  }
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageUrl = req.file.path;

  // user;

  let creator;
  const post = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    creator: req.userId,
  });
  post
    .save()
    .then((result) => {
      return AdminUser.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.createdProducts.push(post);
      return user.save();
      // if(){}
    })
    .then((result) => {
      console.log("result : ", result);
      console.log("creator : ", creator);
      res.status(200).json({
        message: "Post Created Successfully",
        product: product,
        creator: { _id: creator._id, name: creator.name },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateProduct = (req, res, next) => {
  const productId = req.params.productId;
  const updatedTitle = req.body.title;
  const updatedimage = req.file.path;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  console.log(productId);
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        const error = new Error("No post with the id was found");
        error.statusCode = 404;
        throw error;
      }
      if (product.creator.toString() !== req.userId.toString()) {
        const error = new Error("Not authorized !");
        error.statusCode = 403;
        throw error;
      }
      clearPath(product.imageUrl);
      return Product.findByIdAndRemove(productId);
    })
    .then((result) => {
      AdminUser.findById(req.userId);
    })
    .then((user) => {
      user.createdProducts.pull(productId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post Deletion Successful" });
    })

    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearPath = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
