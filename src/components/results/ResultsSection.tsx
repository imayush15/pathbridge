import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProfileCard } from './ProfileCard';
import { CareerPathCard } from './CareerPathCard';
import { ComparisonView } from './ComparisonView';
import { useApp } from '@/context/AppContext';
import { compareWithGemini } from '@/lib/gemini';
import type { CareerPath } from '@/lib/types';
import { ArrowLeft, Sparkles, GitCompare, Lock, Star, Zap, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function ResultsSection() {
  const { state, dispatch } = useApp();
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const results = state.results;

  const handleToggleSelect = useCallback((index: number) => {
    setSelectedIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      if (prev.length >= 2) {
        return [prev[1], index];
      }
      return [...prev, index];
    });
  }, []);

  const handleCompare = useCallback(async () => {
    if (selectedIndices.length !== 2 || !state.apiKey || !results) return;

    const [i1, i2] = selectedIndices;
    setIsComparing(true);
    dispatch({ type: 'SET_COMPARISON_PAIR', payload: [i1, i2] });

    try {
      const comparisonResult = await compareWithGemini(
        state.apiKey,
        results.profile,
        results.career_paths[i1],
        results.career_paths[i2]
      );
      dispatch({ type: 'SET_COMPARISON_RESULT', payload: comparisonResult });
    } catch (err: any) {
      toast.error(err?.message || 'Comparison failed. Please try again.');
      dispatch({ type: 'CLEAR_COMPARISON' });
    } finally {
      setIsComparing(false);
    }
  }, [selectedIndices, state.apiKey, results, dispatch]);

  if (!results) return null;

  const { profile, confidence, missing_info, career_paths } = results;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-10"
    >
      <div className="text-center">
        <Badge variant="secondary" className="mb-4 px-3 py-1">
          <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" /> Analysis Complete
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your Career Pathways</h1>
        <p className="mt-2 text-muted-foreground">Here's what our AI found based on your profile.</p>
      </div>

      <ProfileCard profile={profile} confidence={confidence} missingInfo={missing_info} />

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Recommended Paths</h2>
          <p className="text-xs text-muted-foreground">Select 2 cards to compare</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {career_paths.map((path, i) => {
            const isVisible = i < state.visiblePathCount || state.unlockedPaths.has(i);

            return isVisible ? (
              <CareerPathCard
                key={path.rank}
                path={path}
                index={i}
                selected={selectedIndices.includes(i)}
                onToggleSelect={handleToggleSelect}
              />
            ) : (
              <LockedCard
                key={path.rank}
                path={path}
                index={i}
                onUnlock={(idx) => dispatch({ type: 'UNLOCK_PATH', payload: idx })}
              />
            );
          })}
        </div>
      </div>

      {/* Floating compare button */}
      <AnimatePresence>
        {selectedIndices.length === 2 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-2rem)]"
          >
            <Button
              size="lg"
              className="cursor-pointer shadow-2xl shadow-primary/30 h-12 px-6 sm:px-8 text-sm sm:text-base font-semibold max-w-full"
              onClick={handleCompare}
              disabled={isComparing}
            >
              <GitCompare className="mr-2 h-5 w-5 flex-shrink-0" />
              <span className="truncate">Compare {career_paths[selectedIndices[0]]?.title} vs {career_paths[selectedIndices[1]]?.title}</span>
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ComparisonView />

      <div className="flex justify-center pt-4 pb-8">
        <Button
          variant="outline"
          size="lg"
          className="cursor-pointer h-12 px-8"
          onClick={() => dispatch({ type: 'RESET' })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Analyze Again
        </Button>
      </div>
    </motion.div>
  );
}

const pathTypeIcons = {
  best_fit: Star,
  ambitious_stretch: Zap,
  practical_safety: Award,
};

const pathTypeStripes = {
  best_fit: 'from-emerald-400 to-emerald-600',
  ambitious_stretch: 'from-indigo-400 to-indigo-600',
  practical_safety: 'from-amber-400 to-amber-600',
};

function LockedCard({ path, index, onUnlock }: { path: CareerPath; index: number; onUnlock: (index: number) => void }) {
  const TypeIcon = pathTypeIcons[path.path_type];
  const stripe = pathTypeStripes[path.path_type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15, type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div
        className="relative h-full rounded-xl border border-border/40 bg-card/90 backdrop-blur-sm overflow-hidden cursor-pointer group"
        onClick={() => onUnlock(index)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onUnlock(index)}
        aria-label={`Unlock ${path.title} career path`}
      >
        {/* Gradient stripe */}
        <div className={`h-1.5 bg-gradient-to-r ${stripe}`} />

        {/* Blurred preview content */}
        <div className="p-6 blur-[6px] select-none pointer-events-none" aria-hidden="true">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
              #{path.rank}
            </span>
            <TypeIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold leading-tight mb-3">{path.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{path.why_this_fits}</p>
          <div className="mt-4 space-y-2">
            <div className="h-3 rounded bg-muted/60 w-full" />
            <div className="h-3 rounded bg-muted/60 w-4/5" />
            <div className="h-3 rounded bg-muted/60 w-3/5" />
            <div className="h-3 rounded bg-muted/60 w-full" />
            <div className="h-3 rounded bg-muted/60 w-2/3" />
          </div>
        </div>

        {/* Unlock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px] transition-all group-hover:bg-background/40">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-3 transition-transform group-hover:scale-110">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-semibold">Click to reveal</p>
          <p className="text-xs text-muted-foreground mt-1">{path.title}</p>
        </div>
      </div>
    </motion.div>
  );
}
