import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT, buildUserPrompt, IMAGE_PREPROCESS_PROMPT } from './prompts';
import type { PathBridgeResponse, AnalysisInput } from './types';

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
      maxOutputTokens: 8192,
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
  });

  onStep?.(4); // Generating roadmaps

  const text = response.text;
  if (!text) {
    throw new Error('No response received from Gemini. Please try again.');
  }

  try {
    const parsed = JSON.parse(text) as PathBridgeResponse;

    // Validate basic structure
    if (!parsed.profile || !parsed.career_paths || parsed.career_paths.length === 0) {
      throw new Error('Invalid response structure');
    }

    return parsed;
  } catch (e) {
    // Try to extract JSON from the response if it has extra text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as PathBridgeResponse;
    }
    throw new Error('Failed to parse career pathway results. Please try again.');
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
