const express = require("express");

const router = express.Router();
const isAuth = require("../middlewares/auth");
const adminController = require("../Controllers/admin");

router.get("/products", isAuth, adminController.getProducts);

module.exports = router;
