import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { ExternalLink, BookOpen, Target, Clock, DollarSign, Briefcase, Award, Zap, Star } from 'lucide-react';
import type { CareerPath } from '@/lib/types';

const pathTypeConfig = {
  best_fit: { label: 'Best Fit', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: Star },
  ambitious_stretch: { label: 'Ambitious Stretch', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300', icon: Zap },
  practical_safety: { label: 'Safety Net', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', icon: Award },
};

const priorityConfig = {
  critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  important: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  nice_to_have: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

interface Props {
  path: CareerPath;
  index: number;
}

export function CareerPathCard({ path, index }: Props) {
  const typeConfig = pathTypeConfig[path.path_type];
  const TypeIcon = typeConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15, type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Card className="h-full border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        {/* Rank stripe */}
        <div className={`h-1.5 ${index === 0 ? 'bg-green-500' : index === 1 ? 'bg-indigo-500' : 'bg-yellow-500'}`} />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  #{path.rank}
                </span>
                <Badge variant="secondary" className={`text-xs ${typeConfig.color}`}>
                  <TypeIcon className="mr-1 h-3 w-3" />
                  {typeConfig.label}
                </Badge>
              </div>
              <h3 className="text-lg font-bold leading-tight">{path.title}</h3>
            </div>
            {/* Match score ring */}
            <MatchScoreRing score={path.match_score} />
          </div>

          {/* Why this fits */}
          <blockquote className="mt-3 rounded-lg border-l-4 border-primary/40 bg-primary/5 p-3 text-sm italic text-foreground/80">
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
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {step.step}
                        </div>
                        {i < path.education_roadmap.length - 1 && (
                          <div className="mt-1 w-px flex-1 bg-border" />
                        )}
                      </div>
                      <div className="flex-1 pb-3">
                        <p className="text-sm font-medium">{step.action}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          <Clock className="inline h-3 w-3 mr-1" />{step.timeline}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{step.details}</p>
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
                    <div key={i} className="flex items-start justify-between gap-2 rounded-lg bg-muted/40 p-2.5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{skill.skill}</p>
                          <Badge variant="secondary" className={`text-[10px] ${priorityConfig[skill.priority]}`}>
                            {skill.priority.replace('_', ' ')}
                          </Badge>
                        </div>
                        <a
                          href={skill.resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
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
                    <div key={i} className="rounded-lg bg-muted/40 p-2.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{item.label}</p>
                      <p className="mt-1 text-xs text-foreground/80">{item.value}</p>
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
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start cursor-pointer"
                    >
                      <a href={link.search_url} target="_blank" rel="noopener noreferrer" className="flex items-center w-full">
                        <ExternalLink className="mr-2 h-3.5 w-3.5" />
                        {link.platform} — {link.description}
                      </a>
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MatchScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#16a34a' : score >= 60 ? '#6366f1' : '#eab308';

  return (
    <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center">
      <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" strokeWidth="4" className="stroke-muted/50" />
        <motion.circle
          cx="32" cy="32" r={radius} fill="none" strokeWidth="4"
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute text-sm font-bold">{score}%</span>
    </div>
  );
}

function SalaryBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 p-2.5 text-center">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
