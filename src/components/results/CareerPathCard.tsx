import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { ExternalLink, BookOpen, Target, Clock, DollarSign, Briefcase, Award, Zap, Star, Send, MessageCircle, AlertTriangle, Route, DollarSignIcon, Loader2 } from 'lucide-react';
import { ConversationThread } from './ConversationThread';
import { useApp } from '@/context/AppContext';
import { followUpWithGemini } from '@/lib/gemini';
import type { CareerPath } from '@/lib/types';

const pathTypeConfig = {
  best_fit: { label: 'Best Fit', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50', icon: Star, stripe: 'from-emerald-400 to-emerald-600' },
  ambitious_stretch: { label: 'Ambitious Stretch', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-800/50', icon: Zap, stripe: 'from-indigo-400 to-indigo-600' },
  practical_safety: { label: 'Safety Net', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/50', icon: Award, stripe: 'from-amber-400 to-amber-600' },
};

const priorityConfig = {
  critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  important: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  nice_to_have: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const QUICK_QUESTIONS = [
  { label: 'Tell me more', icon: MessageCircle },
  { label: 'What are the risks?', icon: AlertTriangle },
  { label: "What if I can't afford this?", icon: DollarSignIcon },
  { label: 'Alternative routes', icon: Route },
];

interface Props {
  path: CareerPath;
  index: number;
  selected?: boolean;
  onToggleSelect?: (index: number) => void;
}

export function CareerPathCard({ path, index, selected, onToggleSelect }: Props) {
  const { state, dispatch } = useApp();
  const typeConfig = pathTypeConfig[path.path_type];
  const TypeIcon = typeConfig.icon;

  const [questionInput, setQuestionInput] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [followUpError, setFollowUpError] = useState<string | null>(null);
  const lastQuestionRef = useRef('');

  const conversations = state.conversations[index] ?? [];

  const askQuestion = useCallback(async (question: string) => {
    if (!question.trim() || !state.apiKey || !state.results) return;

    lastQuestionRef.current = question;
    setIsAsking(true);
    setFollowUpError(null);
    setQuestionInput('');

    try {
      const { answer, groundingChunks } = await followUpWithGemini(
        state.apiKey,
        state.results.profile,
        path,
        conversations,
        question
      );

      dispatch({
        type: 'ADD_CONVERSATION',
        payload: {
          cardIndex: index,
          entry: {
            question,
            answer,
            timestamp: Date.now(),
            groundingChunks,
          },
        },
      });
    } catch (err: any) {
      setFollowUpError(err?.message || 'Failed to get a response. Please try again.');
    } finally {
      setIsAsking(false);
    }
  }, [state.apiKey, state.results, path, conversations, dispatch, index]);

  const handleRetry = useCallback(() => {
    if (lastQuestionRef.current) {
      askQuestion(lastQuestionRef.current);
    }
  }, [askQuestion]);

  const handleSend = useCallback(() => {
    askQuestion(questionInput);
  }, [askQuestion, questionInput]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15, type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Card className={`h-full border-border/40 bg-card/90 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden group ${selected ? 'ring-2 ring-primary' : ''}`}>
        {/* Gradient stripe */}
        <div className={`h-1.5 bg-gradient-to-r ${typeConfig.stripe}`} />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                {onToggleSelect ? (
                  <button
                    role="checkbox"
                    aria-checked={selected}
                    onClick={() => onToggleSelect(index)}
                    className={`flex h-6 w-6 items-center justify-center rounded border-2 transition-colors cursor-pointer ${
                      selected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/30 hover:border-primary/50'
                    }`}
                    aria-label={selected ? `Deselect ${path.title} for comparison` : `Select ${path.title} for comparison`}
                  >
                    {selected ? (
                      <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                  </button>
                ) : null}
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                  #{path.rank}
                </span>
                <Badge variant="secondary" className={`text-xs border ${typeConfig.color}`}>
                  <TypeIcon className="mr-1 h-3 w-3" />
                  {typeConfig.label}
                </Badge>
              </div>
              <h3 className="text-lg font-bold leading-tight">{path.title}</h3>
            </div>
            <MatchScoreRing score={path.match_score} />
          </div>

          <blockquote className="mt-4 rounded-xl border-l-4 border-primary/40 bg-primary/5 p-4 text-sm italic text-foreground/80 leading-relaxed">
            {path.why_this_fits}
          </blockquote>
        </CardHeader>

        <CardContent className="pt-0">
          <Accordion className="w-full">
            {/* Education Roadmap */}
            <AccordionItem value="roadmap">
              <AccordionTrigger className="text-sm font-semibold cursor-pointer hover:no-underline">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" /> Education Roadmap
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-2">
                  {path.education_roadmap.map((step, i) => (
                    <div key={i} className="relative flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                          {step.step}
                        </div>
                        {i < path.education_roadmap.length - 1 ? (
                          <div className="mt-1 w-px flex-1 bg-border" />
                        ) : null}
                      </div>
                      <div className="flex-1 pb-3">
                        <p className="text-sm font-semibold">{step.action}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Clock className="h-3 w-3" />{step.timeline}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Skills to Build */}
            <AccordionItem value="skills">
              <AccordionTrigger className="text-sm font-semibold cursor-pointer hover:no-underline">
                <span className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" /> Skills to Build
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {path.skills_to_build.map((skill, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 rounded-xl bg-muted/40 p-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{skill.skill}</p>
                          <Badge variant="secondary" className={`text-[10px] ${priorityConfig[skill.priority]}`}>
                            {skill.priority.replaceAll('_', ' ')}
                          </Badge>
                        </div>
                        <a
                          href={skill.resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                        >
                          {skill.resource.name} <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Timeline */}
            <AccordionItem value="timeline">
              <AccordionTrigger className="text-sm font-semibold cursor-pointer hover:no-underline">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Timeline
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '6 Months', value: path.timeline['6_months'] },
                    { label: '1 Year', value: path.timeline['1_year'] },
                    { label: '3 Years', value: path.timeline['3_years'] },
                    { label: '5 Years', value: path.timeline['5_years'] },
                  ].map((item, i) => (
                    <div key={i} className="rounded-xl bg-muted/40 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary">{item.label}</p>
                      <p className="mt-1.5 text-xs text-foreground/80 leading-relaxed">{item.value}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Salary */}
            <AccordionItem value="salary">
              <AccordionTrigger className="text-sm font-semibold cursor-pointer hover:no-underline">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" /> Salary Expectations
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-3 gap-2">
                  <SalaryBlock label="Entry" value={path.salary_expectations.entry_level} />
                  <SalaryBlock label="Mid-Career" value={path.salary_expectations.mid_career} />
                  <SalaryBlock label="Senior" value={path.salary_expectations.senior} />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Job Links */}
            <AccordionItem value="jobs" className="border-b-0">
              <AccordionTrigger className="text-sm font-semibold cursor-pointer hover:no-underline">
                <span className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" /> Find Jobs
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {path.job_links.map((link, i) => (
                    <a
                      key={i}
                      href={link.search_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl bg-muted/40 p-3 hover:bg-primary/5 transition-colors group/link"
                    >
                      <ExternalLink className="h-4 w-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold group-hover/link:text-primary transition-colors">{link.platform}</p>
                        <p className="text-xs text-muted-foreground truncate">{link.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Follow-up section */}
          <div className="mt-4 border-t border-border/40 pt-4">
            {/* Quick question pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {QUICK_QUESTIONS.map((q) => (
                <Button
                  key={q.label}
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0 rounded-full text-xs h-8 px-3 cursor-pointer hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors"
                  onClick={() => askQuestion(q.label)}
                  disabled={isAsking}
                >
                  <q.icon className="mr-1.5 h-3 w-3" />
                  {q.label}
                </Button>
              ))}
            </div>

            {/* Conversation thread */}
            <ConversationThread
              entries={conversations}
              isLoading={isAsking}
              error={followUpError}
              onRetry={handleRetry}
            />

            {/* Free-form input */}
            <div className="flex gap-2 mt-2 items-end">
              <Textarea
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about this career path..."
                className="text-sm min-h-[38px] max-h-[120px] resize-none"
                rows={1}
                disabled={isAsking}
                aria-label={`Ask a question about ${path.title}`}
              />
              <Button
                size="sm"
                className="h-9 w-9 p-0 flex-shrink-0 cursor-pointer"
                onClick={handleSend}
                disabled={isAsking || !questionInput.trim()}
                aria-label="Send question"
              >
                {isAsking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MatchScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#6366f1' : '#f59e0b';

  return (
    <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center" role="img" aria-label={`Match score: ${score}%`}>
      <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r={radius} fill="none" strokeWidth="3.5" className="stroke-muted/30" />
        <motion.circle
          cx="32" cy="32" r={radius} fill="none" strokeWidth="3.5"
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute text-sm font-bold" aria-hidden="true">{score}%</span>
    </div>
  );
}

function SalaryBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/40 p-3 text-center">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-sm font-bold bg-gradient-to-br from-primary to-purple-500 bg-clip-text text-transparent">{value}</p>
    </div>
  );
}
