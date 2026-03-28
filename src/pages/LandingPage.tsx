import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/layout/Footer';
import {
  ArrowRight, Sparkles, Compass, BookOpen, TrendingUp, Target,
  Brain, Shield, Briefcase, FileText, Image, GraduationCap, Users,
  Zap, Globe, CheckCircle2, ArrowDown, ChevronRight, Star,
  Code2, FileJson, Database, Lock, Play
} from 'lucide-react';

/* ───────── data ───────── */

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

const audiences = [
  { icon: GraduationCap, label: 'Class 8-10', desc: 'Explore streams & early career direction', color: 'text-blue-500', gradient: 'from-blue-500 to-blue-600' },
  { icon: BookOpen, label: 'Class 11-12', desc: 'Pick the right degree & college path', color: 'text-purple-500', gradient: 'from-purple-500 to-purple-600' },
  { icon: Users, label: 'Undergrads', desc: 'Find your specialization & first job', color: 'text-emerald-500', gradient: 'from-emerald-500 to-emerald-600' },
  { icon: Briefcase, label: 'Professionals', desc: 'Switch careers with a solid plan', color: 'text-amber-500', gradient: 'from-amber-500 to-amber-600' },
];

const howItWorks = [
  { step: 1, title: 'Share your story', desc: 'Paste grades, upload marksheets, or just describe yourself in plain text.', icon: FileText },
  { step: 2, title: 'AI analyzes everything', desc: 'Our AI extracts, infers, profiles, matches, ranks, and plans — in seconds.', icon: Brain },
  { step: 3, title: 'Get your roadmap', desc: '3 personalized career paths with education steps, skills, timelines, and job links.', icon: Target },
];

const stats = [
  { value: '3', label: 'Career Paths Per Analysis', icon: Target },
  { value: '<30s', label: 'Results Generated', icon: Zap },
  { value: '100%', label: 'Privacy Guaranteed', icon: Shield },
  { value: 'Free', label: 'No Sign Up Required', icon: CheckCircle2 },
];

const techStack = [
  { icon: Code2, name: 'React 19 + TypeScript' },
  { icon: Zap, name: 'Vite' },
  { icon: FileJson, name: 'Tailwind CSS v4' },
  { icon: Database, name: 'shadcn/ui' },
  { icon: Brain, name: 'AI Engine' },
  { icon: Sparkles, name: 'Framer Motion' },
];

