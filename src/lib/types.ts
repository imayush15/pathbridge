// ===== TypeScript Interfaces =====

export interface StudentProfile {
  education_level: 'school_8_10' | 'school_11_12' | 'undergraduate' | 'postgraduate' | 'working_professional' | 'career_switcher';
  current_status: string;
  age_range: string;
  region: string;
  grades_summary: string;
  strengths: string[];
  dislikes: string[];
  interests: string[];
  skills: string[];
  constraints: string[];
  experience: string;
}

export interface EducationStep {
  step: number;
  action: string;
  timeline: string;
  details: string;
}

export interface SkillResource {
  name: string;
  url: string;
  type: 'course' | 'certification' | 'practice' | 'book';
}

export interface SkillToBuild {
  skill: string;
  priority: 'critical' | 'important' | 'nice_to_have';
  resource: SkillResource;
}

export interface CareerTimeline {
  '6_months': string;
  '1_year': string;
  '3_years': string;
  '5_years': string;
}

export interface SalaryExpectations {
  currency: 'INR' | 'USD' | 'EUR';
  entry_level: string;
  mid_career: string;
  senior: string;
}

export interface JobLink {
  platform: string;
  search_url: string;
  description: string;
}

export interface CareerPath {
  rank: number;
  path_type: 'best_fit' | 'ambitious_stretch' | 'practical_safety';
  title: string;
  emoji: string;
  match_score: number;
  why_this_fits: string;
  education_roadmap: EducationStep[];
  skills_to_build: SkillToBuild[];
  timeline: CareerTimeline;
  salary_expectations: SalaryExpectations;
  job_links: JobLink[];
}

export interface PathBridgeResponse {
  profile: StudentProfile;
  confidence: 'high' | 'medium' | 'low';
  missing_info: string[];
  career_paths: CareerPath[];
}

export interface ConversationEntry {
  question: string;
  answer: string;
  timestamp: number;
  groundingChunks?: GroundingChunk[];
}

export interface GroundingChunk {
  uri: string;
  title: string;
}

export interface ComparisonResult {
  summary: string;
  dimensions: ComparisonDimension[];
  groundingChunks?: GroundingChunk[];
}

export interface ComparisonDimension {
  label: string;
  path1Value: string;
  path2Value: string;
  winner: 1 | 2 | 'tie';
}

export type InputType = 'text' | 'image' | 'voice' | 'mixed';

export interface AnalysisInput {
  type: InputType;
  text?: string;
  imageBase64?: string;
  imageMimeType?: string;
  voiceTranscript?: string;
}
