import {
  buildUserPrompt,
  buildFollowUpSystemPrompt,
  buildComparisonPrompt,
  buildAvatarPrompt,
  buildRoadmapIllustrationPrompt,
  EXAMPLE_INPUTS,
  SYSTEM_PROMPT,
} from '@/lib/prompts';

import type { StudentProfile, CareerPath } from '@/lib/types';

// ===== Fixtures =====

const mockProfile: StudentProfile = {
  education_level: 'school_11_12',
  current_status: '12th grade student',
  age_range: '16-18',
  region: 'India',
  grades_summary: '90% aggregate',
  strengths: ['biology', 'drawing', 'communication'],
  dislikes: ['math'],
  interests: ['healthcare', 'art', 'research'],
  skills: ['sketching', 'lab work'],
  constraints: ['limited budget'],
  experience: 'none',
};

const mockCareerPath: CareerPath = {
  rank: 1,
  path_type: 'best_fit',
  title: 'UX Designer',
  emoji: '',
  match_score: 88,
  why_this_fits: 'Great fit because of creative skills.',
  education_roadmap: [
    { step: 1, action: 'Complete 12th', timeline: '1 year', details: 'Focus on design' },
    { step: 2, action: 'Join design school', timeline: '3 years', details: 'BDes program' },
  ],
  skills_to_build: [
    { skill: 'Figma', priority: 'critical', resource: { name: 'Figma 101', url: 'https://example.com', type: 'course' } },
  ],
  timeline: { '6_months': 'Learn basics', '1_year': 'Portfolio', '3_years': 'Junior role', '5_years': 'Senior role' },
  salary_expectations: { currency: 'INR', entry_level: '4-6 LPA', mid_career: '10-15 LPA', senior: '20-30 LPA' },
  job_links: [],
};

const mockCareerPath2: CareerPath = {
  ...mockCareerPath,
  rank: 2,
  path_type: 'ambitious_stretch',
  title: 'Data Scientist',
  match_score: 72,
  why_this_fits: 'Stretch goal with good potential.',
};

// ===== Tests =====

describe('SYSTEM_PROMPT', () => {
  it('is a non-empty string', () => {
    expect(typeof SYSTEM_PROMPT).toBe('string');
    expect(SYSTEM_PROMPT.length).toBeGreaterThan(0);
  });
});

describe('EXAMPLE_INPUTS', () => {
  it('is an array of 3 items', () => {
    expect(Array.isArray(EXAMPLE_INPUTS)).toBe(true);
    expect(EXAMPLE_INPUTS).toHaveLength(3);
  });

  it('each item has label and text', () => {
    for (const item of EXAMPLE_INPUTS) {
      expect(typeof item.label).toBe('string');
      expect(item.label.length).toBeGreaterThan(0);
      expect(typeof item.text).toBe('string');
      expect(item.text.length).toBeGreaterThan(0);
    }
  });
});

describe('buildUserPrompt', () => {
  it('includes the input type', () => {
    const result = buildUserPrompt({ inputType: 'text', userInput: 'hello' });
    expect(result).toContain('INPUT TYPE: text');
  });

  it('includes the raw user input', () => {
    const result = buildUserPrompt({ inputType: 'text', userInput: 'my grades are 90%' });
    expect(result).toContain('my grades are 90%');
  });

  it('includes image text section when imageText is provided', () => {
    const result = buildUserPrompt({
      inputType: 'image',
      userInput: '',
      imageText: 'OCR result here',
    });
    expect(result).toContain('EXTRACTED FROM IMAGE');
    expect(result).toContain('OCR result here');
  });

  it('does NOT include image text section when imageText is absent', () => {
    const result = buildUserPrompt({ inputType: 'text', userInput: 'hi' });
    expect(result).not.toContain('EXTRACTED FROM IMAGE');
  });

  it('includes voice transcript section when voiceTranscript is provided', () => {
    const result = buildUserPrompt({
      inputType: 'voice',
      userInput: '',
      voiceTranscript: 'spoken words',
    });
    expect(result).toContain('VOICE TRANSCRIPT');
    expect(result).toContain('spoken words');
  });

  it('does NOT include voice transcript section when voiceTranscript is absent', () => {
    const result = buildUserPrompt({ inputType: 'text', userInput: 'hi' });
    expect(result).not.toContain('VOICE TRANSCRIPT');
  });

  it('always includes JSON schema instructions', () => {
    const result = buildUserPrompt({ inputType: 'text', userInput: 'hi' });
    expect(result).toContain('"profile"');
    expect(result).toContain('"career_paths"');
  });
});

describe('buildFollowUpSystemPrompt', () => {
  it('replaces profile placeholder with serialised profile', () => {
    const result = buildFollowUpSystemPrompt(mockProfile, mockCareerPath);
    expect(result).toContain('"education_level": "school_11_12"');
    expect(result).not.toContain('{{PROFILE}}');
  });

  it('replaces career path placeholder with serialised career path', () => {
    const result = buildFollowUpSystemPrompt(mockProfile, mockCareerPath);
    expect(result).toContain('"title": "UX Designer"');
    expect(result).not.toContain('{{CAREER_PATH}}');
  });
});

describe('buildComparisonPrompt', () => {
  it('replaces all placeholders', () => {
    const result = buildComparisonPrompt(mockProfile, mockCareerPath, mockCareerPath2);
    expect(result).not.toContain('{{PROFILE}}');
    expect(result).not.toContain('{{PATH1_TITLE}}');
    expect(result).not.toContain('{{PATH1}}');
    expect(result).not.toContain('{{PATH2_TITLE}}');
    expect(result).not.toContain('{{PATH2}}');
  });

  it('includes profile data', () => {
    const result = buildComparisonPrompt(mockProfile, mockCareerPath, mockCareerPath2);
    expect(result).toContain('"education_level": "school_11_12"');
  });

  it('includes both career path titles', () => {
    const result = buildComparisonPrompt(mockProfile, mockCareerPath, mockCareerPath2);
    expect(result).toContain('UX Designer');
    expect(result).toContain('Data Scientist');
  });
});

describe('buildAvatarPrompt', () => {
  it('includes interests from the profile', () => {
    const result = buildAvatarPrompt(mockProfile);
    expect(result).toContain('healthcare');
    expect(result).toContain('art');
  });

  it('includes strengths from the profile', () => {
    const result = buildAvatarPrompt(mockProfile);
    expect(result).toContain('biology');
    expect(result).toContain('drawing');
  });

  it('includes the education level in human-readable form', () => {
    const result = buildAvatarPrompt(mockProfile);
    // underscores replaced with spaces
    expect(result).toContain('school 11 12');
  });
});

describe('buildRoadmapIllustrationPrompt', () => {
  it('includes the career title', () => {
    const result = buildRoadmapIllustrationPrompt(mockCareerPath);
    expect(result).toContain('UX Designer');
  });

  it('includes the last roadmap step as milestone', () => {
    const result = buildRoadmapIllustrationPrompt(mockCareerPath);
    expect(result).toContain('Join design school');
  });
});
