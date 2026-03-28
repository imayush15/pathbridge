import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT, buildUserPrompt, IMAGE_PREPROCESS_PROMPT, buildFollowUpSystemPrompt, buildComparisonPrompt, buildAvatarPrompt, buildRoadmapIllustrationPrompt } from './prompts';
import type { PathBridgeResponse, AnalysisInput, ConversationEntry, GroundingChunk, ComparisonResult, StudentProfile, CareerPath } from './types';

// ===== Prompt Validation =====

export async function validateCareerPrompt(
  apiKey: string,
  inputText: string
): Promise<{ valid: boolean; reason: string }> {
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    config: {
      responseMimeType: 'application/json',
      temperature: 0,
      maxOutputTokens: 256,
    },
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `You are a strict input validator for a career guidance tool called PathBridge. Your ONLY job is to determine whether the user's input is related to career, education, professional growth, academic background, skills, job seeking, or career switching.

ACCEPT if the input mentions ANY of these: grades, subjects, education level, college, school, degree, career goals, job interests, skills, professional experience, career switching, salary expectations, work experience, academic transcripts, certifications, courses, or anything that could help a career counselor give advice.

REJECT if the input is completely unrelated to career/education — for example: recipes, jokes, stories, code generation requests, random gibberish, math problems, general knowledge questions, creative writing, or anything that has zero connection to a person's career or educational journey.

When in doubt, ACCEPT — we want to be helpful, not restrictive.

USER INPUT:
"""
${inputText}
"""

Respond with JSON: { "valid": true/false, "reason": "one sentence explanation" }`,
          },
        ],
      },
    ],
  });

  const text = response.text || '';
  try {
    return safeJsonParse<{ valid: boolean; reason: string }>(text);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return safeJsonParse<{ valid: boolean; reason: string }>(jsonMatch[0]);
    }
    // If parsing fails, default to accepting
    return { valid: true, reason: '' };
  }
}

// ===== Main Career Analysis =====

export async function analyzeWithGemini(
  apiKey: string,
  input: AnalysisInput,
  onStep?: (step: number) => void
): Promise<PathBridgeResponse> {
  const ai = new GoogleGenAI({ apiKey });

  onStep?.(1); // Extracting academic data

  let userInput = input.text || '';
  let imageText: string | undefined;
  let voiceTranscript: string | undefined = input.voiceTranscript;

  // If image provided, first extract text from it
  if (input.imageBase64 && input.imageMimeType) {
    onStep?.(1);
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: IMAGE_PREPROCESS_PROMPT },
            {
              inlineData: {
                mimeType: input.imageMimeType,
                data: input.imageBase64,
              },
            },
          ],
        },
      ],
    });
    imageText = imageResponse.text || '';
  }

  onStep?.(2); // Building your profile
  await sleep(800);

  onStep?.(3); // Matching career paths

  const userPrompt = buildUserPrompt({
    inputType: input.type,
    userInput,
    imageText,
    voiceTranscript,
  });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      temperature: 0.7,
      maxOutputTokens: 65536,
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
  });

  onStep?.(4); // Generating roadmaps

  // Check for truncation (MAX_TOKENS finish reason)
  const candidates = (response as any).candidates;
  if (candidates?.[0]?.finishReason === 'MAX_TOKENS') {
    throw new Error('The response was too long and got cut off. Please try again with a shorter input or fewer details.');
  }

  const text = response.text;
  if (!text) {
    throw new Error('No response received. Please try again.');
  }

  try {
    const parsed = safeJsonParse<PathBridgeResponse>(text);

    // Validate basic structure
    if (!parsed.profile || !parsed.career_paths || parsed.career_paths.length === 0) {
      throw new Error('Invalid response structure');
    }

    return parsed;
  } catch (e) {
    // Try to extract JSON from the response if it has extra text
    const codeFence = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
    const candidate = codeFence ? codeFence[1].trim() : text;
    const jsonMatch = candidate.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return safeJsonParse<PathBridgeResponse>(jsonMatch[0]);
      } catch {
        throw new Error('The AI response was incomplete. Please try again.');
      }
    }
    throw new Error('Failed to parse career pathway results. Please try again.');
  }
}

// ===== Follow-up with Google Search Grounding =====

export async function followUpWithGemini(
  apiKey: string,
  profile: StudentProfile,
  careerPath: CareerPath,
  conversationHistory: ConversationEntry[],
  question: string
): Promise<{ answer: string; groundingChunks: GroundingChunk[] }> {
  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = buildFollowUpSystemPrompt(profile, careerPath);

  // Build multi-turn contents array from conversation history
  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
  for (const entry of conversationHistory) {
    contents.push({ role: 'user', parts: [{ text: entry.question }] });
    contents.push({ role: 'model', parts: [{ text: entry.answer }] });
  }
  contents.push({ role: 'user', parts: [{ text: question }] });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
      temperature: 0.7,
      maxOutputTokens: 4096,
      tools: [{ googleSearch: {} }],
    },
    contents,
  });

  const answer = response.text || 'I could not generate a response. Please try again.';

  // Extract grounding metadata
  const groundingChunks: GroundingChunk[] = [];
  try {
    const candidates = (response as any).candidates;
    if (candidates?.[0]?.groundingMetadata?.groundingChunks) {
      for (const chunk of candidates[0].groundingMetadata.groundingChunks) {
        if (chunk.web?.uri && chunk.web?.title) {
          groundingChunks.push({ uri: chunk.web.uri, title: chunk.web.title });
        }
      }
    }
  } catch {
    // Grounding metadata extraction is best-effort
  }

  return { answer, groundingChunks };
}

