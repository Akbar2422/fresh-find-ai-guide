
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import History from "./pages/History";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { supabase } from "./lib/supabase";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Create profiles table if it doesn't exist when a new user signs up
    const setupProfileOnSignUp = async () => {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "SIGNED_IN" && session?.user) {
            const { id, email } = session.user;
            
            // Check if profile exists
            const { data: existingProfile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", id)
              .single();
            
            // If no profile exists, create one
            if (!existingProfile) {
              await supabase.from("profiles").insert({
                id,
                email,
                name: email?.split("@")[0] || "User",
              });
            }
          }
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    setupProfileOnSignUp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/history" element={<History />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
