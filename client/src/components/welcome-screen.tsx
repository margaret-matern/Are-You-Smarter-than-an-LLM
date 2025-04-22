import React from "react";
import { useBattle } from "@/contexts/battle-context";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const WelcomeScreen: React.FC = () => {
  const { settings, updateSettings, startBattle } = useBattle();

  const handleDifficultyChange = (value: string) => {
    updateSettings({ difficulty: value });
  };

  const handleNumQuestionsChange = (value: string) => {
    updateSettings({ numQuestions: parseInt(value) });
  };

  const handleTimerChange = (checked: boolean) => {
    updateSettings({ enableTimer: checked });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="shadow-lg">
        <CardHeader className="gradient-btn rounded-t-lg">
          <h2 className="text-xl leading-6 font-bold text-white">Welcome to Vocabulary Battle</h2>
          <p className="mt-1 max-w-2xl text-sm text-white/80">Test your vocabulary knowledge against an AI!</p>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-gray-700">Challenge yourself with vocabulary questions and see how you perform against an AI language model. The battle includes:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1 text-gray-700">
              <li>Multiple choice vocabulary questions</li>
              <li>Analogy challenges</li>
              <li>Real-time scoring comparison</li>
              <li>Detailed explanations for each answer</li>
            </ul>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">Battle Settings</h3>
              <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={settings.difficulty}
                    onValueChange={handleDifficultyChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="numQuestions">Number of Questions</Label>
                  <Select
                    value={settings.numQuestions.toString()}
                    onValueChange={handleNumQuestionsChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select number of questions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Questions</SelectItem>
                      <SelectItem value="10">10 Questions</SelectItem>
                      <SelectItem value="15">15 Questions</SelectItem>
                      <SelectItem value="20">20 Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="sm:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableTimer"
                      checked={settings.enableTimer}
                      onCheckedChange={handleTimerChange}
                    />
                    <div>
                      <Label htmlFor="enableTimer" className="font-medium text-gray-700">Enable Timer</Label>
                      <p className="text-gray-500 text-sm">Limit each question to 30 seconds</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center pt-2 pb-6">
          <Button 
            onClick={startBattle}
            size="lg"
            className="gradient-btn"
          >
            Start Battle
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WelcomeScreen;
