const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Shim fetch for Node.js (fixes the 'fetch is not a function' error)
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

app.post("/fix-code", async (req, res) => {
  const { code } = req.body;

  const prompt = `You're an expert developer. Fix this code and explain what was wrong and how you fixed it:\n\n${code}`;

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-coder",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  const output = data.choices?.[0]?.message?.content || "No response";

  res.json({ result: output });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// Test change to trigger deployment
