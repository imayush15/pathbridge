import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Compass, Code2, Brain, Shield, Sparkles, Globe,
  FileJson, Zap, Database, Lock, ArrowLeft
} from 'lucide-react';

const techStack = [
  { icon: Code2, name: 'React + TypeScript', desc: 'Type-safe UI with modern React 18 patterns' },
  { icon: Zap, name: 'Vite', desc: 'Instant HMR, lightning-fast builds' },
  { icon: FileJson, name: 'Tailwind CSS v4', desc: 'Utility-first styling with custom design tokens' },
  { icon: Database, name: 'shadcn/ui', desc: 'Premium, accessible component library' },
  { icon: Brain, name: 'AI Engine', desc: 'Multimodal AI with structured output' },
  { icon: Sparkles, name: 'Framer Motion', desc: 'Spring-physics animations, scroll reveals' },
];

const howItWorks = [
  {
    step: 1,
    title: 'You share your story',
    description: 'Text, image, or voice — share your grades, interests, skills, and constraints in any format. No structured forms.',
  },
  {
    step: 2,
    title: 'AI processes everything',
    description: 'Our 6-step reasoning chain (EXTRACT → INFER → PROFILE → MATCH → RANK → PLAN) builds a comprehensive understanding of you.',
  },
  {
    step: 3,
    title: 'You get 3 career pathways',
    description: 'Each with education roadmaps, skills to build, timeline milestones, salary expectations, and real job links.',
  },
];

const privacyPoints = [
  { icon: Lock, text: 'API key stored only in your browser\'s localStorage' },
  { icon: Shield, text: 'Data processed securely — never stored on our servers' },
  { icon: Database, text: 'No server, no database, no tracking' },
  { icon: Globe, text: 'Open source — inspect every line of code' },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header onOpenApiKey={() => {}} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        {/* Back button */}
        <Button variant="ghost" className="mb-6 cursor-pointer" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white">
            <Compass className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">About PathBridge</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-lg">
            An AI-powered career pathway navigator that turns messy academic data into actionable career roadmaps. Designed for impact.
          </p>
        </motion.div>

        {/* How it Works */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-lg mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Tech Stack</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 rounded-xl border border-border/50 bg-card/50 p-4"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                  <tech.icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{tech.name}</p>
                  <p className="text-xs text-muted-foreground">{tech.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Privacy */}
        <section className="mb-16">
          <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Shield className="h-5 w-5" /> Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {privacyPoints.map((point, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <point.icon className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm text-green-800 dark:text-green-200">{point.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Credits */}
        <section className="mb-8 text-center">
          <p className="text-muted-foreground text-sm">
            Built during{' '}
            the <Badge variant="secondary">PathBridge</Badge>{' '}
            team
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
