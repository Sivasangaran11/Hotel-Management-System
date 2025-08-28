const bcrypt = require("bcryptjs");
const { User, FoodItem, CartItem,Table, reservedTable, RefreshToken } = require("./Models");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    SECRET_KEY,
    {
      expiresIn: "15m",
    }
  );
};

const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign(
    { id: user._id, email: user.email },
    REFRESH_SECRET_KEY,
    { expiresIn: "7d" }
  );
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);

  const newRefreshToken = new RefreshToken({
    token: refreshToken,
    userId: user._id,
    expiryDate: expiryDate,
  });

  await newRefreshToken.save();
  return refreshToken;
};

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
    const role = "Customer";

    const user = new User({
      name,
      email,
      address,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "User does not exist. Please register." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const token = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    // Set refresh token in HTTP-only Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevents JavaScript access
      secure: true, // Only send over HTTPS (set `false` for local development)
      sameSite: "None", // Cross-origin requests (needed if frontend & backend are separate)
      path: "/", // Cookie available to all routes
      maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 days
    });

    // Send tokens to client
    res.json({ token, refreshToken, userId: user._id });
  } catch (error) {
    console.error("Error logging in:", error);
    res
      .status(500)
      .json({ message: "Failed to login. Please try again later." });
  }
};

const logOut = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; // Retrieve from cookies 

    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token found" });
    }

    // Delete refresh token from the database
    await RefreshToken.deleteOne({ token: refreshToken });

    // Clear refresh token cookie (if stored in cookies)
    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "None" });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

//Refresh token

const refreshToken = async (req, res) => {
  const { token: requestToken } = req.body;

  if (!requestToken) {
    return res.status(403).json({ message: "Refresh Token is required" });
  }

  try {
    const refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      return res
        .status(403)
        .json({ message: "Refresh token is not in database!" });
    }

    if (refreshToken.expiryDate < new Date()) {
      await RefreshToken.findByIdAndRemove(refreshToken._id);
      return res.status(403).json({
        message: "Refresh token was expired. Please make a new login request",
      });
    }

    const user = await User.findById(refreshToken.userId);
    const newAccessToken = generateAccessToken(user);

    return res.json({ token: newAccessToken });
  } catch (err) {
    return res.status(500).send({ message: err });
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

const protectedRoute = (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
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

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("username email role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add a new food item
const addFoodItem = async (req, res) => {
  const { ItemName, price, quantity, source } = req.body;

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
      source,
    });

    await foodItem.save();
    res.status(201).json({ message: "Food item added successfully", foodItem });
  } catch (error) {
    console.error("Error adding food item:", error);
    res.status(500).json({ message: "Error adding food item" });
  }
};

// // Define Storage for Multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const imgPath = path.join(__dirname, "../../../frontend/public/img");

//     // Ensure directory exists
//     if (!fs.existsSync(imgPath)) {
//       fs.mkdirSync(imgPath, { recursive: true });
//     }

//     cb(null, imgPath); // Set upload directory
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate unique filename
//   },
// });

