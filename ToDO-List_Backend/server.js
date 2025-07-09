
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
require("dotenv").config();


dotenv.config();
const app = express();

// Middleware
app.use(express.json());

app.use(cors());
app.use(cors({ origin: "*" }));

// Database Connection with better error handling
mongoose
  .connect(`mongodb+srv://${process.env.Db_username}:${process.env.Db_pass}@cluster0.4bmfh.mongodb.net/Testing?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    
  })
  .then(() => {
    console.log("MongoDB Connected");
  })

// Routes
const employeeRoutes = require("./routes/employee");



// Serve uploaded files statically

app.use("/employee",employeeRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

