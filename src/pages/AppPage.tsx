import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ApiKeyDialog } from '@/components/common/ApiKeyDialog';
import { InputSection } from '@/components/input/InputSection';
import { AnalysisLoader } from '@/components/loading/AnalysisLoader';
import { ResultsSection } from '@/components/results/ResultsSection';
import { useApp } from '@/context/AppContext';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppPage() {
  const { state, dispatch } = useApp();
  const [apiKeyOpen, setApiKeyOpen] = useState(false);

  useEffect(() => {
    if (!state.apiKey) {
      setApiKeyOpen(true);
    }
  }, [state.apiKey]);

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
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-2xl px-4 py-12 sm:py-16"
            >
              <InputSection onOpenApiKey={() => setApiKeyOpen(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
