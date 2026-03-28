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
import { AlertCircle, RotateCcw, ArrowRight, Sparkles, Compass, BookOpen, TrendingUp, Target, Info, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const { state, dispatch } = useApp();
  const [apiKeyOpen, setApiKeyOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'about'>('home');

  useEffect(() => {
    if (!state.apiKey) {
      setApiKeyOpen(true);
    }
  }, [state.apiKey]);

  if (currentPage === 'about') {
    return <AboutPage onBack={() => setCurrentPage('home')} />;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header onOpenApiKey={() => setApiKeyOpen(true)} />
      <ApiKeyDialog open={apiKeyOpen} onOpenChange={setApiKeyOpen} />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {state.results ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
            >
              <ResultsSection />
            </motion.div>
          ) : state.isAnalyzing ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
            >
              <AnalysisLoader />
            </motion.div>
          ) : state.error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
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
            <div key="landing">
              {/* ===== HERO SECTION ===== */}
              <section className="hero-gradient dot-grid relative">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
                  {/* Floating decorative elements */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                    <div className="animate-float absolute top-20 left-[10%] h-20 w-20 rounded-2xl bg-primary/5 border border-primary/10 rotate-12" />
                    <div className="animate-float-delay absolute top-32 right-[12%] h-16 w-16 rounded-full bg-purple-500/5 border border-purple-500/10" />
                    <div className="animate-float-slow absolute bottom-20 left-[20%] h-14 w-14 rounded-xl bg-pink-500/5 border border-pink-500/10 -rotate-12" />
                    <div className="animate-float absolute bottom-28 right-[18%] h-12 w-12 rounded-full bg-indigo-500/5 border border-indigo-500/10" />
                  </div>

                  <div className="relative z-10 text-center">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium shadow-sm">
                        <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" /> AI-Powered Career Navigator
                      </Badge>
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl leading-[1.1]"
                    >
                      Your career pathway,
                      <br />
                      <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        mapped by AI
                      </span>
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed"
                    >
                      Drop your messy academic data — grades, interests, even voice notes — and get
                      a structured, actionable career roadmap in seconds.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
                    >
                      <Button
                        size="lg"
                        className="cursor-pointer font-semibold px-8 h-12 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                        onClick={() => document.getElementById('input-area')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="cursor-pointer h-12 text-base"
                        onClick={() => setCurrentPage('about')}
                      >
                        <Info className="mr-2 h-4 w-4" /> How it works
                      </Button>
                    </motion.div>

                    {/* Feature pills */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="mt-14 flex flex-wrap items-center justify-center gap-3"
                    >
                      {[
                        { icon: Target, label: '3 Career Paths', color: 'text-emerald-500' },
                        { icon: BookOpen, label: 'Education Roadmaps', color: 'text-blue-500' },
                        { icon: TrendingUp, label: 'Salary Insights', color: 'text-amber-500' },
                        { icon: Compass, label: 'Job Links', color: 'text-purple-500' },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm px-4 py-2 shadow-sm"
                        >
                          <item.icon className={`h-4 w-4 ${item.color}`} />
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Scroll indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="flex justify-center mt-16"
                  >
                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex flex-col items-center gap-2 text-muted-foreground/50"
                    >
                      <span className="text-xs font-medium uppercase tracking-wider">Scroll to explore</span>
                      <ArrowDown className="h-4 w-4" />
                    </motion.div>
                  </motion.div>
                </div>
              </section>

              {/* ===== CONTENT SECTIONS ===== */}
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Input section */}
                <div id="input-area" className="mx-auto max-w-2xl scroll-mt-24 py-16 sm:py-20">
                  <InputSection onOpenApiKey={() => setApiKeyOpen(true)} />
                </div>

                <FeaturesSection />
                <InputMethodsSection />
                <AudienceSection />
                <StatsSection />
                <CTASection onGetStarted={() => document.getElementById('input-area')?.scrollIntoView({ behavior: 'smooth' })} />
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
