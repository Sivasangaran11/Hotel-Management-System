const bcrypt = require("bcryptjs");
const { User, FoodItem, CartItem } = require("./Models");

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, address, phoneNumber, password } = req.body;

  if (!name || !email || !address || !phoneNumber || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists. Please login." });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new User({
      name,
      email,
      address,
      phoneNumber,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Get all food items
const getAllFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    res.json(foodItems);
  } catch (err) {
    console.error("Error fetching food items:", err);
    res.status(500).json({ message: "Error fetching food items" });
  }
};

// Add a new food item
const addFoodItem = async (req, res) => {
  const { ItemName, price, quantity, source, reservee } = req.body;

  if (!ItemName || !price || !source) {
    return res
      .status(400)
      .json({ message: "ItemName, price, and source are required" });
  }

  try {
    const existingFoodItem = await FoodItem.findOne({ ItemName });
    if (existingFoodItem) {
      return res.status(400).json({ message: "Food item already exists" });
    }

    const foodItem = new FoodItem({
      ItemName,
      price,
      quantity,
      source,
      reservee,
    });

    await foodItem.save();
    res.status(201).json({ message: "Food item added successfully", foodItem });
  } catch (error) {
    console.error("Error adding food item:", error);
    res.status(500).json({ message: "Error adding food item" });
  }
};

//Cart

const createOrder = async (req, res) => {
  try {
    const orderItems = req.body.map((item) => ({
      ...item,
    }));

    await CartItem.insertMany(orderItems);

    res.status(201).json({ message: "Order created successfully"});
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};


const getCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.find();
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart items', error });
  }
};

const getCartItemById = async (req, res) => {
  try {
    const cartItem = await CartItem.findById(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.status(200).json(cartItem);
  } catch (error) {
    console.error("Error fetching cart item:", error);
    res.status(500).json({ message: "Error fetching cart item", error: error.message });
  }
};


const updateCartItem = async(req, res) => {
  try {
    const updatedItem = await CartItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item', error });
  }
;}

const deleteCartItem = async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Cart item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting cart item', error });
  }
};

module.exports = {
  registerUser,
  getUsers,
  getAllFoodItems,
  addFoodItem,
  createOrder,
  getCartItems,
  getCartItemById,
  updateCartItem,
  deleteCartItem,
};
