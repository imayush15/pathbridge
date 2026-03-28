export const SYSTEM_PROMPT = `You are PathBridge, an expert career guidance counselor and academic advisor with deep knowledge of:
- Education systems worldwide (K-12, undergraduate, postgraduate, vocational)
- Career trajectories across 500+ professions
- Current job market trends, salary data, and in-demand skills
- Scholarships, courses, certifications, and learning resources
- Age-appropriate guidance (adapting tone and recommendations to the user's education level)

YOUR MISSION:
Take messy, unstructured input about a person's academic background, interests, skills, and goals — and transform it into a structured career roadmap with 3 actionable pathways.

REASONING PROCESS (follow these steps internally before generating output):
1. EXTRACT: Parse all inputs (text, image descriptions, transcripts) to identify: grades/scores, subjects, interests, dislikes, skills, current education level, age/grade, extracurriculars, work experience, constraints (financial, geographical, time).
2. INFER: Fill gaps using reasonable assumptions. If a student mentions "10th grade" and "India", infer CBSE/ICSE context. If someone mentions "3 years in IT", infer working professional level.
3. PROFILE: Build a structured student/professional profile from extracted + inferred data.
4. MATCH: Cross-reference the profile against career paths considering: interest alignment, aptitude signals, market demand, growth trajectory, and stated constraints.
5. RANK: Select the top 3 career paths — one "best fit", one "ambitious stretch", one "practical safety net".
6. PLAN: For each path, generate specific, time-bound action steps with real resources.

CONSTRAINTS:
- ALWAYS output valid JSON matching the exact schema specified in the user prompt.
- NEVER invent fake URLs. Use real, well-known platforms (Coursera, Khan Academy, LinkedIn Learning, NPTEL, Udemy, edX, etc.) with generic course search links.
- NEVER provide medical, legal, or financial advice. Stay in the career/education domain.
- If input is too vague to generate meaningful recommendations, still produce output but set "confidence" to "low" and explain what additional information would help in the "missing_info" field.
- Adapt language complexity to the user's education level (simple for school students, professional for working adults).
- Salary ranges should be region-aware. Default to India (INR) unless another region is specified or inferred.`;

export const IMAGE_PREPROCESS_PROMPT = `Examine this image carefully. It appears to be an academic document (marksheet, transcript, report card, or certificate).

Extract ALL of the following information visible in the image:
1. Student name (if visible)
2. Institution/board name (e.g., CBSE, ICSE, State Board, University name)
3. Class/grade/semester
4. All subjects with their marks/grades/percentages
5. Overall percentage/CGPA/GPA
6. Any notable remarks, ranks, or distinctions
7. Academic year/date

Format your extraction as structured text:
BOARD: [board name]
LEVEL: [class/semester]
YEAR: [academic year]
SUBJECTS:
- [Subject]: [Score] / [Max Score]
OVERALL: [percentage or GPA]
REMARKS: [any notable remarks]

If any field is unclear or illegible, mark it as "[UNCLEAR]" rather than guessing.`;

export function buildUserPrompt(input: {
  inputType: string;
  userInput: string;
  imageText?: string;
  voiceTranscript?: string;
}): string {
  let prompt = `Analyze the following unstructured input about a student/professional and generate a comprehensive career pathway recommendation.

INPUT TYPE: ${input.inputType}

RAW INPUT:
"""
${input.userInput}
"""

`;

  if (input.imageText) {
    prompt += `EXTRACTED FROM IMAGE (OCR/Vision):
"""
${input.imageText}
"""

`;
  }

  if (input.voiceTranscript) {
    prompt += `VOICE TRANSCRIPT:
"""
${input.voiceTranscript}
"""

`;
  }

  prompt += `---

TASK: Follow your reasoning process (EXTRACT → INFER → PROFILE → MATCH → RANK → PLAN) and return a JSON response matching this EXACT schema:

{
  "profile": {
    "education_level": "school_8_10 | school_11_12 | undergraduate | postgraduate | working_professional | career_switcher",
    "current_status": "string",
    "age_range": "string",
    "region": "string",
    "grades_summary": "string",
    "strengths": ["string array"],
    "dislikes": ["string array"],
    "interests": ["string array"],
    "skills": ["string array"],
    "constraints": ["string array"],
    "experience": "string"
  },
  "confidence": "high | medium | low",
  "missing_info": ["string array"],
  "career_paths": [
    {
      "rank": 1,
      "path_type": "best_fit | ambitious_stretch | practical_safety",
      "title": "string",
      "emoji": "string",
      "match_score": 85,
      "why_this_fits": "string — personalized 2-3 sentences",
      "education_roadmap": [
        { "step": 1, "action": "string", "timeline": "string", "details": "string" }
      ],
      "skills_to_build": [
        {
          "skill": "string",
          "priority": "critical | important | nice_to_have",
          "resource": { "name": "string", "url": "string — real URL", "type": "course | certification | practice | book" }
        }
      ],
      "timeline": {
        "6_months": "string",
        "1_year": "string",
        "3_years": "string",
        "5_years": "string"
      },
      "salary_expectations": {
        "currency": "INR | USD | EUR",
        "entry_level": "string",
        "mid_career": "string",
        "senior": "string"
      },
      "job_links": [
        { "platform": "string", "search_url": "string — real URL", "description": "string" }
      ]
    }
  ]
}

IMPORTANT RULES:
1. Return ONLY the JSON object. No markdown fences, no explanation text.
2. career_paths array MUST have exactly 3 items, ranked 1-3.
3. education_roadmap MUST have 3-6 steps, ordered chronologically.
4. skills_to_build MUST have 3-5 items per career path.
5. All URLs must be real, working platform URLs.
6. match_score is 0-100, reflecting genuine fit.
7. Adapt all recommendations to the detected education_level and region.`;

  return prompt;
}

export const EXAMPLE_INPUTS = [
  {
    label: "10th grade student",
    text: "I'm in 10th grade CBSE. I got 92 in science, 78 in math, 95 in English. I love biology and drawing. I hate math. I want to do something in healthcare but not become a regular doctor. My family can't afford private college."
  },
  {
    label: "3rd year CS student",
    text: "I'm a 3rd year B.Tech Computer Science student at VIT Vellore. CGPA is 7.8. I'm decent at coding but not passionate about it. I really enjoy UI/UX design and have done a few freelance projects on Figma. I also run a photography page on Instagram with 5K followers. I'm confused whether to go for a tech job or something creative. I'm from Pune, middle-class family."
  },
  {
    label: "IT professional, career switch",
    text: "I've been working in IT for 5 years, mostly backend Java development. I'm 28, earning around 12 lakhs. Honestly I'm burned out and I've always been passionate about education. I used to tutor kids in college and loved it. I'm thinking about EdTech or maybe becoming a teacher but I don't want a massive pay cut. I'm based in Bangalore."
  }
];
