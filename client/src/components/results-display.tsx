import React from "react";
import { useBattle } from "@/contexts/battle-context";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ResultsDisplay: React.FC = () => {
  const {
    questions,
    userScore,
    aiScore,
    userAnswers,
    aiAnswers,
    restartBattle
  } = useBattle();

  // Calculate percentages
  const userPercentage = Math.round((userScore / questions.length) * 100);
  const aiPercentage = Math.round((aiScore / questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold text-neutral-800">Battle Results</h2>
        </CardHeader>
        
        <CardContent>
          {/* Score Summary */}
          <div className="flex flex-col sm:flex-row justify-center items-center mb-8 sm:space-x-8">
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 text-center w-full sm:w-auto mb-4 sm:mb-0">
              <div className="text-lg font-medium text-neutral-600 mb-1">Your Score</div>
              <div className="text-4xl font-bold text-primary">{userScore}/{questions.length}</div>
              <div className="text-sm text-neutral-500 mt-1">{userPercentage}%</div>
            </div>
            
            <div className="text-xl font-bold text-neutral-400 mb-4 sm:mb-0">VS</div>
            
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-6 text-center w-full sm:w-auto">
              <div className="text-lg font-medium text-neutral-600 mb-1">AI Score</div>
              <div className="text-4xl font-bold text-secondary">{aiScore}/{questions.length}</div>
              <div className="text-sm text-neutral-500 mt-1">{aiPercentage}%</div>
            </div>
          </div>
          
          {/* Winner Display */}
          <div className="text-center mb-8">
            {userScore > aiScore ? (
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 inline-block">
                <h3 className="text-xl font-bold text-green-800">You Won! 🏆</h3>
                <p className="text-sm text-green-600">Your vocabulary knowledge surpassed the AI!</p>
              </div>
            ) : userScore < aiScore ? (
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 inline-block">
                <h3 className="text-xl font-bold text-purple-800">AI Won! 🤖</h3>
                <p className="text-sm text-purple-600">The AI demonstrated superior vocabulary knowledge this time.</p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 inline-block">
                <h3 className="text-xl font-bold text-blue-800">It's a Tie! 🤝</h3>
                <p className="text-sm text-blue-600">You and the AI demonstrated equal vocabulary knowledge.</p>
              </div>
            )}
          </div>
          
          {/* Question Review */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Review</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Correct Answer</TableHead>
                    <TableHead>Your Answer</TableHead>
                    <TableHead>AI Answer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question, index) => (
                    <TableRow key={index}>
                      <TableCell className="max-w-xs truncate">{question.question}</TableCell>
                      <TableCell>{question.correctAnswer}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className={userAnswers[index] === question.correctAnswer ? "text-success" : "text-destructive"}>
                            {userAnswers[index] || "-"}
                          </span>
                          {userAnswers[index] === question.correctAnswer ? 
                            <Check className="h-4 w-4 text-success" /> : 
                            <X className="h-4 w-4 text-destructive" />
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className={aiAnswers[index] === question.correctAnswer ? "text-success" : "text-destructive"}>
                            {aiAnswers[index] || "-"}
                          </span>
                          {aiAnswers[index] === question.correctAnswer ? 
                            <Check className="h-4 w-4 text-success" /> : 
                            <X className="h-4 w-4 text-destructive" />
                          }
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Button 
            onClick={restartBattle}
            size="lg"
            className="gradient-btn"
          >
            Start New Battle
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
