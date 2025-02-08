import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
const router = Router();

const genAI = new GoogleGenerativeAI("AIzaSyA2RSxlb4AIi3g1YrxpskNQMuwpuQ-0lHA");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

router.post("/ask", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).send("Question is required");
  }
  const response = await model.generateContent(question);
  res.send(response);
});

export default router;
