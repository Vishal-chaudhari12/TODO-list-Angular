
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");


dotenv.config();
const app = express();

// Middleware
app.use(express.json());

app.use(cors());
app.use(cors({ origin: "*" }));

// Database Connection with better error handling
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

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

