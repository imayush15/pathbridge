import { createElement } from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppPage from '@/pages/AppPage';
import { renderWithProviders } from '@/test/render-helpers';
import { createMockResponse, createMockComparison } from '@/test/fixtures';
import { analyzeWithGemini, validateCareerPrompt, compareWithGemini } from '@/lib/gemini';

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
const mockCompare = vi.mocked(compareWithGemini);

async function setApiKey(user: ReturnType<typeof userEvent.setup>) {
  const input = await screen.findByPlaceholderText('AIzaSy...');
  await user.type(input, 'AIzaSyFakeTestKey123456');
  const saveButton = screen.getByRole('button', { name: /Save Key/i });
  await user.click(saveButton);
}

async function goThroughAnalysis(user: ReturnType<typeof userEvent.setup>) {
  await setApiKey(user);

  const textarea = screen.getByPlaceholderText(/Example: I'm in 10th grade/i);
  await user.type(textarea, 'Final year CS student interested in AI');

  const analyzeButton = screen.getByRole('button', { name: /Generate My Career Pathways/i });
  await user.click(analyzeButton);

  // Wait for results to appear
  await waitFor(() => {
    expect(screen.getByText(/Your Career Pathways/i)).toBeInTheDocument();
  });
}

describe('Comparison flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const mockResponse = createMockResponse();
    // Show all 3 paths by default so we can select them
    mockValidate.mockResolvedValue({ valid: true, reason: '' });
    mockAnalyze.mockResolvedValue(mockResponse);
  });

  it('renders results with career path cards after analysis', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AppPage />, { route: '/app' });
    await goThroughAnalysis(user);

    // Verify the first career path card is visible
    expect(screen.getByText('Full-Stack Developer')).toBeInTheDocument();
    // Recommended Paths heading
    expect(screen.getByText('Recommended Paths')).toBeInTheDocument();
  });

  it('shows compare button when two cards are selected and performs comparison', async () => {
    const user = userEvent.setup();
    const mockComparisonResult = createMockComparison();
    mockCompare.mockResolvedValue(mockComparisonResult);

    renderWithProviders(<AppPage />, { route: '/app' });

    // First, set visible path count to 3 so all cards are visible
    await setApiKey(user);

    // Increase visible path count to 3
    const threeButton = screen.getByRole('button', { name: /Show 3 career path/i });
    await user.click(threeButton);

    const textarea = screen.getByPlaceholderText(/Example: I'm in 10th grade/i);
    await user.type(textarea, 'Final year CS student interested in AI');

    const analyzeButton = screen.getByRole('button', { name: /Generate My Career Pathways/i });
    await user.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText(/Your Career Pathways/i)).toBeInTheDocument();
    });

    // All 3 career paths should be visible
    expect(screen.getByText('Full-Stack Developer')).toBeInTheDocument();
    expect(screen.getByText('AI/ML Engineer')).toBeInTheDocument();
    expect(screen.getByText('Data Analyst')).toBeInTheDocument();

    // All 3 career paths should be visible with their checkboxes
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);

    // Click the first two checkboxes to select them
    await user.click(checkboxes[0]);

    // Re-query after state update since component re-renders
    await waitFor(() => {
      const updated = screen.getAllByRole('checkbox');
      expect(updated[0]).toHaveAttribute('aria-checked', 'true');
    });

    // Now select the second checkbox
    const updatedCheckboxes = screen.getAllByRole('checkbox');
    await user.click(updatedCheckboxes[1]);

    await waitFor(() => {
      const final = screen.getAllByRole('checkbox');
      expect(final[0]).toHaveAttribute('aria-checked', 'true');
      expect(final[1]).toHaveAttribute('aria-checked', 'true');
    });

    // The compare button should appear with both career path names
    const compareButton = await screen.findByText(
      /Full-Stack Developer.*vs.*AI\/ML Engineer/i,
      {},
      { timeout: 3000 },
    );
    const button = compareButton.closest('button');
    expect(button).not.toBeNull();
    await user.click(button!);

    // compareWithGemini should have been called
    await waitFor(() => {
      expect(mockCompare).toHaveBeenCalledOnce();
    });
  });

  it('shows analysis complete badge after successful analysis', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AppPage />, { route: '/app' });
    await goThroughAnalysis(user);

    expect(screen.getByText(/Analysis Complete/i)).toBeInTheDocument();
  });
});
