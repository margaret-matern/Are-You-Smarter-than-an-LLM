import React, { createContext, useContext, useState, ReactNode } from "react";
import { BattleSettings, QuestionData, BattleResult } from "@shared/schema";
import { useLocation } from "wouter";
import { generateQuestions, getAIAnswer, saveBattleResults } from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";

interface BattleContextType {
  // Settings
  settings: BattleSettings;
  updateSettings: (settings: Partial<BattleSettings>) => void;
  
  // Questions
  questions: QuestionData[];
  currentQuestionIndex: number;
  getCurrentQuestion: () => QuestionData | undefined;
  
  // Battle state
  isLoading: boolean;
  isBattleStarted: boolean;
  isBattleCompleted: boolean;
  showingExplanation: boolean;
  
  // Answers
  selectedAnswer: string | null;
  userAnswers: (string | null)[];
  aiAnswers: (string | null)[];
  userScore: number;
  aiScore: number;
  
  // Timer
  remainingTime: number;
  timerDisplay: string;
  
  // Answer state
  userCorrect: boolean;
  aiCorrect: boolean;
  aiAnswer: string | null;
  
  // Actions
  startBattle: () => Promise<void>;
  selectAnswer: (answer: string) => void;
  checkAnswer: () => Promise<void>;
  nextQuestion: () => void;
  previousQuestion: () => void;
  finishBattle: () => void;
  restartBattle: () => void;
}

const defaultSettings: BattleSettings = {
  difficulty: "medium",
  numQuestions: 5,
  enableTimer: true
};

const BattleContext = createContext<BattleContextType | undefined>(undefined);

