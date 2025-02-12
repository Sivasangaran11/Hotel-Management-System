const jwt = require('jsonwebtoken');
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET; 
const storage = require('./Controllers')
const multer = require("multer");
const upload = multer({ storage });

//JWT token authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

//Admin Authentication

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); 
    req.user = decoded; // Populate req.user with the token payload
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next(); // Proceed to the next middleware
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

//Admin or manager authentication for Food items management

const verifyAdminOrManager = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;

    if (req.user.role === 'Admin' || req.user.role === 'Manager') {
      next();
    } else {
      console.log("Access Denied: User Role -", req.user.role); // Debugging
      return res.status(403).json({ message: "Access denied. Admins and Managers only." });
    }
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};



module.exports = {authenticateToken, verifyAdmin, verifyAdminOrManager, upload};