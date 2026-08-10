const express = require("express");
const cors = require("cors");
require("dotenv").config();

const AMON = require("./amon-core.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("."));

/* ================================
   Health Check
================================ */

app.get("/health", (req, res) => {
  res.json({
    status: "online",
    name: "AMON AI",
    core: AMON.status,
    version: AMON.version
  });
});

/* ================================
   AMON Information
================================ */

app.get("/api/amon", (req, res) => {
  res.json(AMON.info());
});

/* ================================
   AMON Analysis
================================ */

app.post("/api/amon/analyze", (req, res) => {

  const { task } = req.body;

  if (!task || typeof task !== "string") {
    return res.status(400).json({
      success: false,
      message: "يرجى إرسال المهمة."
    });
  }

  const result = AMON.analyze(task);

  res.json({
    success: true,
    result
  });
});

/* ================================
   AMON Evaluation
================================ */

app.post("/api/amon/evaluate", (req, res) => {

  const { result } = req.body;

  const evaluation = AMON.evaluate(result);

  res.json({
    success: true,
    evaluation
  });
});

/* ================================
   AMON Comparison
================================ */

app.post("/api/amon/compare", (req, res) => {

  const { options } = req.body;

  const comparison = AMON.compare(options);

  res.json(comparison);
});

/* ================================
   AMON Improvement
================================ */

app.post("/api/amon/improve", (req, res) => {

  const { problem } = req.body;

  if (!problem) {
    return res.status(400).json({
      success: false,
      message: "يجب تحديد المشكلة."
    });
  }

  const improvement = AMON.improve(problem);

  res.json(improvement);
});

/* ================================
   Start Server
================================ */

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AMON AI is running on port ${PORT}`);
});
