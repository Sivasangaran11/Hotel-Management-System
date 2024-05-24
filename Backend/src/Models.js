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
  reservee: { type: String, required: true },
});

const TableSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  accommodation: {
    type: String,
    required: true,
  },
  reservee: {
    type: String,
    required: true,
  },
  reserved: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);
const FoodItem = mongoose.model("FoodItem", foodItemSchema);
const CartItem = mongoose.model("CartItem", CartItemSchema);
const Table = mongoose.model("Table", TableSchema);
module.exports = { User, FoodItem, CartItem, Table };
