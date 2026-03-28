import { createElement } from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render-helpers';
import { Footer } from '../Footer';

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: (_, tag) => (props: any) => { const { initial, animate, exit, whileInView, variants, transition, custom, viewport, style, ...rest } = props; return createElement(tag as string, rest); } }),
  AnimatePresence: ({ children }: any) => children,
  useScroll: () => ({ scrollYProgress: { current: 0 } }),
  useTransform: () => 0,
}));

describe('Footer', () => {
  it('renders "PathBridge" text', () => {
    renderWithProviders(<Footer />);
    const matches = screen.getAllByText('PathBridge');
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders copyright with current year', () => {
    renderWithProviders(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`${currentYear}`))).toBeInTheDocument();
  });

  it('renders "Built with" text', () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText(/built with/i)).toBeInTheDocument();
  });
});
