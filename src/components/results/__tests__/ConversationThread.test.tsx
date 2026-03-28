import { createElement } from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/render-helpers';
import { createMockConversation } from '@/test/fixtures';
import { ConversationThread } from '../ConversationThread';

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: (_, tag) => (props: any) => { const { initial, animate, exit, whileInView, variants, transition, custom, viewport, style, ...rest } = props; return createElement(tag as string, rest); } }),
  AnimatePresence: ({ children }: any) => children,
}));

beforeAll(() => {
  Element.prototype.scrollTo = vi.fn();
});

describe('ConversationThread', () => {
  const noop = () => {};

  it('returns null/empty when no entries, not loading, no error', () => {
    const { container } = renderWithProviders(
      <ConversationThread entries={[]} isLoading={false} error={null} onRetry={noop} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders question and answer text for each entry', () => {
    const entries = [
      createMockConversation({ question: 'What about AI?', answer: 'AI is a great field.' }),
      createMockConversation({ question: 'Salary range?', answer: 'Typically 10-20 LPA.' }),
    ];
    renderWithProviders(
      <ConversationThread entries={entries} isLoading={false} error={null} onRetry={noop} />,
    );
    expect(screen.getByText('What about AI?')).toBeInTheDocument();
    expect(screen.getByText('AI is a great field.')).toBeInTheDocument();
    expect(screen.getByText('Salary range?')).toBeInTheDocument();
    expect(screen.getByText('Typically 10-20 LPA.')).toBeInTheDocument();
  });

  it('shows typing indicator when isLoading is true', () => {
    renderWithProviders(
      <ConversationThread entries={[]} isLoading={true} error={null} onRetry={noop} />,
    );
    expect(screen.getByRole('status', { name: /AI is typing/i })).toBeInTheDocument();
  });

  it('shows error message and retry button when error is set', () => {
    renderWithProviders(
      <ConversationThread entries={[]} isLoading={false} error="Something went wrong" onRetry={noop} />,
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('calls onRetry when retry button clicked', async () => {
    const onRetry = vi.fn();
    renderWithProviders(
      <ConversationThread entries={[]} isLoading={false} error="Network error" onRetry={onRetry} />,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
