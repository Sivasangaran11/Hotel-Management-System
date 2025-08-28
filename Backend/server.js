const express = require("express");
const mongoose = require("mongoose");
const http = require("http"); // Import HTTP module
const socketIo = require("socket.io");
const routes = require("./src/Routes");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const cookieParser = require("cookie-parser");

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());

// Validate environment variables
if (!process.env.MONGO_URI || !process.env.PORT) {
  throw new Error("MONGO_URI or PORT is not defined in the environment variables");
}

// Connect to MongoDB
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("CONNECTED TO DATABASE SUCCESSFULLY");
  } catch (error) {
    console.error("COULD NOT CONNECT TO DATABASE:", error.message);
    process.exit(1);
  }
})();

// Enable CORS
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Serve Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route to access raw Swagger JSON
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Middleware to attach socket.io to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Use routes
app.use("/api", routes);

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
