import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Battle from "@/pages/battle";
import Results from "@/pages/results";
import { BattleProvider } from "./contexts/battle-context";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/battle" component={Battle} />
      <Route path="/results" component={Results} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BattleProvider>
          <Toaster />
          <Router />
        </BattleProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
