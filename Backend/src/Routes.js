const express = require("express");
const {
  registerUser,
  getUsers,
  getAllFoodItems,
  addFoodItem,
  createOrder,
  getCartItems,
  getCartItemById,
  updateCartItem,
  deleteCartItem
} = require("./Controllers");

const router = express.Router();

// User routes
router.post("/users", registerUser);
router.get("/users", getUsers);

// Menu routes
router.get("/menu", getAllFoodItems);
router.post("/menu", addFoodItem);

// Cart routes  
router.post('/cart', createOrder);
router.get('/cart', getCartItems);
router.get('/cart/:id', getCartItemById);
router.put('/cart/:id', updateCartItem);
router.delete('/cart/:id', deleteCartItem);

module.exports = router;