const uploadMenuImage = async (req, res) => {
  try {
    // Configure Multer Storage Inside the Controller
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        const imgPath = path.join(__dirname, "../../frontend/public/img");

        // Ensure directory exists
        if (!fs.existsSync(imgPath)) {
          fs.mkdirSync(imgPath, { recursive: true });
        }

        cb(null, imgPath); // Set upload directory
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate unique filename
      },
    });

    // Apply Multer Storage Per Request
    const upload = multer({ storage }).single("image");

    upload(req, res, (err) => {
      if (err) {
        return res.status(500).json({ error: "Multer Error: " + err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const imageUrl = `${req.file.filename}`; // Path to use in frontend
      res.json({ imageUrl });
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteFoodItem = async (req, res) => {
  try {
    await FoodItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Food item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting food item", error });
  }
};

// // Controller Function to Handle Image Upload
// const uploadMenuImage = (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   const imageUrl = `${req.file.filename}`; // Path to use in frontend
//   res.json({ imageUrl });
// };

//Cart

const createOrder = async (req, res) => {
  try {
    const orderItems = req.body.map((item) => ({
      ...item,
    }));

    await CartItem.insertMany(orderItems);

    res.status(201).json({ message: "Order created successfully" });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

const getCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.find();
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart items", error });
  }
};

const getCartItemById = async (req, res) => {
  try {
    const cartItem = await CartItem.findById(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(200).json(cartItem);
  } catch (error) {
    console.error("Error fetching cart item:", error);
    res
      .status(500)
      .json({ message: "Error fetching cart item", error: error.message });
  }
};

const getCartItemsByReservee = async (req, res) => {
  try {
    const { reservee } = req.query;

    console.log("Received reservee:", reservee); // Debugging

    if (!reservee) {
      return res.status(400).json({ message: "Missing reservee parameter" });
    }

    if (!mongoose.Types.ObjectId.isValid(reservee)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const cartItems = await CartItem.find({ reservee }).populate("items.foodId");
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const updatedItem = await CartItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart item", error });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Cart item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting cart item", error });
  }
};

//Table

const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tables" });
  }
};

const addTable = async (req, res) => {
  try {
    const { accommodation } = req.body;
    const lastTable = await Table.findOne().sort("-number"); // Get last table number
    const newNumber = lastTable ? lastTable.number + 1 : 1;

    const newTable = new Table({
      number: newNumber,
      accommodation,
      availableTimeSlots: [
        "8am-9am", "9am-10am", "10am-11am", "11am-12pm", "12pm-1pm",
        "1pm-2pm", "2pm-3pm", "3pm-4pm", "4pm-5pm", "5pm-6pm",
        "6pm-7pm", "7pm-8pm", "8pm-9pm", "9pm-10pm", "10pm-11pm",
      ],
    });

    await newTable.save();
    res.json(newTable);
  } catch (error) {
    res.status(500).json({ error: "Error adding table" });
  }
};

const deleteTable = async (req, res) => {
  try {
    const { tableNumber } = req.params;
    await Table.findOneAndDelete({ number: tableNumber });

    // Reorder remaining tables
    const tables = await Table.find().sort("number");
    for (let i = 0; i < tables.length; i++) {
      tables[i].number = i + 1;
      await tables[i].save();
    }

    res.json({ message: "Table removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error removing table" });
  }
};

const reserveTable = async (req, res) => {
  try {
    const { reservee, table } = req.body;

    if (!reservee || !table) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const reservation = new reservedTable({
      reservee,
      table,
    });

    await reservation.save();
    res
      .status(201)
      .json({ message: "Table reserved successfully", reservation });
  } catch (error) {
    res.status(500).json({ message: "Error reserving table", error });
  }
};

// Get all tables
const getAllReservedTables = async (req, res) => {
  try {
    const tables = await reservedTable.find();
    res.status(200).send(tables);
  } catch (error) {
    res.status(400).send({ error: "Error fetching tables" });
  }
};

const getTableReservationsByUser = async (req, res) => {
  try {
    const { reservee } = req.query;

    let query = {};
    if (reservee) {
      query.reservee = reservee; // Filter reservations by userId
    }

    const reservations = await reservedTable.find(query);

    if (!reservations.length) {
      return res.status(404).json({ message: "No reservations found." });
    }

    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: "Error fetching reservations", error });
  }
};

const deleteTableReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReservation = await reservedTable.findByIdAndDelete(id);

    if (!deletedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ message: "Error deleting reservation", error });
  }
};

const cancelTableReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    await reservedTable.findByIdAndDelete(reservationId);
    res.status(200).json({ message: "Reservation canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error canceling reservation", error });
  }
};

//Assigning role to the users

const assignRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: `Role updated to ${user.role}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  login,
  logOut,
  refreshToken,
  protectedRoute,
  getUsers,
  getUserById,
  getAllFoodItems,
  addFoodItem,
  // storage,
  deleteFoodItem,
  uploadMenuImage,
  createOrder,
  getCartItems,
  getCartItemById,
  updateCartItem,
  deleteCartItem,
  getAllTables,
  addTable,
  deleteTable,
  reserveTable,
  getAllReservedTables,
  getTableReservationsByUser,
  cancelTableReservation,
  deleteTableReservation,
  assignRole,
  getCartItemsByReservee,
};
