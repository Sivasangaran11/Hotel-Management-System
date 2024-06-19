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

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Test connection
 *     description: Check if the connection to the server is established.
 *     responses:
 *       200:
 *         description: Connection established.
 */
router.get("/", (req, res) => {
  res.send("Connection established");
});

// User routes
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user in the database.
 *     responses:
 *       201:
 *         description: User registered successfully.
 */
router.post("/users", registerUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get a list of users
 *     description: Retrieve a list of users from the database.
 *     responses:
 *       200:
 *         description: Successful response with a list of users.
 */
router.get("/users", getUsers);

// Menu routes
/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Get all food items
 *     description: Retrieve a list of all food items from the menu.
 *     responses:
 *       200:
 *         description: Successful response with a list of food items.
 */
router.get("/menu", getAllFoodItems);

/**
 * @swagger
 * /api/menu:
 *   post:
 *     summary: Add a new food item
 *     description: Add a new food item to the menu.
 *     responses:
 *       201:
 *         description: Food item added successfully.
 */
router.post("/menu", addFoodItem);

/**
 * @swagger
 * /api/menu/{id}:
 *   delete:
 *     summary: Delete a food item
 *     description: Delete a food item from the menu by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the food item to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Food item deleted successfully.
 */
router.delete("/menu/:id", deleteFoodItem);

// Cart routes
/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Create a new order
 *     description: Create a new order and add items to the cart.
 *     responses:
 *       201:
 *         description: Order created successfully.
 */
router.post('/cart', createOrder);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get all cart items
 *     description: Retrieve a list of all items in the cart.
 *     responses:
 *       200:
 *         description: Successful response with a list of cart items.
 */
router.get('/cart', getCartItems);

/**
 * @swagger
 * /api/cart/{id}:
 *   get:
 *     summary: Get a cart item by ID
 *     description: Retrieve a specific cart item by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cart item to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with the cart item details.
 */
router.get('/cart/:id', getCartItemById);

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Update a cart item by ID
 *     description: Update the details of a specific cart item by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cart item to update.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart item updated successfully.
 */
router.put('/cart/:id', updateCartItem);

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Delete a cart item by ID
 *     description: Delete a specific cart item by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cart item to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart item deleted successfully.
 */
router.delete('/cart/:id', deleteCartItem);

// Table routes
/**
 * @swagger
 * /api/table:
 *   post:
 *     summary: Reserve a table
 *     description: Reserve a table at the restaurant.
 *     responses:
 *       201:
 *         description: Table reserved successfully.
 */
router.post('/table', reserveTable);

/**
 * @swagger
 * /table:
 *   get:
 *     summary: Get all table reservations
 *     description: Retrieve a list of all table reservations.
 *     responses:
 *       200:
 *         description: Successful response with a list of table reservations.
 */
router.get('/api/table', getAllTables);

module.exports = router;
