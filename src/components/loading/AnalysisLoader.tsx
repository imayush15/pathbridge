import { motion } from 'framer-motion';
import { BookOpen, UserCircle, GitBranch, Map } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const steps = [
  { label: 'Extracting academic data', icon: BookOpen },
  { label: 'Building your profile', icon: UserCircle },
  { label: 'Matching career paths', icon: GitBranch },
  { label: 'Generating roadmaps', icon: Map },
];

export function AnalysisLoader() {
  const { state } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-md py-16"
    >
      <div className="flex flex-col items-center">
        {/* Animated orb */}
        <div className="relative mb-8">
          <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
            <motion.div
              className="h-12 w-12 rounded-full bg-primary/40"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
          />
        </div>

        <h3 className="mb-8 text-lg font-semibold">Analyzing your profile...</h3>

        {/* Steps */}
        <div className="w-full space-y-3">
          {steps.map((step, i) => {
            const isActive = state.analysisStep === i + 1;
            const isDone = state.analysisStep > i + 1;
            const Icon = step.icon;

            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' :
                  isDone ? 'text-green-600 dark:text-green-400' :
                  'text-muted-foreground'
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  isActive ? 'bg-primary text-white' :
                  isDone ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                  'bg-muted'
                }`}>
                  {isActive ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <Icon className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className="text-sm font-medium">{step.label}</span>
                {isDone && <span className="ml-auto text-xs">Done</span>}
                {isActive && (
                  <motion.span
                    className="ml-auto text-xs"
                    animate={{ opacity: [1, 0.3] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    Processing...
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
