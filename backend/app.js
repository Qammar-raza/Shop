const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const authRoute = require("./Routes/auth");
const productRoutes = require("./Routes/products");
const adminRoutes = require("./Routes/admin");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("imageUrl")
);

// app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET ,POST ,PUT , PATCH ,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-type  , Authorization"
  );
  next();
});

app.use("/auth", authRoute);
app.use("/product", productRoutes);
app.use("/admin", adminRoutes);
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = req.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect("mongodb://localhost/first-mern-app-database")
  .then(() => {
    app.listen(8080);
    console.log("Connected to the Database!");
  })
  .catch((err) => console.log(err));
