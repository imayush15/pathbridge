import { createElement } from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppPage from '@/pages/AppPage';
import { renderWithProviders } from '@/test/render-helpers';
import { createMockResponse } from '@/test/fixtures';
import { analyzeWithGemini, validateCareerPrompt } from '@/lib/gemini';

vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_, tag) => (props: any) => {
        const {
          initial, animate, exit, whileInView, variants, transition,
          custom, viewport, style, whileHover, whileTap, layout,
          onAnimationComplete, drag, dragConstraints,
          ...rest
        } = props;
        return createElement(tag as string, rest);
      },
    },
  ),
  AnimatePresence: ({ children }: any) => children,
  useScroll: () => ({ scrollYProgress: { current: 0 } }),
  useTransform: () => 0,
  useInView: () => true,
}));

vi.mock('@/lib/gemini', () => ({
  analyzeWithGemini: vi.fn(),
  validateCareerPrompt: vi.fn(),
  followUpWithGemini: vi.fn(),
  compareWithGemini: vi.fn(),
  generateAvatar: vi.fn(),
  generateRoadmapIllustration: vi.fn(),
}));

const mockValidate = vi.mocked(validateCareerPrompt);
const mockAnalyze = vi.mocked(analyzeWithGemini);

async function setApiKey(user: ReturnType<typeof userEvent.setup>) {
  // The ApiKeyDialog opens automatically when there is no API key
  const input = await screen.findByPlaceholderText('AIzaSy...');
  await user.type(input, 'AIzaSyFakeTestKey123456');
  const saveButton = screen.getByRole('button', { name: /Save Key/i });
  await user.click(saveButton);
}

describe('Analysis flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('full happy path: enter text, analyze, see results', async () => {
    const user = userEvent.setup();
    const mockResponse = createMockResponse();

    mockValidate.mockResolvedValue({ valid: true, reason: '' });
    mockAnalyze.mockResolvedValue(mockResponse);

    renderWithProviders(<AppPage />, { route: '/app' });

    // Step 1: Set API key
    await setApiKey(user);

    // Step 2: Type text in the textarea
    const textarea = screen.getByPlaceholderText(/Example: I'm in 10th grade/i);
    await user.type(textarea, 'I am a final year CS student interested in AI and web dev');

    // Step 3: Click analyze
    const analyzeButton = screen.getByRole('button', { name: /Generate My Career Pathways/i });
    await user.click(analyzeButton);

    // Step 4: Verify gemini functions were called
    await waitFor(() => {
      expect(mockValidate).toHaveBeenCalledOnce();
      expect(mockAnalyze).toHaveBeenCalledOnce();
    });

    // Step 5: Results section should appear
    await waitFor(() => {
      expect(screen.getByText(/Your Career Pathways/i)).toBeInTheDocument();
    });

    // Verify career path title is shown
    expect(screen.getByText('Full-Stack Developer')).toBeInTheDocument();
  });

  it('error flow: analyzeWithGemini rejects, error card appears', async () => {
    const user = userEvent.setup();

    mockValidate.mockResolvedValue({ valid: true, reason: '' });
    mockAnalyze.mockRejectedValue(new Error('Network error'));

    renderWithProviders(<AppPage />, { route: '/app' });

    await setApiKey(user);

    const textarea = screen.getByPlaceholderText(/Example: I'm in 10th grade/i);
    await user.type(textarea, 'Some career related text here');

    const analyzeButton = screen.getByRole('button', { name: /Generate My Career Pathways/i });
    await user.click(analyzeButton);

    // Error card should appear
    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Network error/i)).toBeInTheDocument();
  });

  it('validation rejection: shows toast error and does not start analysis', async () => {
    const user = userEvent.setup();

    mockValidate.mockResolvedValue({ valid: false, reason: 'Not related to career or education' });

    renderWithProviders(<AppPage />, { route: '/app' });

    await setApiKey(user);

    const textarea = screen.getByPlaceholderText(/Example: I'm in 10th grade/i);
    await user.type(textarea, 'Tell me a joke about cats');

    const analyzeButton = screen.getByRole('button', { name: /Generate My Career Pathways/i });
    await user.click(analyzeButton);

    // Validate was called but analyze should NOT have been called
    await waitFor(() => {
      expect(mockValidate).toHaveBeenCalledOnce();
    });

    expect(mockAnalyze).not.toHaveBeenCalled();
  });
});
