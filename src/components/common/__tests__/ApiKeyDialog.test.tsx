import { createElement } from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/render-helpers';
import { ApiKeyDialog } from '../ApiKeyDialog';

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: (_, tag) => (props: any) => { const { initial, animate, exit, whileInView, variants, transition, custom, viewport, style, ...rest } = props; return createElement(tag as string, rest); } }),
  AnimatePresence: ({ children }: any) => children,
  useScroll: () => ({ scrollYProgress: { current: 0 } }),
  useTransform: () => 0,
}));

describe('ApiKeyDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dialog content when open=true', () => {
    renderWithProviders(<ApiKeyDialog {...defaultProps} />);
    expect(screen.getByText('API Keys')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('AIzaSy...')).toBeInTheDocument();
  });

  it('does not render content when open=false', () => {
    renderWithProviders(<ApiKeyDialog open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByText('API Keys')).not.toBeInTheDocument();
  });

  it('shows error for empty key submission', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ApiKeyDialog {...defaultProps} />);

    const saveButton = screen.getByRole('button', { name: /save key/i });
    await user.click(saveButton);

    expect(screen.getByRole('alert')).toHaveTextContent('Please enter your API key');
  });

  it('shows error for invalid key format (not starting with "AIza")', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ApiKeyDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText('AIzaSy...');
    await user.type(input, 'invalidkey123');

    const saveButton = screen.getByRole('button', { name: /save key/i });
    await user.click(saveButton);

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid key format');
  });

  it('accepts valid key starting with "AIza" and calls onOpenChange(false)', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<ApiKeyDialog open={true} onOpenChange={onOpenChange} />);

    const input = screen.getByPlaceholderText('AIzaSy...');
    await user.type(input, 'AIzaSyValidTestKey1234');

    const saveButton = screen.getByRole('button', { name: /save key/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ApiKeyDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText('AIzaSy...');
    expect(input).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByLabelText('Show API key');
    await user.click(toggleButton);

    expect(input).toHaveAttribute('type', 'text');

    const hideButton = screen.getByLabelText('Hide API key');
    await user.click(hideButton);

    expect(input).toHaveAttribute('type', 'password');
  });

  it('contains "Get a free API key" link', () => {
    renderWithProviders(<ApiKeyDialog {...defaultProps} />);

    const link = screen.getByText(/get a free api key/i);
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', 'https://aistudio.google.com/apikey');
  });
});
