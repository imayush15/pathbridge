import { createElement } from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render-helpers';
import { AnalysisLoader } from '../AnalysisLoader';

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: (_, tag) => (props: any) => { const { initial, animate, exit, whileInView, variants, transition, custom, viewport, style, ...rest } = props; return createElement(tag as string, rest); } }),
  AnimatePresence: ({ children }: any) => children,
}));

describe('AnalysisLoader', () => {
  it('renders loading UI with step indicators', () => {
    renderWithProviders(<AnalysisLoader />);

    expect(screen.getByText('Analyzing your profile')).toBeInTheDocument();
    expect(screen.getByText('This usually takes 15-30 seconds')).toBeInTheDocument();

    expect(screen.getByText('Extracting academic data')).toBeInTheDocument();
    expect(screen.getByText('Building your profile')).toBeInTheDocument();
    expect(screen.getByText('Matching career paths')).toBeInTheDocument();
    expect(screen.getByText('Generating roadmaps')).toBeInTheDocument();
  });
});
