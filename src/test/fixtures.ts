import type { StudentProfile, CareerPath, PathBridgeResponse, ConversationEntry, ComparisonResult } from '@/lib/types';

export function createMockProfile(overrides?: Partial<StudentProfile>): StudentProfile {
  return {
    education_level: 'undergraduate',
    current_status: 'Final year B.Tech student',
    age_range: '20-22',
    region: 'India',
    grades_summary: '8.5 CGPA in Computer Science',
    strengths: ['Problem solving', 'Communication', 'Teamwork'],
    dislikes: ['Monotonous work'],
    interests: ['AI/ML', 'Web Development', 'Data Science'],
    skills: ['Python', 'React', 'SQL'],
    constraints: ['6-month timeline'],
    experience: '1 internship at a startup',
    ...overrides,
  };
}

export function createMockCareerPath(overrides?: Partial<CareerPath>): CareerPath {
  return {
    rank: 1,
    path_type: 'best_fit',
    title: 'Full-Stack Developer',
    emoji: '💻',
    match_score: 88,
    why_this_fits: 'Your React skills and problem-solving ability make this a natural fit.',
    education_roadmap: [
      { step: 1, action: 'Complete Node.js course', timeline: '1-2 months', details: 'Learn backend with Express.js' },
      { step: 2, action: 'Build portfolio projects', timeline: '2-3 months', details: 'Create 3 full-stack projects' },
    ],
    skills_to_build: [
      { skill: 'Node.js', priority: 'critical', resource: { name: 'Node.js Course', url: 'https://example.com', type: 'course' } },
      { skill: 'Docker', priority: 'important', resource: { name: 'Docker Guide', url: 'https://example.com', type: 'course' } },
      { skill: 'GraphQL', priority: 'nice_to_have', resource: { name: 'GraphQL Docs', url: 'https://example.com', type: 'course' } },
    ],
    timeline: {
      '6_months': 'Land first full-stack role',
      '1_year': 'Senior developer at mid-size company',
      '3_years': 'Tech lead',
      '5_years': 'Engineering manager or startup CTO',
    },
    salary_expectations: {
      currency: 'INR',
      entry_level: '8-12 LPA',
      mid_career: '18-25 LPA',
      senior: '30-45 LPA',
    },
    job_links: [
      { platform: 'LinkedIn', search_url: 'https://linkedin.com/jobs', description: 'Full-stack developer roles' },
    ],
    ...overrides,
  };
}

export function createMockResponse(overrides?: Partial<PathBridgeResponse>): PathBridgeResponse {
  return {
    profile: createMockProfile(),
    confidence: 'high',
    missing_info: [],
    career_paths: [
      createMockCareerPath(),
      createMockCareerPath({ rank: 2, path_type: 'ambitious_stretch', title: 'AI/ML Engineer', match_score: 72, emoji: '🤖' }),
      createMockCareerPath({ rank: 3, path_type: 'practical_safety', title: 'Data Analyst', match_score: 65, emoji: '📊' }),
    ],
    ...overrides,
  };
}

export function createMockConversation(overrides?: Partial<ConversationEntry>): ConversationEntry {
  return {
    question: 'What certifications should I get?',
    answer: 'I recommend starting with AWS Cloud Practitioner certification.',
    timestamp: Date.now(),
    groundingChunks: [{ uri: 'https://example.com', title: 'AWS Certifications' }],
    ...overrides,
  };
}

export function createMockComparison(overrides?: Partial<ComparisonResult>): ComparisonResult {
  return {
    summary: 'Full-Stack Developer offers a more immediate transition while AI/ML Engineer has higher growth potential.',
    dimensions: [
      { label: 'Match Score', path1Value: '88%', path2Value: '72%', winner: 1 },
      { label: 'Growth Potential', path1Value: 'High', path2Value: 'Very High', winner: 2 },
      { label: 'Timeline to First Job', path1Value: '3 months', path2Value: '6 months', winner: 1 },
      { label: 'Risk Level', path1Value: 'Low', path2Value: 'High', winner: 1 },
    ],
    groundingChunks: [{ uri: 'https://example.com', title: 'Career Comparison' }],
    ...overrides,
  };
}
