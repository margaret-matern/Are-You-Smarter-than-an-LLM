import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useBattle } from "@/contexts/battle-context";
import QuestionInterface from "@/components/question-interface";
import LoadingScreen from "@/components/loading-screen";
import { Book } from "lucide-react";
import { Button } from "@/components/ui/button";

const Battle: React.FC = () => {
  const { 
    isBattleStarted, 
    isLoading,
    restartBattle
  } = useBattle();
  
  const [, navigate] = useLocation();
  
  // Redirect to home if battle hasn't started
  useEffect(() => {
    if (!isBattleStarted && !isLoading) {
      navigate("/");
    }
  }, [isBattleStarted, isLoading, navigate]);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Book className="h-8 w-8 text-primary" />
              <h1 className="ml-2 text-xl font-bold text-neutral-800">Vocabulary Battle</h1>
            </div>
            <Button 
              onClick={restartBattle}
              variant="outline"
              size="sm"
            >
              Quit Battle
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6">
        <QuestionInterface />
      </main>

      {/* Loading Screen */}
      {isLoading && <LoadingScreen />}
    </div>
  );
};

export default Battle;
