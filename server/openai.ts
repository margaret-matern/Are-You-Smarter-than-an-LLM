import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const OPENAI_MODEL = "gpt-4o";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateQuestions(difficulty: string, numQuestions: number) {
  try {
    // For large number of questions, break into smaller batches
    if (numQuestions > 5) {
      console.log(`Generating ${numQuestions} questions in batches...`);
      
      // Generate questions in batches of 5
      const batches = Math.ceil(numQuestions / 5);
      const batchResults = [];
      
      for (let i = 0; i < batches; i++) {
        const batchSize = Math.min(5, numQuestions - (i * 5));
        console.log(`Generating batch ${i+1}/${batches} with ${batchSize} questions...`);
        
        const batchQuestions = await generateQuestionBatch(difficulty, batchSize);
        batchResults.push(...batchQuestions);
        
        // Make sure we have enough questions
        if (batchResults.length >= numQuestions) {
          break;
        }
      }
      
      // Return the requested number of questions
      return batchResults.slice(0, numQuestions);
    } else {
      // Generate a single batch for 5 or fewer questions
      return await generateQuestionBatch(difficulty, numQuestions);
    }
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
}

// Helper function to generate a batch of questions
async function generateQuestionBatch(difficulty: string, numQuestions: number) {
  try {
    // Make sure to use varied vocabulary and avoid duplicates
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a vocabulary expert who creates challenging and educational questions about words, their meanings, and relationships. Use diverse vocabulary words without repetition."
        },
        {
          role: "user",
          content: `Generate ${numQuestions} vocabulary questions with the following requirements:
          - Approximately 60% should be multiple choice questions about word definitions (type: "mcq")
          - Approximately 40% should be analogy questions (type: "analogy")
          - All questions should be at ${difficulty} difficulty level
          - Each question should have exactly 4 options (A, B, C, D)
          - Include the correct answer and a detailed explanation for each question
          - For MCQs, use diverse vocabulary words - DO NOT repeat words across questions
          - For analogies, follow the format "WORD1 is to WORD2 as WORD3 is to: [options]"
          - Use different types of words (nouns, verbs, adjectives) across questions
          
          Respond with a JSON array named "questions" where each question object has these properties:
          - type: "mcq" or "analogy"
          - question: the question text
          - options: array of 4 string options
          - correctAnswer: the correct option string (must exactly match one of the options)
          - explanation: detailed explanation of the answer
          - difficulty: "${difficulty}"
          `
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    const result = JSON.parse(content);
    return result.questions || [];
  } catch (error) {
    console.error("Error generating question batch:", error);
    throw error;
  }
}

export async function getAIAnswer(question: string, options: string[]) {
  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are answering a vocabulary question to the best of your ability. Select only one of the provided options as your answer."
        },
        {
          role: "user",
          content: `Answer this vocabulary question by selecting ONE option from the following choices.
          
          Question: ${question}
          
          Options:
          ${options.map((option, index) => `${['A', 'B', 'C', 'D'][index]}. ${option}`).join('\n')}
          
          Respond with a JSON object with a single property "answer" that contains the exact text of your chosen option (not the letter).`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    const result = JSON.parse(content);
    return result.answer || options[0]; // Default to first option if no answer
  } catch (error) {
    console.error("Error getting AI answer:", error);
    throw error;
  }
}
