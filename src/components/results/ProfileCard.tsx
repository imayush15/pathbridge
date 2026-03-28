import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import type { StudentProfile } from '@/lib/types';

interface Props {
  profile: StudentProfile;
  confidence: 'high' | 'medium' | 'low';
  missingInfo: string[];
}

const confidenceConfig = {
  high: { icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800', label: 'High Confidence' },
  medium: { icon: AlertTriangle, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-950/30', border: 'border-yellow-200 dark:border-yellow-800', label: 'Medium Confidence' },
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
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Info className="h-5 w-5 text-primary" />
            Your Profile
          </CardTitle>
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${conf.bg} ${conf.color} border ${conf.border}`}>
            <ConfIcon className="h-3.5 w-3.5" />
            {conf.label}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <InfoItem label="Level" value={profile.education_level.replace(/_/g, ' ')} />
            <InfoItem label="Status" value={profile.current_status} />
            <InfoItem label="Region" value={profile.region} />
            <InfoItem label="Age" value={profile.age_range} />
          </div>

          {profile.grades_summary && (
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Grades Summary</p>
              <p className="text-sm">{profile.grades_summary}</p>
            </div>
          )}

          {/* Tags */}
          <div className="space-y-3">
            {profile.strengths.length > 0 && (
              <TagRow label="Strengths" items={profile.strengths} variant="green" />
            )}
            {profile.interests.length > 0 && (
              <TagRow label="Interests" items={profile.interests} variant="indigo" />
            )}
            {profile.skills.length > 0 && (
              <TagRow label="Skills" items={profile.skills} variant="purple" />
            )}
            {profile.dislikes.length > 0 && (
              <TagRow label="Dislikes" items={profile.dislikes} variant="red" />
            )}
            {profile.constraints.length > 0 && (
              <TagRow label="Constraints" items={profile.constraints} variant="yellow" />
            )}
          </div>

          {/* Missing info */}
          {missingInfo.length > 0 && (
            <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-3">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-1">
                <Info className="h-3.5 w-3.5" /> For better results, share:
              </p>
              <ul className="list-disc pl-5 text-xs text-blue-600 dark:text-blue-400 space-y-0.5">
                {missingInfo.map((info, i) => <li key={i}>{info}</li>)}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 p-2.5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium capitalize">{value}</p>
    </div>
  );
}

const variantClasses = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
};

function TagRow({ label, items, variant }: { label: string; items: string[]; variant: keyof typeof variantClasses }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <Badge key={i} variant="secondary" className={`text-xs ${variantClasses[variant]}`}>
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}
