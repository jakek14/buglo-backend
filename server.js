const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

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

app.listen(3001, () => {
  console.log("✅ Server running on http://localhost:3001");
});
