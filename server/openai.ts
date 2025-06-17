import OpenAI from "openai";

// OpenAI model selection - can be changed to a smaller model if needed
// Options include: "gpt-3.5-turbo", "gpt-4-turbo", or "gpt-4o"
const OPENAI_MODEL = "gpt-4o";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateQuestions(
  difficulty: string,
  numQuestions: number,
) {
  try {
    console.log(
      `Generating ${numQuestions} unique vocabulary questions at ${difficulty} difficulty...`,
    );

    // Generate all questions in a single batch request
    return await generateQuestionBatch(difficulty, numQuestions, 1, 1);
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
}

// Helper function to generate a batch of questions
async function generateQuestionBatch(difficulty: string, numQuestions: number, batchNumber: number, totalBatches: number) {
  try {
    // Create a system message that strongly emphasizes uniqueness
    const systemMessage = `You are a vocabulary expert who creates challenging and educational questions about words, their meanings, and relationships.

Your specialty is creating varied and diverse questions that never repeat vocabulary words.
${totalBatches > 1 ? `This is batch ${batchNumber} of ${totalBatches}, so ensure you use different vocabulary than you would in other batches.` : ''}
Each question must focus on a distinct vocabulary concept with no word overlap between questions.

When creating questions at "${difficulty}" difficulty level:
- Easy: Use common vocabulary words that most high school students would know
- Medium: Use moderately challenging words that a college-educated person would know
- Hard: Use advanced vocabulary that might appear on graduate school exams
- Mixed: Include a balanced mix of all difficulty levels`;

    // Make request with enhanced uniqueness instructions
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: `Generate ${numQuestions} completely unique vocabulary questions with the following requirements:
          - Approximately 60% should be multiple choice questions about word definitions (type: "mcq")
          - Approximately 40% should be analogy questions (type: "analogy")
          - All questions should be at ${difficulty} difficulty level
          - Each question should have exactly 4 options (A, B, C, D)
          - Include the correct answer and a detailed explanation for each question
          - DIVERSITY IS CRITICAL: Each question must focus on completely different vocabulary words
          - For MCQs, each must ask about a different word - DO NOT reuse any vocabulary words between questions
          - For analogies, follow the format "WORD1 is to WORD2 as WORD3 is to: [options]" with unique word pairs
          - Use a wide variety of word types (nouns, verbs, adjectives, adverbs) across all questions
          
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
      response_format: { type: "json_object" },
      temperature: 0.7 // Balanced creativity and consistency
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
          content: "You are answering a vocabulary or analogy question. Select the correct answer from the available options."
        },
        {
          role: "user",
          content: `Answer this vocabulary or analogy question by selecting ONE option from the following choices.
          
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