// ===== Compare Career Paths with Grounding =====

export async function compareWithGemini(
  apiKey: string,
  profile: StudentProfile,
  path1: CareerPath,
  path2: CareerPath
): Promise<ComparisonResult> {
  const ai = new GoogleGenAI({ apiKey });

  const userPrompt = buildComparisonPrompt(profile, path1, path2);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    config: {
      temperature: 0.7,
      maxOutputTokens: 4096,
      tools: [{ googleSearch: {} }],
    },
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
  });

  const text = response.text || '';

  // Extract grounding metadata
  const groundingChunks: GroundingChunk[] = [];
  try {
    const candidates = (response as any).candidates;
    if (candidates?.[0]?.groundingMetadata?.groundingChunks) {
      for (const chunk of candidates[0].groundingMetadata.groundingChunks) {
        if (chunk.web?.uri && chunk.web?.title) {
          groundingChunks.push({ uri: chunk.web.uri, title: chunk.web.title });
        }
      }
    }
  } catch {
    // Best-effort
  }

  // Extract JSON — try markdown code fence first, then raw regex
  const codeFenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  const jsonStr = codeFenceMatch ? codeFenceMatch[1].trim() : text;
  const jsonObjMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (!jsonObjMatch) {
    throw new Error('Failed to parse comparison results.');
  }

  const parsed = safeJsonParse<ComparisonResult>(jsonObjMatch[0]);

  // Merge existing data-based dimensions
  const existingDimensions = [
    {
      label: 'Match Score',
      path1Value: `${path1.match_score}%`,
      path2Value: `${path2.match_score}%`,
      winner: path1.match_score > path2.match_score ? 1 as const : path1.match_score < path2.match_score ? 2 as const : 'tie' as const,
    },
    {
      label: 'Salary Trajectory',
      path1Value: `${path1.salary_expectations.entry_level} → ${path1.salary_expectations.senior}`,
      path2Value: `${path2.salary_expectations.entry_level} → ${path2.salary_expectations.senior}`,
      winner: 'tie' as const,
    },
    {
      label: 'Key Skills',
      path1Value: `${path1.skills_to_build.length} skills`,
      path2Value: `${path2.skills_to_build.length} skills`,
      winner: 'tie' as const,
    },
    {
      label: 'Education Steps',
      path1Value: `${path1.education_roadmap.length} steps`,
      path2Value: `${path2.education_roadmap.length} steps`,
      winner: 'tie' as const,
    },
  ];

  return {
    summary: parsed.summary,
    dimensions: [...existingDimensions, ...parsed.dimensions],
    groundingChunks,
  };
}

// ===== Avatar Generation with Imagen 3 =====

export async function generateAvatar(
  apiKey: string,
  profile: StudentProfile
): Promise<string | null> {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildAvatarPrompt(profile);

    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
      },
    });

    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    return imageBytes || null;
  } catch {
    return null;
  }
}

// ===== Roadmap Illustration Generation =====

export async function generateRoadmapIllustration(
  apiKey: string,
  careerPath: CareerPath
): Promise<string | null> {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildRoadmapIllustrationPrompt(careerPath);

    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
      },
    });

    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    return imageBytes || null;
  } catch {
    return null;
  }
}

// ===== Cloud Speech-to-Text =====

export async function transcribeWithCloudSTT(
  cloudApiKey: string,
  audioBase64: string,
  encoding: string,
  sampleRate: number
): Promise<string> {
  const response = await fetch(
    `https://speech.googleapis.com/v1/speech:recognize?key=${cloudApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        config: {
          encoding,
          sampleRateHertz: sampleRate,
          languageCode: 'en-IN',
          model: 'latest_long',
          enableAutomaticPunctuation: true,
        },
        audio: {
          content: audioBase64,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Cloud STT request failed');
  }

  const data = await response.json();
  const transcript = data.results
    ?.map((r: any) => r.alternatives?.[0]?.transcript || '')
    .join(' ')
    .trim();

  return transcript || '';
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Sanitize control characters inside JSON string values only.
 * Walks char-by-char tracking whether we're inside a JSON string,
 * and escapes illegal control chars (0x00-0x1F except already-escaped ones).
 */
export function sanitizeJsonString(raw: string): string {
  let result = '';
  let inString = false;
  let i = 0;
  while (i < raw.length) {
    const ch = raw[i];
    if (inString) {
      if (ch === '\\') {
        // Escaped char — pass through both chars
        result += ch + (raw[i + 1] ?? '');
        i += 2;
        continue;
      }
      if (ch === '"') {
        inString = false;
        result += ch;
        i++;
        continue;
      }
      const code = ch.charCodeAt(0);
      if (code < 0x20) {
        // Control char inside a string value — escape it
        if (ch === '\n') result += '\\n';
        else if (ch === '\r') result += '\\r';
        else if (ch === '\t') result += '\\t';
        else result += '\\u' + code.toString(16).padStart(4, '0');
        i++;
        continue;
      }
      result += ch;
    } else {
      if (ch === '"') inString = true;
      result += ch;
    }
    i++;
  }
  return result;
}

/** Try to parse JSON, sanitizing control chars on failure */
export function safeJsonParse<T>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return JSON.parse(sanitizeJsonString(text)) as T;
  }
}
