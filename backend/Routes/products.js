const express = require("express");
const router = express.Router();
const productController = require("../Controllers/products");
const userAccess = require("../middlewares/access");

const isAuth = require("../middlewares/auth");

router.get("/getProducts", productController.getProducts);

router.get("/:productId", productController.getProduct);

router.post(
  "/prod",
  isAuth,
  userAccess.grantAccess("createAny", "Post", "Admin"),
  productController.createProduct
);

router.put("/prod/:productId", isAuth, productController.updateProduct);
router.delete(
  "/admin/prod/:productId",
  isAuth,
  userAccess.grantAccess("deleteAny", "Post", "Admin"),
  productController.deleteProduct
);

module.exports = router;
