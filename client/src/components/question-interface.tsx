import React from "react";
import { useBattle } from "@/contexts/battle-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const QuestionInterface: React.FC = () => {
  const {
    questions,
    currentQuestionIndex,
    getCurrentQuestion,
    showingExplanation,
    selectedAnswer,
    userAnswers,
    aiAnswers,
    userScore,
    aiScore,
    remainingTime,
    timerDisplay,
    userCorrect,
    aiCorrect,
    aiAnswer,
    settings,
    selectAnswer,
    checkAnswer,
    nextQuestion,
    previousQuestion,
    finishBattle
  } = useBattle();

  const currentQuestion = getCurrentQuestion();
  if (!currentQuestion) return null;

  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;

  // Timer class based on remaining time
  const getTimerClass = () => {
    if (remainingTime > 15) return "timer-normal";
    if (remainingTime > 5) return "timer-warning";
    return "timer-danger";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Progress and Scores */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm text-neutral-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            {settings.enableTimer && (
              <div className="flex items-center text-sm font-medium ml-4">
                <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium", getTimerClass())}>
                  {timerDisplay}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">You:</span>
              <span className="text-sm font-bold text-primary">{userScore}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">AI:</span>
              <span className="text-sm font-bold text-secondary">{aiScore}</span>
            </div>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2.5" />
      </div>

      {/* Question Card */}
      <Card className="shadow-lg">
        <CardContent className="pt-6 p-6">
          {/* Question Header */}
          <div className="flex justify-between items-start mb-4">
            <span className="question-badge">
              {currentQuestion.type === "mcq" ? "Vocabulary MCQ" : "Analogy Question"}
            </span>
          </div>

          {/* Question */}
          <h3 className="text-xl font-semibold text-gray-900 mb-6">{currentQuestion.question}</h3>

          {!showingExplanation ? (
            /* Answer Options */
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(option)}
                  disabled={showingExplanation} // Only disable after submitting answer
                  className={cn(
                    "w-full text-left px-4 py-3 border rounded-md flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors",
                    selectedAnswer === option
                      ? "bg-indigo-50 border-indigo-200"
                      : "hover:bg-gray-50"
                  )}
                >
                  <span
                    className={cn(
                      "flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-sm font-medium",
                      selectedAnswer === option
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-700"
                    )}
                  >
                    {["A", "B", "C", "D"][index]}
                  </span>
                  <span className="text-gray-900">{option}</span>
                </button>
              ))}
            </div>
          ) : (
            /* Answer Explanation */
            <div className="mb-6 space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Correct Answer:</span>
                  <span className="text-sm font-semibold text-success">{currentQuestion.correctAnswer}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Your Answer:</span>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      userCorrect ? "text-success" : "text-destructive"
                    )}
                  >
                    {selectedAnswer}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">AI's Answer:</span>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      aiCorrect ? "text-success" : "text-destructive"
                    )}
                  >
                    {aiAnswer}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Explanation:</h4>
                <p className="text-gray-700">{currentQuestion.explanation}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex justify-between items-center">
            {currentQuestionIndex > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={previousQuestion}
                className="flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            ) : (
              <div></div> // Empty space for alignment
            )}

            {!showingExplanation ? (
              <Button
                onClick={checkAnswer}
                disabled={selectedAnswer === null}
                className={cn(
                  "gradient-btn",
                  selectedAnswer === null && "opacity-50 cursor-not-allowed"
                )}
              >
                Submit Answer
              </Button>
            ) : currentQuestionIndex < questions.length - 1 ? (
              <Button onClick={nextQuestion} className="gradient-btn flex items-center">
                Next Question
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={finishBattle} className="gradient-btn">
                See Results
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionInterface;
