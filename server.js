const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());  
app.use(bodyParser.json());  

// Sample API Route
app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));