import { Button } from '@/components/ui/button';
import { ProfileCard } from './ProfileCard';
import { CareerPathCard } from './CareerPathCard';
import { useApp } from '@/context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export function ResultsSection() {
  const { state, dispatch } = useApp();

  if (!state.results) return null;

  const { profile, confidence, missing_info, career_paths } = state.results;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <ProfileCard profile={profile} confidence={confidence} missingInfo={missing_info} />

      <div>
        <h2 className="mb-5 text-2xl font-bold tracking-tight">Your Career Pathways</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {career_paths.map((path, i) => (
            <CareerPathCard key={path.rank} path={path} index={i} />
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-4 pb-8">
        <Button
          variant="outline"
          size="lg"
          className="cursor-pointer"
          onClick={() => dispatch({ type: 'RESET' })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Start Over
        </Button>
      </div>
    </motion.div>
  );
}
