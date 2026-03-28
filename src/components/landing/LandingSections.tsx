import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Compass, Target, BookOpen, Sparkles, TrendingUp, Upload,
  FileText, Mic, Image, Brain, Shield, Globe, ArrowRight,
  GraduationCap, Briefcase, Users, BarChart3
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Gemini AI processes your messy inputs — grades, interests, transcripts — and builds a structured student profile in seconds.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
  },
  {
    icon: Target,
    title: '3 Career Pathways',
    description: 'Get a Best Fit, an Ambitious Stretch, and a Safety Net — so you always have options that match your risk appetite.',
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-950/30',
  },
  {
    icon: BookOpen,
    title: 'Education Roadmap',
    description: 'Step-by-step plans with real courses from Coursera, NPTEL, edX — not vague advice, but actionable steps.',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
  },
  {
    icon: TrendingUp,
    title: 'Salary Insights',
    description: 'Region-aware salary expectations for entry, mid-career, and senior levels. Know what to expect.',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    icon: Briefcase,
    title: 'Real Job Links',
    description: 'Direct links to job searches on LinkedIn, Naukri, Indeed — so you can see what\'s actually out there.',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your API key stays in your browser. Your data goes only to Google\'s Gemini API. We store nothing.',
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
  },
];

const inputMethods = [
  { icon: FileText, label: 'Paste Text', desc: 'Type or paste your grades, interests, anything.' },
  { icon: Image, label: 'Upload Image', desc: 'Snap your marksheet or transcript.' },
  { icon: Mic, label: 'Voice Input', desc: 'Just talk about yourself. We\'ll transcribe.' },
];

const audiences = [
  { icon: GraduationCap, label: 'Class 8–10 Students', desc: 'Explore streams & early career direction' },
  { icon: BookOpen, label: 'Class 11–12 Students', desc: 'Pick the right degree & college' },
  { icon: Users, label: 'Undergraduates', desc: 'Find your specialization & first job' },
  { icon: Briefcase, label: 'Working Professionals', desc: 'Switch careers with a solid plan' },
];

const stats = [
  { value: '500+', label: 'Career Paths Mapped' },
  { value: '3', label: 'Pathways Per Analysis' },
  { value: '<30s', label: 'Results in Seconds' },
  { value: '100%', label: 'Free to Use' },
];

interface Props {
  onGetStarted: () => void;
}

export function FeaturesSection() {
  return (
    <section className="py-16" id="features">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <Badge variant="secondary" className="mb-4">
          <Sparkles className="mr-1.5 h-3.5 w-3.5" /> How it works
        </Badge>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          From messy data to{' '}
          <span className="text-primary">actionable roadmap</span>
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          PathBridge uses Google's Gemini AI to understand your academic background, interests, and goals — then generates personalized career pathways you can act on today.
        </p>
      </motion.div>

      {/* Feature grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feat, i) => (
          <motion.div
            key={feat.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Card className="h-full border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${feat.bg} mb-4`}>
                  <feat.icon className={`h-5 w-5 ${feat.color}`} />
                </div>
                <h3 className="text-base font-semibold mb-1.5">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function InputMethodsSection() {
  return (
    <section className="py-16" id="input-methods">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-bold tracking-tight">
          Three ways to{' '}
          <span className="text-primary">share your story</span>
        </h2>
        <p className="mt-2 text-muted-foreground">No forms. No structure needed. Just be yourself.</p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-3">
        {inputMethods.map((method, i) => (
          <motion.div
            key={method.label}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <method.icon className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">{method.label}</h3>
            <p className="text-sm text-muted-foreground">{method.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function AudienceSection() {
  return (
    <section className="py-16" id="audience">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-bold tracking-tight">
          Built for{' '}
          <span className="text-primary">every stage</span>
        </h2>
        <p className="mt-2 text-muted-foreground">From school students to career switchers — PathBridge adapts to you.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {audiences.map((aud, i) => (
          <motion.div
            key={aud.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm text-center p-6 hover:border-primary/30 transition-colors">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <aud.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{aud.label}</h3>
              <p className="text-xs text-muted-foreground">{aud.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function StatsSection() {
  return (
    <section className="py-12">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="text-center py-6"
          >
            <p className="text-3xl font-extrabold text-primary">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function CTASection({ onGetStarted }: Props) {
  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center py-12 px-6 text-center">
            <Compass className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to find your path?</h2>
            <p className="mt-2 text-muted-foreground max-w-lg">
              No signup. No cost. Just paste your background and let AI do the heavy lifting.
            </p>
            <Button
              size="lg"
              className="mt-6 cursor-pointer text-base font-semibold"
              onClick={onGetStarted}
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
