import React from "react";
import WelcomeScreen from "@/components/welcome-screen";
import LoadingScreen from "@/components/loading-screen";
import { useBattle } from "@/contexts/battle-context";
import { Book } from "lucide-react";

const Home: React.FC = () => {
  const { isLoading } = useBattle();

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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6">
        <WelcomeScreen />
      </main>

      {/* Loading Screen */}
      {isLoading && <LoadingScreen />}
    </div>
  );
};

export default Home;
