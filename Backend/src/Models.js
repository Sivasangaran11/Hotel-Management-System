const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
});

const foodItemSchema = new mongoose.Schema({
  ItemName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  source: { type: String, required: true },
  reservee: { type: String, default: null },
});

const CartItemSchema = new mongoose.Schema({
  foodId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  source: { type: String, required: true },
  reservee: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);
const FoodItem = mongoose.model("FoodItem", foodItemSchema);
const CartItem = mongoose.model("CartItem", CartItemSchema);

module.exports = { User, FoodItem, CartItem };
