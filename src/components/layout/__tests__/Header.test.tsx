import { createElement } from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/render-helpers';
import { Header } from '../Header';

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: (_, tag) => (props: any) => { const { initial, animate, exit, whileInView, variants, transition, custom, viewport, style, ...rest } = props; return createElement(tag as string, rest); } }),
  AnimatePresence: ({ children }: any) => children,
  useScroll: () => ({ scrollYProgress: { current: 0 } }),
  useTransform: () => 0,
}));

describe('Header', () => {
  const defaultProps = {
    onOpenApiKey: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders "PathBridge" text', () => {
    renderWithProviders(<Header {...defaultProps} />);
    expect(screen.getByText('PathBridge')).toBeInTheDocument();
  });

  it('renders API Key settings button', () => {
    renderWithProviders(<Header {...defaultProps} />);
    expect(screen.getByLabelText('API Key Settings')).toBeInTheDocument();
  });

  it('calls onOpenApiKey when settings clicked', async () => {
    const onOpenApiKey = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<Header onOpenApiKey={onOpenApiKey} />);

    const settingsButton = screen.getByLabelText('API Key Settings');
    await user.click(settingsButton);

    expect(onOpenApiKey).toHaveBeenCalledTimes(1);
  });

  it('has dark mode toggle', () => {
    renderWithProviders(<Header {...defaultProps} />);
    expect(screen.getByLabelText('Toggle dark mode')).toBeInTheDocument();
  });
});
