const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true, maxlength: 60  },
  role: {
    type: String,
    enum: ["Customer", "Staff", "Manager", "Admin"],
    default: "Customer", // Default role for new users
  },
});

const foodItemSchema = new mongoose.Schema({
  ItemName: { type: String, required: true },
  price: { type: Number, required: true },
  source: { type: String, required: true },
});

const CartItemSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  orderedDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  items: [
    {
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodItem", 
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalprice: {
    type: Number,
    required: true,
  },
  received: {
    type: Boolean,
    required: true,
    default: false, // Initially, order is not received
  },
  reservee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const TableSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  accommodation: { type: String, required: true },
  reserved: { type: Boolean, default: false },
  availableTimeSlots: { type: [String], default: [] },
});

const reservedTableSchema = new mongoose.Schema({
  reservee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  table: {
    number: { type: Number, required: true },
    time: { type: String, required: true },
    date: { type: String, required: true },
    accommodation: { type: String, required: true },
  },
});




const refreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiryDate: { type: Date, required: true }
});

const User = mongoose.model("User", userSchema);
const FoodItem = mongoose.model("FoodItem", foodItemSchema);
const CartItem = mongoose.model("CartItem", CartItemSchema);
const reservedTable = mongoose.model("reservedTable", reservedTableSchema);
const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
const Table = mongoose.model("Table", TableSchema);
module.exports = { User, FoodItem, CartItem, Table, reservedTable, RefreshToken };
