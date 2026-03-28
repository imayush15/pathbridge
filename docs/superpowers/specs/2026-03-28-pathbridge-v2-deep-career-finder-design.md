# PathBridge v2 — Deep Career Finder Design Spec

## Overview

Enhance PathBridge from a one-shot career path generator into a deeper, more interactive career exploration tool. The core loop remains: user provides messy academic input, AI returns 3 structured career paths. The enhancements add conversational depth, visual comparison, AI-generated imagery, and broader Google AI product integration.

**Hackathon problem statement alignment:** "Takes unstructured, messy, real-world inputs and instantly converts them into structured, verified, and life-saving actions." Each enhancement directly strengthens one of these three properties — unstructured input handling (Cloud STT), verified output (Search grounding), and actionable depth (follow-up, comparison, illustrations).

---

## Feature 1: Google Search Grounding

### What
Enable Gemini's Google Search grounding so career path outputs cite real-world data — actual salary ranges, real course URLs, current job market demand — instead of relying solely on the model's training data.

### Why
The hackathon prompt says "structured, **verified**." Grounding transforms Gemini's output from plausible to verifiable. Judges can click a salary figure and see it's backed by real data.

### How

**Important constraint:** Google Search grounding is incompatible with `responseMimeType: 'application/json'` (structured JSON output mode). The model cannot invoke tools when JSON mode is forced. Strategy:

- **Main career analysis call** — keeps JSON mode, no grounding. This ensures the structured `PathBridgeResponse` schema is reliably returned.
- **Follow-up conversational calls (Feature 3)** — uses grounding since responses are plain text. This is where grounding adds the most value: when users ask "what's the actual salary for X?" or "are there real courses for Y?"
- **Comparison call (Feature 4)** — uses grounding since the comparison summary is plain text.

Grounding metadata is available at `response.candidates[0].groundingMetadata.groundingChunks` and `searchEntryPoint`. For follow-up and comparison responses, extract `groundingChunks[].web.uri` and `groundingChunks[].web.title` to show source links.

### UI Changes
- Follow-up chat responses and comparison summaries show a "Search-grounded" badge at the response level (not per data point, since grounding metadata is per-response-chunk)
- Below grounded responses, an expandable "Sources" section lists the grounding chunk URLs and titles

---

## Feature 2: Google Cloud Speech-to-Text

### What
Replace the browser's Web Speech API with Google Cloud Speech-to-Text for voice input.

### Why
- Browser Web Speech API is inconsistent across browsers (Firefox barely supports it, Safari is flaky)
- Cloud STT is more accurate, supports more languages, and adds a second Google AI product to the stack
- Better handles Indian English accents (relevant for the target audience)

### How
- Use the Cloud Speech-to-Text REST API directly from the browser (API key auth, same pattern as Gemini)
- Capture audio via the Web Audio API / MediaRecorder API → encode as LINEAR16 or FLAC
- Send audio to `speech.googleapis.com/v1/speech:recognize`
- Configure: `languageCode: "en-IN"`, `model: "latest_long"`, `enableAutomaticPunctuation: true`
- Uses a separate env var `VITE_GOOGLE_CLOUD_API_KEY` (or the same Gemini API key if the Cloud project has STT enabled). Stored in localStorage alongside the Gemini key. The `ApiKeyDialog` gets a second optional field for the Cloud API key.
- Note: the API key is exposed in client-side code (same security posture as the Gemini key — acceptable for hackathon, restrict key via Google Cloud Console in production)

### UI Changes
- Voice tab remains the same visually
- Replace the `webkitSpeechRecognition` implementation in `InputSection.tsx` with Cloud STT calls
- Add a recording indicator (waveform or pulsing dot) during capture
- Transcript still appears in the editable textarea

### Tradeoff
- Requires the user's Google Cloud project to have Cloud STT API enabled
- For hackathon demo, this is fine since you control the API key
- Slightly more latency (send audio → get response) vs. browser's streaming recognition
- Could keep browser API as fallback if Cloud STT key isn't configured

---

## Feature 3: Conversational Follow-up (Per-Card)

### What
Each career path card gets contextual action buttons and a free-form input, allowing the user to dig deeper into any specific path.

### Why
The current experience is one-shot: you get 3 paths and that's it. Real career decisions require exploration — "What if I can't afford this?", "How risky is this path?", "What's a typical day like?" This turns a static result into an interactive conversation.

### How

#### Action Buttons
Each `CareerPathCard` component gets a row of quick-action buttons:
- "Tell me more" — expands on the career path with day-in-the-life, growth trajectory, industry trends
- "What are the risks?" — honest assessment of challenges, failure modes, market saturation
- "What if I can't afford this?" — alternative education routes, scholarships, free resources, part-time options
- "Alternative routes" — non-traditional paths to the same career (bootcamps, self-taught, apprenticeships)

#### Free-form Input
- A text input field at the bottom of each card: "Ask anything about this path..."
- User types a custom question, AI responds with context of their full profile + this specific career path

