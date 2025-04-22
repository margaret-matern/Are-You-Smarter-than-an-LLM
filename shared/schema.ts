import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Question types
export const questionTypes = ["mcq", "analogy"] as const;
export type QuestionType = typeof questionTypes[number];

// Question schema
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  question: text("question").notNull(),
  options: text("options").array().notNull(),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  difficulty: text("difficulty").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuestionSchema = createInsertSchema(questions).pick({
  type: true,
  question: true,
  options: true,
  correctAnswer: true,
  explanation: true,
  difficulty: true,
});

// Battle schema
export const battles = pgTable("battles", {
  id: serial("id").primaryKey(),
  userScore: integer("user_score").notNull(),
  aiScore: integer("ai_score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  difficulty: text("difficulty").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBattleSchema = createInsertSchema(battles).pick({
  userScore: true,
  aiScore: true,
  totalQuestions: true,
  difficulty: true,
});

// Battle Answers schema
export const battleAnswers = pgTable("battle_answers", {
  id: serial("id").primaryKey(),
  battleId: integer("battle_id").notNull(),
  questionId: integer("question_id").notNull(),
  userAnswer: text("user_answer"),
  aiAnswer: text("ai_answer"),
  isUserCorrect: boolean("is_user_correct").notNull(),
  isAiCorrect: boolean("is_ai_correct").notNull(),
});

export const insertBattleAnswerSchema = createInsertSchema(battleAnswers).pick({
  battleId: true,
  questionId: true,
  userAnswer: true,
  aiAnswer: true,
  isUserCorrect: true,
  isAiCorrect: true,
});

// API Schemas for frontend
export const questionSchema = z.object({
  id: z.number().optional(),
  type: z.enum(questionTypes),
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.string(),
  explanation: z.string(),
  difficulty: z.string(),
});

export const battleSettingsSchema = z.object({
  difficulty: z.string(),
  numQuestions: z.number().min(1),
  enableTimer: z.boolean(),
});

export const battleResultSchema = z.object({
  userScore: z.number(),
  aiScore: z.number(),
  totalQuestions: z.number(),
  userAnswers: z.array(z.string().nullable()),
  aiAnswers: z.array(z.string().nullable()),
  questions: z.array(questionSchema),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

export type InsertBattle = z.infer<typeof insertBattleSchema>;
export type Battle = typeof battles.$inferSelect;

export type InsertBattleAnswer = z.infer<typeof insertBattleAnswerSchema>;
export type BattleAnswer = typeof battleAnswers.$inferSelect;

export type QuestionData = z.infer<typeof questionSchema>;
export type BattleSettings = z.infer<typeof battleSettingsSchema>;
export type BattleResult = z.infer<typeof battleResultSchema>;
