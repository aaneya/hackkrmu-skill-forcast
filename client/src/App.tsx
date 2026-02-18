import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import SkillLearningPage from "./pages/SkillLearning";
import ProjectShowcase from "./pages/ProjectShowcase";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/dashboard"} component={UserDashboard} />
      <Route path={"/404"} component={NotFound} />
      <Route path={"/showcase"} component={ProjectShowcase} />
      <Route path={"/skills/:skillId"} component={SkillLearningPage} />
      <Route path={"/privacy"} component={() => <div className="p-20 text-center">Privacy Policy Page</div>} />
      <Route path={"/terms"} component={() => <div className="p-20 text-center">Terms of Service Page</div>} />
      <Route path={"/cookies"} component={() => <div className="p-20 text-center">Cookie Policy Page</div>} />
      <Route path={"/security"} component={() => <div className="p-20 text-center">Security Page</div>} />
      <Route path={"/gdpr"} component={() => <div className="p-20 text-center">GDPR Compliance Page</div>} />
      <Route path={"/accessibility"} component={() => <div className="p-20 text-center">Accessibility Page</div>} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
