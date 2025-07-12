// server/index.js
require("dotenv").config(); // FIRST LINE

const express = require("express");
const dotenv = require("dotenv");
const summarizeRoutes = require("./routes/summarize");

dotenv.config();
const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.get("/", (req, res) => {
  console.log("💥 Root route hit");

  res.send("✅ AI Summarizer API is running.");
});

app.use("/api/summarize", summarizeRoutes);

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
