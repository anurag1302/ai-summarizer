const express = require("express");
const router = express.Router();
const multer = require("multer");
const { parsePDF } = require("../services/pdfParser");
const { fetchAndCleanURL } = require("../services/urlParser");
const OpenAI = require("openai");
require("dotenv").config();

const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

// Summarize URL
router.post("/url", async (req, res) => {
  try {
    const { url } = req.body;
    const text = await fetchAndCleanURL(url);

    const summary = await summarizeText(text);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Summarize PDF
router.post("/pdf", upload.single("file"), async (req, res) => {
  try {
    const text = await parsePDF(req.file.path);
    const summary = await summarizeText(text);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function summarizeText(text) {
  const prompt = `Summarize the following content:\n\n${text.substring(
    0,
    3000
  )}`;

  const response = await openai.chat.completions.create({
    model: "openai/gpt-4.1-mini",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 300,
    temperature: 0.5,
  });

  return response.choices[0].message.content.trim();
}

module.exports = router;
