import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ApiKeyDialog } from '@/components/common/ApiKeyDialog';
import { InputSection } from '@/components/input/InputSection';
import { AnalysisLoader } from '@/components/loading/AnalysisLoader';
import { ResultsSection } from '@/components/results/ResultsSection';
import {
  FeaturesSection,
  InputMethodsSection,
  AudienceSection,
  StatsSection,
  CTASection
} from '@/components/landing/LandingSections';
import AboutPage from '@/pages/AboutPage';
import { useApp } from '@/context/AppContext';
import { AlertCircle, RotateCcw, Sparkles, Compass, BookOpen, TrendingUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const { state, dispatch } = useApp();
  const [apiKeyOpen, setApiKeyOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'about'>('home');

  // Show API key dialog on first visit
  useEffect(() => {
    if (!state.apiKey) {
      const timer = setTimeout(() => setApiKeyOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle "About" page toggle
  if (currentPage === 'about') {
    return <AboutPage onBack={() => setCurrentPage('home')} />;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header onOpenApiKey={() => setApiKeyOpen(true)} />
      <ApiKeyDialog open={apiKeyOpen} onOpenChange={setApiKeyOpen} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <AnimatePresence mode="wait">
          {state.results ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ResultsSection />
            </motion.div>
          ) : state.isAnalyzing ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnalysisLoader />
            </motion.div>
          ) : state.error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="mx-auto max-w-md border-destructive/30 bg-destructive/5">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
                  <h3 className="text-lg font-semibold">Something went wrong</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{state.error}</p>
                  <Button
                    className="mt-6 cursor-pointer"
                    onClick={() => dispatch({ type: 'RESET' })}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Try Again
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div key="landing" className="space-y-24">
              {/* Hero section */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  <Sparkles className="h-4 w-4" /> Powered by Gemini AI
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
                  Your career pathway,{' '}
                  <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    mapped by AI
                  </span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                  Drop your messy academic data — grades, interests, even voice notes — and get a structured, actionable career roadmap in seconds.
                </p>

                <div className="mt-8 flex items-center justify-center gap-4">
                  <Button
                    size="lg"
                    className="cursor-pointer font-semibold px-8"
                    onClick={() => document.getElementById('input-area')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="cursor-pointer"
                    onClick={() => setCurrentPage('about')}
                  >
                    <Info className="mr-2 h-4 w-4" /> How it works
                  </Button>
                </div>

                {/* Feature icons */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Compass className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">3 Career Paths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Education Roadmaps</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Salary Insights</span>
                  </div>
                </div>
              </motion.div>

              {/* Input section with ID for jumping */}
              <div id="input-area" className="mx-auto max-w-2xl scroll-mt-24">
                <InputSection onOpenApiKey={() => setApiKeyOpen(true)} />
              </div>

              {/* New Landing Sections */}
              <FeaturesSection />
              <InputMethodsSection />
              <AudienceSection />
              <StatsSection />
              <CTASection onGetStarted={() => document.getElementById('input-area')?.scrollIntoView({ behavior: 'smooth' })} />
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
