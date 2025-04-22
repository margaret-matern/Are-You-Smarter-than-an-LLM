import { apiRequest } from "./queryClient";
import { QuestionData, BattleSettings } from "@shared/schema";

// Function to generate questions
export async function generateQuestions(settings: BattleSettings): Promise<QuestionData[]> {
  try {
    const response = await apiRequest("POST", "/api/questions/generate", settings);
    const data = await response.json();
    return data.questions;
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to generate questions");
  }
}

// Function to get AI's answer to a question
export async function getAIAnswer(question: string, options: string[]): Promise<string> {
  try {
    const response = await apiRequest("POST", "/api/ai/answer", { question, options });
    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error("Error getting AI answer:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get AI's answer");
  }
}

// Function to save battle results
export async function saveBattleResults(battleResult: any) {
  try {
    const response = await apiRequest("POST", "/api/battles", battleResult);
    return await response.json();
  } catch (error) {
    console.error("Error saving battle results:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to save battle results");
  }
}
