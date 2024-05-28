const express = require("express");
const mongoose = require("mongoose");
const routes = require("./src/Routes");
const cors = require("cors");
require("dotenv").config(); 

const app = express();
app.use(express.json());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

// Enable CORS
app.use(cors());

// Use routes
app.use("/api", routes);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