export function BattleProvider({ children }: { children: ReactNode }) {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  
  // Settings
  const [settings, setSettings] = useState<BattleSettings>(defaultSettings);
  
  // Questions
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Battle state
  const [isLoading, setIsLoading] = useState(false);
  const [isBattleStarted, setIsBattleStarted] = useState(false);
  const [isBattleCompleted, setIsBattleCompleted] = useState(false);
  const [showingExplanation, setShowingExplanation] = useState(false);
  
  // Answers
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [aiAnswers, setAiAnswers] = useState<(string | null)[]>([]);
  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  
  // Timer
  const [remainingTime, setRemainingTime] = useState(30);
  const [timerDisplay, setTimerDisplay] = useState("30s");
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  
  // Answer state
  const [userCorrect, setUserCorrect] = useState(false);
  const [aiCorrect, setAiCorrect] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  
  // Update settings
  const updateSettings = (newSettings: Partial<BattleSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  // Get current question
  const getCurrentQuestion = (): QuestionData | undefined => {
    return questions[currentQuestionIndex];
  };
  
  // Start battle
  const startBattle = async () => {
    try {
      setIsLoading(true);
      
      // Generate questions
      const generatedQuestions = await generateQuestions(settings);
      
      // Initialize state
      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setUserScore(0);
      setAiScore(0);
      setUserAnswers(Array(generatedQuestions.length).fill(null));
      setAiAnswers(Array(generatedQuestions.length).fill(null));
      setSelectedAnswer(null);
      setShowingExplanation(false);
      setIsBattleStarted(true);
      setIsBattleCompleted(false);
      
      // Start timer if enabled
      if (settings.enableTimer) {
        startTimer();
      }
      
      // Navigate to battle page
      navigate("/battle");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start battle",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Select answer
  const selectAnswer = (answer: string) => {
    setSelectedAnswer(answer);
  };
  
  // Check answer
  const checkAnswer = async () => {
    if (!selectedAnswer) return;
    
    try {
      const currentQuestion = getCurrentQuestion();
      if (!currentQuestion) return;
      
      // Stop timer
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      
      // Update user answers
      const newUserAnswers = [...userAnswers];
      newUserAnswers[currentQuestionIndex] = selectedAnswer;
      setUserAnswers(newUserAnswers);
      
      // Check if user is correct
      const isUserCorrect = selectedAnswer === currentQuestion.correctAnswer;
      setUserCorrect(isUserCorrect);
      
      // Update user score
      if (isUserCorrect) {
        setUserScore(prev => prev + 1);
      }
      
      // Get AI answer
      const aiResponseAnswer = await getAIAnswer(currentQuestion.question, currentQuestion.options);
      setAiAnswer(aiResponseAnswer);
      
      // Update AI answers
      const newAiAnswers = [...aiAnswers];
      newAiAnswers[currentQuestionIndex] = aiResponseAnswer;
      setAiAnswers(newAiAnswers);
      
      // Check if AI is correct
      const isAiCorrect = aiResponseAnswer === currentQuestion.correctAnswer;
      setAiCorrect(isAiCorrect);
      
      // Update AI score
      if (isAiCorrect) {
        setAiScore(prev => prev + 1);
      }
      
      // Show explanation
      setShowingExplanation(true);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to check answer",
        variant: "destructive"
      });
    }
  };
  
  // Next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetQuestionState();
      
      if (settings.enableTimer) {
        startTimer();
      }
    } else {
      finishBattle();
    }
  };
  
  // Previous question
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      
      // Restore previous state
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1]);
      setShowingExplanation(userAnswers[currentQuestionIndex - 1] !== null);
      setAiAnswer(aiAnswers[currentQuestionIndex - 1]);
      
      // Stop timer
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      
      // Set correct/incorrect states
      if (userAnswers[currentQuestionIndex - 1] !== null) {
        const prevQuestion = questions[currentQuestionIndex - 1];
        setUserCorrect(userAnswers[currentQuestionIndex - 1] === prevQuestion.correctAnswer);
        setAiCorrect(aiAnswers[currentQuestionIndex - 1] === prevQuestion.correctAnswer);
      }
    }
  };
  
  // Finish battle
  const finishBattle = () => {
    setIsBattleStarted(false);
    setIsBattleCompleted(true);
    
    // Stop timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    // Navigate to results page
    navigate("/results");
    
    // Save battle results
    const battleResult: BattleResult = {
      userScore,
      aiScore,
      totalQuestions: questions.length,
      userAnswers,
      aiAnswers,
      questions
    };
    
    saveBattleResults(battleResult).catch(error => {
      toast({
        title: "Error",
        description: "Failed to save battle results, but you can still view them",
        variant: "destructive"
      });
    });
  };
  
  // Restart battle
  const restartBattle = () => {
    setIsBattleCompleted(false);
    setIsBattleStarted(false);
    resetQuestionState();
    navigate("/");
  };
  
  // Reset question state
  const resetQuestionState = () => {
    setSelectedAnswer(null);
    setShowingExplanation(false);
    setUserCorrect(false);
    setAiCorrect(false);
    setAiAnswer(null);
    setRemainingTime(30);
    setTimerDisplay("30s");
  };
  
  // Start timer
  const startTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    setRemainingTime(30);
    setTimerDisplay("30s");
    
    const interval = window.setInterval(() => {
      setRemainingTime(prev => {
        const newTime = prev - 1;
        setTimerDisplay(`${newTime}s`);
        
        if (newTime <= 0) {
          clearInterval(interval);
          
          // Auto-submit if time runs out
          if (!showingExplanation && selectedAnswer === null) {
            // If no answer selected, choose random answer
            const currentQuestion = getCurrentQuestion();
            if (currentQuestion) {
              const randomIndex = Math.floor(Math.random() * currentQuestion.options.length);
              setSelectedAnswer(currentQuestion.options[randomIndex]);
              checkAnswer();
            }
          }
        }
        
        return newTime;
      });
    }, 1000);
    
    setTimerInterval(interval);
  };
  
  return (
    <BattleContext.Provider
      value={{
        // Settings
        settings,
        updateSettings,
        
        // Questions
        questions,
        currentQuestionIndex,
        getCurrentQuestion,
        
        // Battle state
        isLoading,
        isBattleStarted,
        isBattleCompleted,
        showingExplanation,
        
        // Answers
        selectedAnswer,
        userAnswers,
        aiAnswers,
        userScore,
        aiScore,
        
        // Timer
        remainingTime,
        timerDisplay,
        
        // Answer state
        userCorrect,
        aiCorrect,
        aiAnswer,
        
        // Actions
        startBattle,
        selectAnswer,
        checkAnswer,
        nextQuestion,
        previousQuestion,
        finishBattle,
        restartBattle
      }}
    >
      {children}
    </BattleContext.Provider>
  );
}

export function useBattle() {
  const context = useContext(BattleContext);
  if (context === undefined) {
    throw new Error("useBattle must be used within a BattleProvider");
  }
  return context;
}
