const express = require("express");
const {
  registerUser,
  getUsers,
  getAllFoodItems,
  addFoodItem,
  deleteFoodItem,
  createOrder,
  getCartItems,
  getCartItemById,
  updateCartItem,
  deleteCartItem,
  reserveTable,
  getAllTables
} = require("./Controllers");

const router = express.Router();
router.get("/", (req, res) => {
  res.send("Connection established");
});

// User routes
router.post("/users", registerUser);
router.get("/users", getUsers);

// Menu routes
router.get("/menu", getAllFoodItems);
router.post("/menu", addFoodItem);
router.delete("/menu/:id", deleteFoodItem);

// Cart routes  
router.post('/cart', createOrder);
router.get('/cart', getCartItems);
router.get('/cart/:id', getCartItemById);
router.put('/cart/:id', updateCartItem);
router.delete('/cart/:id', deleteCartItem);

//Table routes

router.post('/table', reserveTable);
router.get('/table', getAllTables);


module.exports = router;
