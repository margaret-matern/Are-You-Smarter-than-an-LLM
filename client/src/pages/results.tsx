import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useBattle } from "@/contexts/battle-context";
import ResultsDisplay from "@/components/results-display";
import { Book } from "lucide-react";
import { Button } from "@/components/ui/button";

const Results: React.FC = () => {
  const { 
    isBattleCompleted,
    restartBattle
  } = useBattle();
  
  const [, navigate] = useLocation();
  
  // Redirect to home if battle results aren't available
  useEffect(() => {
    if (!isBattleCompleted) {
      navigate("/");
    }
  }, [isBattleCompleted, navigate]);
  
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
              className="gradient-btn"
            >
              New Battle
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6">
        <ResultsDisplay />
      </main>
    </div>
  );
};

export default Results;
