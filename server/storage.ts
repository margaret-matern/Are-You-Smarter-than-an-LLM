import { 
  battles, 
  type Battle, 
  type InsertBattle,
  battleAnswers,
  type BattleAnswer,
  type InsertBattleAnswer,
  questions,
  type Question,
  type InsertQuestion,
  type BattleResult,
  type QuestionData,
  users,
  type User,
  type InsertUser 
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Question methods
  saveQuestion(question: QuestionData): Promise<Question>;
  getQuestionById(id: number): Promise<Question | undefined>;
  
  // Battle methods
  saveBattleResult(result: BattleResult): Promise<Battle>;
  getBattleById(id: number): Promise<Battle | undefined>;
  getBattleHistory(): Promise<Battle[]>;
  
  // Battle Answer methods
  saveBattleAnswer(battleAnswer: InsertBattleAnswer): Promise<BattleAnswer>;
  getBattleAnswers(battleId: number): Promise<BattleAnswer[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private questionsMap: Map<number, Question>;
  private battlesMap: Map<number, Battle>;
  private battleAnswersMap: Map<number, BattleAnswer>;
  private userIdCounter: number;
  private questionIdCounter: number;
  private battleIdCounter: number;
  private battleAnswerIdCounter: number;

  constructor() {
    this.users = new Map();
    this.questionsMap = new Map();
    this.battlesMap = new Map();
    this.battleAnswersMap = new Map();
    this.userIdCounter = 1;
    this.questionIdCounter = 1;
    this.battleIdCounter = 1;
    this.battleAnswerIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Question methods
  async saveQuestion(questionData: QuestionData): Promise<Question> {
    const id = this.questionIdCounter++;
    const now = new Date();
    const question: Question = {
      id,
      type: questionData.type,
      question: questionData.question,
      options: questionData.options,
      correctAnswer: questionData.correctAnswer,
      explanation: questionData.explanation,
      difficulty: questionData.difficulty,
      createdAt: now
    };
    this.questionsMap.set(id, question);
    return question;
  }

  async getQuestionById(id: number): Promise<Question | undefined> {
    return this.questionsMap.get(id);
  }

  // Battle methods
  async saveBattleResult(result: BattleResult): Promise<Battle> {
    const id = this.battleIdCounter++;
    const now = new Date();
    
    // Save the battle record
    const battle: Battle = {
      id,
      userScore: result.userScore,
      aiScore: result.aiScore,
      totalQuestions: result.totalQuestions,
      difficulty: result.questions[0]?.difficulty || "medium",
      createdAt: now
    };
    this.battlesMap.set(id, battle);
    
    // Save each question and battle answer
    for (let i = 0; i < result.questions.length; i++) {
      const question = result.questions[i];
      const savedQuestion = await this.saveQuestion(question);
      
      // Save battle answer
      const battleAnswer: InsertBattleAnswer = {
        battleId: id,
        questionId: savedQuestion.id,
        userAnswer: result.userAnswers[i] || null,
        aiAnswer: result.aiAnswers[i] || null,
        isUserCorrect: result.userAnswers[i] === question.correctAnswer,
        isAiCorrect: result.aiAnswers[i] === question.correctAnswer
      };
      
      await this.saveBattleAnswer(battleAnswer);
    }
    
    return battle;
  }

  async getBattleById(id: number): Promise<Battle | undefined> {
    return this.battlesMap.get(id);
  }

  async getBattleHistory(): Promise<Battle[]> {
    return Array.from(this.battlesMap.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  // Battle Answer methods
  async saveBattleAnswer(battleAnswer: InsertBattleAnswer): Promise<BattleAnswer> {
    const id = this.battleAnswerIdCounter++;
    const answer: BattleAnswer = {
      id,
      battleId: battleAnswer.battleId,
      questionId: battleAnswer.questionId,
      userAnswer: battleAnswer.userAnswer ?? null,
      aiAnswer: battleAnswer.aiAnswer ?? null,
      isUserCorrect: battleAnswer.isUserCorrect,
      isAiCorrect: battleAnswer.isAiCorrect,
    };
    this.battleAnswersMap.set(id, answer);
    return answer;
  }

  async getBattleAnswers(battleId: number): Promise<BattleAnswer[]> {
    return Array.from(this.battleAnswersMap.values())
      .filter(answer => answer.battleId === battleId);
  }
}

export const storage = new MemStorage();
