import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateQuestions, getAIAnswer } from "./openai";
import { battleSettingsSchema, questionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate questions for a battle
  app.post("/api/questions/generate", async (req, res) => {
    try {
      const settings = battleSettingsSchema.parse(req.body);
      const questions = await generateQuestions(
        settings.difficulty,
        settings.numQuestions
      );
      res.json({ questions });
    } catch (error) {
      console.error("Error generating questions:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate questions" 
      });
    }
  });

  // Get AI's answer to a specific question
  app.post("/api/ai/answer", async (req, res) => {
    try {
      const body = z.object({
        question: z.string(),
        options: z.array(z.string())
      }).parse(req.body);

      const aiAnswer = await getAIAnswer(body.question, body.options);
      res.json({ answer: aiAnswer });
    } catch (error) {
      console.error("Error getting AI answer:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get AI answer" 
      });
    }
  });

  // Save battle results
  app.post("/api/battles", async (req, res) => {
    try {
      const battleResult = req.body;
      const savedBattle = await storage.saveBattleResult(battleResult);
      res.json(savedBattle);
    } catch (error) {
      console.error("Error saving battle:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to save battle results" 
      });
    }
  });

  // Get battle history
  app.get("/api/battles", async (_req, res) => {
    try {
      const battles = await storage.getBattleHistory();
      res.json(battles);
    } catch (error) {
      console.error("Error getting battle history:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to retrieve battle history" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
