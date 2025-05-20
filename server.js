const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Shim fetch for Node.js
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

app.post("/fix-code", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ result: "No code provided." });
    }

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-coder",
        messages: [{ role: "user", content: code }],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content || "No response";

    res.json({ result: output });
  } catch (err) {
    console.error("❌ DeepSeek API error:", err);
    res.status(500).json({ result: "Something went wrong on the server." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
