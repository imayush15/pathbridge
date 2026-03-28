import { motion } from 'framer-motion';
import { BookOpen, UserCircle, GitBranch, Map, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  { label: 'Extracting academic data', icon: BookOpen, desc: 'Parsing your input for grades, subjects, and interests' },
  { label: 'Building your profile', icon: UserCircle, desc: 'Creating a structured student profile' },
  { label: 'Matching career paths', icon: GitBranch, desc: 'Finding best-fit career pathways' },
  { label: 'Generating roadmaps', icon: Map, desc: 'Building actionable education & career plans' },
];

export function AnalysisLoader() {
  const { state } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-lg py-20"
    >
      <div className="flex flex-col items-center">
        {/* Animated orb */}
        <div className="relative mb-10">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
            <motion.div
              className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/50 to-purple-500/50"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-purple-500/20"
            animate={{ scale: [1, 1.9], opacity: [0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
          />
        </div>

        <h3 className="mb-2 text-xl font-bold">Analyzing your profile</h3>
        <p className="mb-10 text-sm text-muted-foreground">This usually takes 15-30 seconds</p>

        {/* Steps */}
        <Card className="w-full border-border/40 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="space-y-1">
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
                    className={`flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-300 ${
                      isActive ? 'bg-primary/10' :
                      isDone ? 'bg-emerald-50 dark:bg-emerald-950/20' :
                      ''
                    }`}
                  >
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                      isActive ? 'bg-primary text-white shadow-lg shadow-primary/30' :
                      isDone ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : isActive ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                          <Icon className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${
                        isActive ? 'text-primary' :
                        isDone ? 'text-emerald-600 dark:text-emerald-400' :
                        'text-muted-foreground'
                      }`}>{step.label}</p>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="text-xs text-muted-foreground mt-0.5"
                        >
                          {step.desc}
                        </motion.p>
                      )}
                    </div>
                    {isDone && <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Done</span>}
                    {isActive && (
                      <motion.div
                        className="flex gap-1"
                        animate={{ opacity: [1, 0.3] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
