const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  console.log("in Auth MiddleWare", authHeader);

  if (!authHeader) {
    console.log("auth header does not found");
    const error = new Error("Not Authenticated!");
    error.statuCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "somesupersecret");
    console.log("Decoded Token : ", decodedToken);
  } catch (err) {
    const error = new Error("Token is not signed");
    error.statusCode = 500;
    throw error;
  }
  if (!decodedToken) {
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;

  next();
};
