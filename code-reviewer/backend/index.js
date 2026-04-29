const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const { checkAndIncrement } = require("./utils/limit");
const CodeHistory = require("./models/CodeHistory");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "*", 
  }),
);
app.use(express.json());

mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/code-assistant",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/analyze", async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    const limit = await checkAndIncrement(ip);

    if (!limit.allowed) {
      return res.status(429).json({
        success: false,
        error: "Daily limit reached",
        message: "Free limit: 3 analyses/day. Pro version coming soon.",
      });
    } // ✅ yahan close karo

    const { code, issue, language } = req.body;
    const { code, issue, language } = req.body;

    const { code, issue, language } = req.body;

if (!code) {
  return res.status(400).json({ error: "Code is required" });
}

const cleanCode = code.trim();

if (cleanCode.length < 5) {
  return res.status(400).json({ error: "Invalid code input" });
}

if (cleanCode.length > 4000) {
  return res.status(400).json({ error: "Code too long (max 4000 chars)" });
}

if (!process.env.GEMINI_API_KEY) {
  return res.status(500).json({ error: "API key missing" });
}

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const analyzePrompt = `
You are a senior software engineer.

Analyze the following ${language || ""} code and return structured output:

🔴 Bugs / Errors:
- List all issues clearly

🟡 Code Smells / Bad Practices:
- Highlight bad patterns

🟢 Improvements:
- Suggest better approaches

🚀 Optimized Code:
- Provide improved version of code

Code:
${cleanCode}
`;

    const result = await model.generateContent(analyzePrompt);
    const response = await result.response;
    const debugResponse = response.text();

    const history = new CodeHistory({
      type: "analyze",
      prompt: issue || "Analyze request",
      code,
      language,
      response: debugResponse,
    });
    await history.save();

    res.json({
      success: true,
      analysis: debugResponse,
      remaining: limit.remaining,
    });
  } catch (error) {
    console.error("Analyze error:", error);
    res
      .status(500)
      .json({ error: "Failed to analyze code", details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
