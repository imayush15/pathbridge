import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, User } from 'lucide-react';
import { motion } from 'framer-motion';
import type { StudentProfile } from '@/lib/types';

interface Props {
  profile: StudentProfile;
  confidence: 'high' | 'medium' | 'low';
  missingInfo: string[];
}

const confidenceConfig = {
  high: { icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800', label: 'High Confidence' },
  medium: { icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800', label: 'Medium Confidence' },
  low: { icon: AlertCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', label: 'Low Confidence' },
};

export function ProfileCard({ profile, confidence, missingInfo }: Props) {
  const conf = confidenceConfig[confidence];
  const ConfIcon = conf.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border/40 bg-card/90 backdrop-blur-sm shadow-lg shadow-primary/5 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="flex items-center gap-2.5 text-xl">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            Your Profile
          </CardTitle>
          <div className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${conf.bg} ${conf.color} border ${conf.border}`}>
            <ConfIcon className="h-3.5 w-3.5" />
            {conf.label}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <InfoItem label="Level" value={profile.education_level.replace(/_/g, ' ')} />
            <InfoItem label="Status" value={profile.current_status} />
            <InfoItem label="Region" value={profile.region} />
            <InfoItem label="Age" value={profile.age_range} />
          </div>

          {profile.grades_summary ? (
            <div className="rounded-xl bg-muted/40 p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Grades Summary</p>
              <p className="text-sm leading-relaxed">{profile.grades_summary}</p>
            </div>
          ) : null}

          {/* Tags */}
          <div className="space-y-4">
            {profile.strengths.length > 0 ? (
              <TagRow label="Strengths" items={profile.strengths} variant="green" />
            ) : null}
            {profile.interests.length > 0 ? (
              <TagRow label="Interests" items={profile.interests} variant="indigo" />
            ) : null}
            {profile.skills.length > 0 ? (
              <TagRow label="Skills" items={profile.skills} variant="purple" />
            ) : null}
            {profile.dislikes.length > 0 ? (
              <TagRow label="Dislikes" items={profile.dislikes} variant="red" />
            ) : null}
            {profile.constraints.length > 0 ? (
              <TagRow label="Constraints" items={profile.constraints} variant="yellow" />
            ) : null}
          </div>

          {/* Missing info */}
          {missingInfo.length > 0 ? (
            <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-4">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                <Info className="h-3.5 w-3.5" /> For better results, share:
              </p>
              <ul className="list-disc pl-5 text-xs text-blue-600 dark:text-blue-400 space-y-1">
                {missingInfo.map((info, i) => <li key={i}>{info}</li>)}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/40 p-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold capitalize">{value}</p>
    </div>
  );
}

const variantClasses = {
  green: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50',
  indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-800/50',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200/50 dark:border-purple-800/50',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200/50 dark:border-red-800/50',
  yellow: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/50',
};

function TagRow({ label, items, variant }: { label: string; items: string[]; variant: keyof typeof variantClasses }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <Badge key={i} variant="secondary" className={`text-xs px-2.5 py-1 border ${variantClasses[variant]}`}>
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}
