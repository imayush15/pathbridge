import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Compass, Target, BookOpen, Sparkles, TrendingUp,
  FileText, Mic, Image, Brain, Shield, Briefcase,
  GraduationCap, Users, ArrowRight, Zap, Globe, CheckCircle2
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced AI processes your messy inputs — grades, interests, transcripts — and builds a structured student profile in seconds.',
    color: 'text-indigo-500',
    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/40 dark:to-indigo-900/20',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/50',
    span: 'sm:col-span-2',
  },
  {
    icon: Target,
    title: '3 Career Pathways',
    description: 'Get a Best Fit, an Ambitious Stretch, and a Safety Net — so you always have options.',
    color: 'text-emerald-500',
    bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
    span: '',
  },
  {
    icon: BookOpen,
    title: 'Education Roadmap',
    description: 'Step-by-step plans with real courses from Coursera, NPTEL, edX — not vague advice.',
    color: 'text-purple-500',
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/40 dark:to-purple-900/20',
    iconBg: 'bg-purple-100 dark:bg-purple-900/50',
    span: '',
  },
  {
    icon: TrendingUp,
    title: 'Salary Insights',
    description: 'Region-aware salary expectations for entry, mid-career, and senior levels.',
    color: 'text-amber-500',
    bg: 'bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-amber-900/20',
    iconBg: 'bg-amber-100 dark:bg-amber-900/50',
    span: '',
  },
  {
    icon: Briefcase,
    title: 'Real Job Links',
    description: 'Direct links to job searches on LinkedIn, Naukri, Indeed — see what\'s actually out there.',
    color: 'text-blue-500',
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    span: '',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your API key stays in your browser. Your data is never stored on our servers. Complete privacy guaranteed.',
    color: 'text-rose-500',
    bg: 'bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/40 dark:to-rose-900/20',
    iconBg: 'bg-rose-100 dark:bg-rose-900/50',
    span: 'sm:col-span-2',
  },
];

const inputMethods = [
  {
    icon: FileText,
    label: 'Paste Text',
    desc: 'Type or paste your grades, interests, and career goals. Be as messy as you want.',
    gradient: 'from-blue-500 to-indigo-600',
    lightBg: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    icon: Image,
    label: 'Upload Image',
    desc: 'Snap a photo of your marksheet, transcript, or resume. AI will extract all the data.',
    gradient: 'from-purple-500 to-pink-600',
    lightBg: 'bg-purple-50 dark:bg-purple-950/30',
  },
  {
    icon: Mic,
    label: 'Voice Input',
    desc: 'Just talk about yourself naturally. We\'ll transcribe and analyze your words.',
    gradient: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
];

const audiences = [
  { icon: GraduationCap, label: 'Class 8-10', desc: 'Explore streams & early career direction', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  { icon: BookOpen, label: 'Class 11-12', desc: 'Pick the right degree & college path', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30' },
  { icon: Users, label: 'Undergrads', desc: 'Find your specialization & first job', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  { icon: Briefcase, label: 'Professionals', desc: 'Switch careers with a solid plan', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
];

const stats = [
  { value: '500+', label: 'Career Paths Mapped', icon: Globe },
  { value: '3', label: 'Pathways Per Analysis', icon: Target },
  { value: '<30s', label: 'Results Generated', icon: Zap },
  { value: '100%', label: 'Free to Use', icon: CheckCircle2 },
];

interface Props {
  onGetStarted: () => void;
}

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-24" id="features">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <Badge variant="secondary" className="mb-4 px-3 py-1">
          <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" /> Features
        </Badge>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          From messy data to{' '}
          <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">actionable roadmap</span>
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
          PathBridge uses advanced AI to understand your academic background, interests, and goals — then generates personalized career pathways.
        </p>
      </motion.div>

      {/* Bento grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {features.map((feat, i) => (
          <motion.div
            key={feat.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={feat.span}
          >
            <Card className={`h-full border-border/40 ${feat.bg} hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group overflow-hidden`}>
              <CardContent className="p-6 sm:p-7">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${feat.iconBg} mb-5 transition-transform duration-200 group-hover:scale-110`}>
                  <feat.icon className={`h-6 w-6 ${feat.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
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
    <section className="py-20 sm:py-24" id="input-methods">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <Badge variant="secondary" className="mb-4 px-3 py-1">
          <Zap className="mr-1.5 h-3.5 w-3.5 text-primary" /> Input Methods
        </Badge>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Three ways to{' '}
          <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">share your story</span>
        </h2>
        <p className="mt-3 text-muted-foreground text-lg">No forms. No structure needed. Just be yourself.</p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-3">
        {inputMethods.map((method, i) => (
          <motion.div
            key={method.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1, type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Card className="h-full border-border/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group overflow-hidden">
              <CardContent className="p-7 flex flex-col items-center text-center">
                <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${method.gradient} text-white shadow-lg transition-transform duration-200 group-hover:scale-110`}>
                  <method.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{method.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{method.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function AudienceSection() {
  return (
    <section className="py-20 sm:py-24" id="audience">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <Badge variant="secondary" className="mb-4 px-3 py-1">
          <Users className="mr-1.5 h-3.5 w-3.5 text-primary" /> Who is it for
        </Badge>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Built for{' '}
          <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">every stage</span>
        </h2>
        <p className="mt-3 text-muted-foreground text-lg">From school students to career switchers — PathBridge adapts to you.</p>
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
            <Card className="h-full border-border/40 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${aud.bg} transition-transform duration-200 group-hover:scale-110`}>
                  <aud.icon className={`h-7 w-7 ${aud.color}`} />
                </div>
                <h3 className="font-semibold mb-1">{aud.label}</h3>
                <p className="text-sm text-muted-foreground">{aud.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function StatsSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="rounded-3xl border border-border/40 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 p-8 sm:p-12">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-br from-primary to-purple-500 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection({ onGetStarted }: Props) {
  return (
    <section className="py-16 sm:py-20 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-indigo-600 to-purple-700 p-10 sm:p-16 text-center text-white shadow-2xl shadow-primary/20">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-white/3" />
          </div>

          <div className="relative z-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <Compass className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to find your path?</h2>
            <p className="mt-4 text-lg text-white/80 max-w-lg mx-auto">
              No signup. No cost. Just paste your background and let AI do the heavy lifting.
            </p>
            <Button
              size="lg"
              className="mt-8 cursor-pointer text-base font-semibold bg-white text-primary hover:bg-white/90 shadow-lg h-12 px-8"
              onClick={onGetStarted}
            >
              Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