/* ───────── animation helpers ───────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ───────── page ───────── */

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const goToApp = () => navigate('/app');

  return (
    <div className="flex min-h-dvh flex-col bg-background overflow-x-hidden">

      {/* ═══════ NAVBAR ═══════ */}
      <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-3 text-foreground no-underline group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/25 transition-transform duration-200 group-hover:scale-105">
              <Compass className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">PathBridge</span>
          </a>
          <nav className="hidden sm:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#audience" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Who it's For</a>
          </nav>
          <Button
            size="sm"
            className="cursor-pointer font-semibold shadow-md shadow-primary/20 hover:shadow-primary/30 transition-shadow"
            onClick={goToApp}
          >
            Try Now <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      <main className="flex-1">

        {/* ═══════ HERO ═══════ */}
        <section ref={heroRef} className="hero-gradient dot-grid relative min-h-[92vh] flex items-center">
          {/* Floating shapes */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="animate-float absolute top-20 left-[8%] h-24 w-24 rounded-3xl bg-primary/5 border border-primary/10 rotate-12" />
            <div className="animate-float-delay absolute top-32 right-[10%] h-20 w-20 rounded-full bg-purple-500/5 border border-purple-500/10" />
            <div className="animate-float-slow absolute bottom-32 left-[15%] h-16 w-16 rounded-xl bg-pink-500/5 border border-pink-500/10 -rotate-12" />
            <div className="animate-float absolute bottom-40 right-[15%] h-14 w-14 rounded-full bg-indigo-500/5 border border-indigo-500/10" />
            <div className="animate-float-delay absolute top-1/2 left-[5%] h-10 w-10 rounded-lg bg-emerald-500/5 border border-emerald-500/10 rotate-45" />
            <div className="animate-float-slow absolute top-[20%] right-[5%] h-12 w-12 rounded-2xl bg-amber-500/5 border border-amber-500/10" />
          </div>

          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-12 pb-20"
          >
            <div className="text-center max-w-4xl mx-auto">
              <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                <Badge variant="secondary" className="mb-8 px-4 py-2 text-sm font-medium shadow-sm border-primary/20">
                  <Sparkles className="mr-2 h-4 w-4 text-primary" /> AI-Powered Career Navigator
                </Badge>
              </motion.div>

              <motion.h1
                initial="hidden"
                animate="visible"
                custom={1}
                variants={fadeUp}
                className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-8xl leading-[1.05]"
              >
                Your career pathway,
                <br />
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  mapped by AI
                </span>
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                custom={2}
                variants={fadeUp}
                className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed"
              >
                Drop your messy academic data — grades, interests, even a photo of your marksheet — and get
                a structured, actionable career roadmap in seconds.
              </motion.p>

              <motion.div
                initial="hidden"
                animate="visible"
                custom={3}
                variants={fadeUp}
                className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              >
                <Button
                  size="lg"
                  className="cursor-pointer font-semibold px-10 h-14 text-lg shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98] pulse-glow"
                  onClick={goToApp}
                >
                  <Play className="mr-2 h-5 w-5" /> Try Now — It's Free
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="cursor-pointer h-14 text-lg px-8"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  See How it Works <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>

              {/* Feature pills */}
              <motion.div
                initial="hidden"
                animate="visible"
                custom={5}
                variants={fadeUp}
                className="mt-16 flex flex-wrap items-center justify-center gap-3"
              >
                {[
                  { icon: Target, label: '3 Career Paths', color: 'text-emerald-500' },
                  { icon: BookOpen, label: 'Education Roadmaps', color: 'text-blue-500' },
                  { icon: TrendingUp, label: 'Salary Insights', color: 'text-amber-500' },
                  { icon: Compass, label: 'Job Links', color: 'text-purple-500' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm px-5 py-2.5 shadow-sm"
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
              transition={{ delay: 1.5 }}
              className="flex justify-center mt-20"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex flex-col items-center gap-2 text-muted-foreground/50"
              >
                <span className="text-xs font-medium uppercase tracking-widest">Discover more</span>
                <ArrowDown className="h-4 w-4" />
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════ SOCIAL PROOF / STATS STRIP ═══════ */}
        <section className="border-y border-border/30 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
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

        {/* ═══════ HOW IT WORKS ═══════ */}
        <section id="how-it-works" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4 px-3 py-1">
                <Zap className="mr-1.5 h-3.5 w-3.5 text-primary" /> Simple Process
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Three steps to your{' '}
                <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">career roadmap</span>
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
                No forms, no sign-ups. Just tell us about yourself and let AI do the rest.
              </p>
            </motion.div>

            <div className="grid gap-8 sm:grid-cols-3 relative">
              {/* Connecting line */}
              <div className="hidden sm:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

              {howItWorks.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="relative"
                >
                  <Card className="h-full border-border/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group overflow-hidden bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <div className="relative mx-auto mb-6">
                        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                          <item.icon className="h-7 w-7" />
                        </div>
                        <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-background border-2 border-primary text-primary text-xs font-bold shadow-sm">
                          {item.step}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ FEATURES BENTO ═══════ */}
        <section id="features" className="py-24 sm:py-32 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4 px-3 py-1">
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" /> Features
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Everything you need to{' '}
                <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">find your path</span>
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
                PathBridge uses advanced AI to understand your background, interests, and goals — then generates personalized career pathways.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid gap-4 sm:grid-cols-3"
            >
              {features.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  variants={fadeUp}
                  custom={i}
                  className={feat.span}
                >
                  <Card className={`h-full border-border/40 ${feat.bg} hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group overflow-hidden`}>
                    <CardContent className="p-7 sm:p-8">
                      <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feat.iconBg} mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        <feat.icon className={`h-7 w-7 ${feat.color}`} />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feat.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════ INPUT METHODS ═══════ */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4 px-3 py-1">
                <Zap className="mr-1.5 h-3.5 w-3.5 text-primary" /> Flexible Input
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Two ways to{' '}
                <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">share your story</span>
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">No forms. No structure needed. Just be yourself.</p>
            </motion.div>

            <div className="grid gap-8 sm:grid-cols-2 max-w-3xl mx-auto">
              {[
                {
                  icon: FileText,
                  label: 'Paste Text',
                  desc: 'Type or paste your grades, interests, and career goals. Be as messy as you want — AI understands it all.',
                  gradient: 'from-blue-500 to-indigo-600',
                },
                {
                  icon: Image,
                  label: 'Upload Image',
                  desc: 'Snap a photo of your marksheet, transcript, or resume. AI will extract all the relevant data automatically.',
                  gradient: 'from-purple-500 to-pink-600',
                },
              ].map((method, i) => (
                <motion.div
                  key={method.label}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                >
                  <Card className="h-full border-border/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group overflow-hidden">
                    <CardContent className="p-10 flex flex-col items-center text-center">
                      <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${method.gradient} text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        <method.icon className="h-9 w-9" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{method.label}</h3>
                      <p className="text-muted-foreground leading-relaxed">{method.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ AUDIENCE ═══════ */}
        <section id="audience" className="py-24 sm:py-32 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4 px-3 py-1">
                <Users className="mr-1.5 h-3.5 w-3.5 text-primary" /> Who it's for
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Built for{' '}
                <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">every stage</span>
              </h2>
              <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
                From school students to career switchers — PathBridge adapts to where you are in life.
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {audiences.map((aud, i) => (
                <motion.div
                  key={aud.label}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                >
                  <Card className="h-full border-border/40 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group">
                    <CardContent className="p-8 text-center">
                      <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${aud.gradient} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        <aud.icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{aud.label}</h3>
                      <p className="text-sm text-muted-foreground">{aud.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ TECH STACK ═══════ */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mb-10"
            >
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Built with modern tech</p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              {techStack.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  variants={fadeUp}
                  custom={i}
                  className="flex items-center gap-2.5 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm px-5 py-2.5"
                >
                  <tech.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{tech.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════ FINAL CTA ═══════ */}
        <section className="py-20 sm:py-28 px-4">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-indigo-600 to-purple-700 p-12 sm:p-20 text-center text-white shadow-2xl shadow-primary/20">
                {/* Background decoration */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                  <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/5" />
                  <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-white/[0.03]" />
                </div>

                <div className="relative z-10">
                  <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-sm">
                    <Compass className="h-10 w-10" />
                  </div>
                  <h2 className="text-4xl font-extrabold sm:text-5xl">Ready to find your path?</h2>
                  <p className="mt-5 text-xl text-white/80 max-w-lg mx-auto">
                    No signup. No cost. Just paste your background and let AI do the heavy lifting.
                  </p>
                  <Button
                    size="lg"
                    className="mt-10 cursor-pointer text-lg font-semibold bg-white text-primary hover:bg-white/90 shadow-xl h-14 px-10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    onClick={goToApp}
                  >
                    Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