#### Conversation State
- Each card maintains its own conversation history (array of Q&A pairs)
- History is passed to Gemini as a multi-turn `contents` array with alternating `user`/`model` roles (native Gemini SDK format)
- Stored in React state (AppContext), keyed by **array index** (0, 1, 2) not by `rank` — rank comes from AI and could theoretically be non-sequential
- Lost on page refresh (acceptable for hackathon)

#### API Integration
- Follow-up calls use the same Gemini 2.5 Flash model
- System prompt (via `systemInstruction`) includes: original student profile and the specific career path data
- Conversation history passed as multi-turn `contents` array
- Response format: plain text (not JSON) for conversational responses
- Google Search grounding enabled (`tools: [{ googleSearch: {} }]`) for verified follow-up answers

#### Error Handling
- If a follow-up call fails: show inline error message in the chat thread with a "Retry" button
- Rate limit errors (429): show "Please wait a moment and try again" with auto-retry after 5 seconds
- Network errors: show "Connection error" with retry button
- Loading state: animated typing indicator dots in the chat thread

### UI Changes
- Below each career path card's existing content, add:
  1. A row of pill-shaped action buttons (horizontally scrollable on mobile)
  2. A text input with send button
  3. A conversation thread area showing Q&A pairs with smooth expand animation
- Conversation area uses a chat-bubble style: user questions on right, AI responses on left
- Loading state: typing indicator while AI responds

---

## Feature 4: Drag-to-Compare Career Paths

### What
User drags two career path cards together to trigger a side-by-side comparison view.

### Why
Choosing between career paths requires direct comparison. Scrolling between cards and mentally comparing is hard. A structured side-by-side view makes trade-offs immediately visible.

### How

