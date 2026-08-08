const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("."));

app.get("/health", (req, res) => {
  res.json({
    status: "online",
    name: "AMON AI",
    message: "AMON Core is running"
  });
});

app.get("/api/amon", (req, res) => {
  res.json({
    name: "AMON AI",
    role: "Central Thinking Core",
    status: "ready"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AMON AI is running on port ${PORT}`);
});
