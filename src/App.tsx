// client/src/App.tsx

import React, { useState } from "react";                 // ← ADD useState
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Pages
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import Campaigns from "@/pages/Campaigns";
import CallHistory from "@/pages/CallHistory";
import CallCenter from "@/pages/CallCenter";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Pricing from "@/pages/Pricing";
import About from "@/pages/About";
import Faq from "@/pages/Faq";
import Blog from "@/pages/Blog";
import Documentation from "@/pages/Documentation";
import ApiDocumentation from "@/pages/ApiDocumentation";
import Tutorials from "@/pages/Tutorials";
import CaseStudies from "@/pages/CaseStudies";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import CookiePolicy from "@/pages/CookiePolicy";
import NotFound from "@/pages/NotFound";
import AIAgent from "@/pages/AIAgent";

// Components
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/components/Layout/MainLayout";
import AIChat from "@/components/Chatbot/AIChat";

// ← ADD THIS IMPORT
import DemoCallModal from "@/components/Landing/DemoCallModal";

const queryClient = new QueryClient();

const App = () => {
  // ← ADD THESE LINES FOR THE DEMO CALL MODAL
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<Faq />} />

              {/* Resource pages */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/api-documentation" element={<ApiDocumentation />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/case-studies" element={<CaseStudies />} />

              {/* Policy pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              
              {/* Protected routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/call-history" element={<CallHistory />} />
                <Route path="/call-center" element={<CallCenter />} />
                <Route path="/ai-agent" element={<AIAgent />} />
              </Route>

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* ← HERE: “Try Demo Call” BUTTON */}
            <div className="fixed bottom-6 right-6 z-40">
              <button
                onClick={() => setIsDemoOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-lg"
              >
                Try Demo Call
              </button>
            </div>

            {/* AI Chat component - visible on all pages */}
            <AIChat />

            {/* ← RENDER THE MODAL */}
            <DemoCallModal
              isOpen={isDemoOpen}
              onClose={() => setIsDemoOpen(false)}
            />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