#### Interaction Trigger
- **Desktop:** Each career path card becomes draggable (using Framer Motion's `drag` prop). When two cards are dragged close to each other (within a threshold), a "drop to compare" zone appears. Dropping triggers the comparison view.
- **Mobile fallback:** Each card gets a checkbox. When 2 are checked, a "Compare" button appears. This avoids janky touch-drag issues.
- **Stretch goal:** The drag interaction is high-effort. If time is tight during implementation, start with checkboxes-only for both desktop and mobile — the comparison view itself is the valuable part, not the trigger mechanism.

#### Edge Cases
- If fewer than 2 career paths are returned (low-confidence analysis), disable the comparison feature entirely and hide the drag handles/checkboxes.

#### Comparison View
- A modal or slide-in panel showing the two selected paths side-by-side
- Comparison dimensions — some extracted from existing data, others generated by the comparison AI call:
  - **From existing data:** Match score (`match_score`), salary trajectory (`salary_expectations`), key skills (`skills_to_build`), education steps count (`education_roadmap.length`)
  - **Generated by comparison call:** Education cost estimate, risk level, growth potential, timeline to first job, overall recommendation
- Each row highlights which path "wins" on that dimension (subtle color coding)
- AI-generated summary at the top: "Path A is better if you value X, Path B is better if you value Y"

#### API Integration
- When comparison view opens, a single Gemini call is made with both paths + user profile as context
- Google Search grounding enabled for this call (plain text response)
- Response format: the comparison call returns a `ComparisonResult` JSON (parsed from a text response with JSON extraction, same fallback pattern as the main analysis)
- The call generates the dimensions that can't be extracted from existing data (cost, risk, growth, timeline)

### UI Changes
- Career path cards get a subtle drag handle or visual affordance indicating they're draggable
- Comparison modal: clean two-column layout with the dimension labels in the center
- Close button to dismiss and return to the main results view
- Mobile: cards get checkboxes instead of drag, comparison view is full-screen

---

## Feature 5: Gemini Image Generation

### What
Generate two types of images using Gemini's image generation capabilities:
1. A personalized profile avatar based on the user's interests and strengths
2. Illustrated visuals for each education roadmap step and timeline milestone

### Why
- Makes the output feel unique and personal — not a generic template
- Illustrated roadmaps are more engaging and memorable than text lists
- Demonstrates Gemini's multimodal generation capabilities (strong hackathon signal)
- Adds a 4th Google AI product to the stack

### How

#### Profile Avatar
- After the career analysis completes, make a separate Gemini image generation call
- Prompt: construct from the user's profile — interests, strengths, personality traits
- Style: illustrated/stylized (not photorealistic) — think avatar/character art
- Example prompt: "A stylized digital illustration avatar of a young student passionate about coding and music, surrounded by icons of laptops, musical notes, and books. Flat design, vibrant colors, clean background."
- Display in the `ProfileCard` component as the user's generated avatar

#### Roadmap Illustrations
- For each `EducationStep` in each career path, generate a small illustration representing that step
- Example: "A flat illustration icon of a student graduating from university, cap and gown, minimal style, 256x256"
- These are generated in batch after the main analysis completes (background loading)
- Display as thumbnails next to each roadmap step in the `CareerPathCard` accordion

#### API Integration
- Use **Imagen 3** via the Gemini API (`ai.models.generateImages()` method from `@google/genai` SDK)
- API call pattern: `await ai.models.generateImages({ model: 'imagen-3.0-generate-002', prompt: '...', config: { numberOfImages: 1, outputMimeType: 'image/png' } })`
- Images returned as base64 in `response.generatedImages[0].image.imageBytes`
- **Avatar:** single generation call after analysis completes
- **Roadmap illustrations:** limited to **1 illustration per career path** (3 total, not per-step) to avoid rate limiting. Pick the most visually interesting step from each path (e.g., the final career milestone). This keeps API calls to 4 total (1 avatar + 3 roadmap).
- Generate asynchronously — show results immediately with placeholder skeletons, images load in progressively

#### Performance Considerations
- All image generation is non-blocking — show existing icons as fallback, replace with generated images when ready
- Stagger calls: avatar first, then roadmap illustrations sequentially with 500ms delay between each
- If any generation call fails, silently fall back to the existing icon — no error shown to user

### UI Changes
- `ProfileCard`: circular avatar image area (currently shows an icon) → shows generated avatar with a subtle shimmer loading state
- `CareerPathCard` education roadmap: each step gets a small square illustration thumbnail to the left of the step text
- Timeline milestones: optional small illustrations (lower priority than roadmap steps)
- All images have graceful fallbacks (existing icons) if generation fails

---

## Google AI Products Summary

| # | Product | Usage | Hackathon value |
|---|---------|-------|-----------------|
| 1 | Gemini 2.5 Flash | Core career analysis, follow-up conversations | Main AI engine |
| 2 | Google Search Grounding | Verified salary, job, and course data | "Verified" in problem statement |
| 3 | Google Cloud Speech-to-Text | Voice input transcription | Reliable cross-browser voice input |
| 4 | Gemini Image Generation | Profile avatar + roadmap illustrations | Multimodal output showcase |

---

## Architecture Overview

```
User Input (text / image / voice)
        │
        ├── Image → Gemini Vision OCR → extracted text
        ├── Voice → Cloud Speech-to-Text → transcript
        └── Text → direct
        │
        ▼
Combined Input + System Prompt
        │
        ▼
Gemini 2.5 Flash (with Google Search grounding)
        │
        ▼
Structured JSON Response (PathBridgeResponse)
        │
        ├── Profile → Avatar generation (Gemini Imagen)
        ├── 3 Career Paths → Display cards
        │       ├── Roadmap illustrations (Gemini Imagen, async)
        │       ├── Follow-up buttons + chat (Gemini Flash per-card)
        │       └── Drag-to-compare (Gemini Flash for summary)
        └── Search grounding citations → Verified badges
```

### State Management
Extend the existing AppContext with:
- `conversations: Record<number, ConversationEntry[]>` — per-card follow-up history, keyed by **array index** (0, 1, 2), not rank
- `comparisonPair: [number, number] | null` — array indices of the two paths being compared
- `comparisonResult: ComparisonResult | null` — AI-generated comparison data
- `avatarImage: string | null` — base64 generated avatar
- `roadmapImages: Record<number, string>` — base64 images keyed by career path array index (one per path)
- `imageLoadingStates: Record<string, 'loading' | 'done' | 'error'>` — track async image generation (keys: `'avatar'`, `'roadmap-0'`, `'roadmap-1'`, `'roadmap-2'`)

### New Types (src/lib/types.ts)
```typescript
interface ConversationEntry {
  question: string;
  answer: string;
  timestamp: number;
}

interface ComparisonResult {
  summary: string;
  dimensions: ComparisonDimension[];
}

interface ComparisonDimension {
  label: string;
  path1Value: string;
  path2Value: string;
  winner: 1 | 2 | 'tie';
}
```

---

## File Changes Summary

| File | Change |
|------|--------|
| `src/lib/gemini.ts` | Add search grounding config, follow-up call function, comparison call function, image generation functions, Cloud STT integration |
| `src/lib/prompts.ts` | Add follow-up system prompt, comparison prompt, avatar prompt builder, roadmap illustration prompt builder |
| `src/lib/types.ts` | Add ConversationEntry, ComparisonResult, ComparisonDimension interfaces |
| `src/context/AppContext.tsx` | Extend state and reducer for conversations, comparison, images |
| `src/components/results/CareerPathCard.tsx` | Add action buttons, free-form input, conversation thread, drag affordance |
| `src/components/results/ProfileCard.tsx` | Add generated avatar display |
| `src/components/results/ResultsSection.tsx` | Add drag-to-compare logic, comparison modal |
| `src/components/results/ComparisonView.tsx` | **New file** — side-by-side comparison modal |
| `src/components/input/InputSection.tsx` | Replace Web Speech API with Cloud STT |
| `src/components/results/ConversationThread.tsx` | **New file** — chat-style Q&A display per card |

---

## Out of Scope (Post-Hackathon)

- Multi-document upload (multiple files at once)
- Deeper messy input handling (LinkedIn URLs, rambling paragraphs)
- User accounts and data persistence across sessions
- PDF export of career roadmap
- Learning journal feature
- Real-time job market API integration beyond search grounding
