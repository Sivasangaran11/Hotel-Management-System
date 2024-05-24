const express = require("express");
const mongoose = require("mongoose");
const routes = require("./Routes");
const cors = require("cors"); 

const app = express();
app.use(express.json());

const mongoURI =
  "mongodb+srv://SaapaduRestaurant:57CE366FEo02xsQ8@cluster0.mvdfqei.mongodb.net/Hotel-Database?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your MongoDB connection string
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

// Enable CORS
app.use(cors());

app.use("/api", routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
