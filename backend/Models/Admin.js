const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Admin",
    enum: ["Admin", "User"],
  },
  createdProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

// adminUserSchema.methods.addToCreatedProducts = function() {

// }

module.exports = mongoose.model("Admin", adminUserSchema);
