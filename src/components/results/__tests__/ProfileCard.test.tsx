import { createElement } from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render-helpers';
import { createMockProfile } from '@/test/fixtures';
import { ProfileCard } from '../ProfileCard';

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: (_, tag) => (props: any) => { const { initial, animate, exit, whileInView, variants, transition, custom, viewport, style, ...rest } = props; return createElement(tag as string, rest); } }),
  AnimatePresence: ({ children }: any) => children,
}));

describe('ProfileCard', () => {
  it('renders "Your Profile" title', () => {
    const profile = createMockProfile();
    renderWithProviders(<ProfileCard profile={profile} confidence="high" missingInfo={[]} />);
    expect(screen.getByText('Your Profile')).toBeInTheDocument();
  });

  it('displays education level with underscores replaced by spaces', () => {
    const profile = createMockProfile({ education_level: 'school_8_10' });
    renderWithProviders(<ProfileCard profile={profile} confidence="high" missingInfo={[]} />);
    expect(screen.getByText('school 8 10')).toBeInTheDocument();
  });

  it('displays current status, region, age range', () => {
    const profile = createMockProfile({
      current_status: 'Final year B.Tech student',
      region: 'India',
      age_range: '20-22',
    });
    renderWithProviders(<ProfileCard profile={profile} confidence="high" missingInfo={[]} />);
    expect(screen.getByText('Final year B.Tech student')).toBeInTheDocument();
    expect(screen.getByText('India')).toBeInTheDocument();
    expect(screen.getByText('20-22')).toBeInTheDocument();
  });

  it('renders grades summary when present', () => {
    const profile = createMockProfile({ grades_summary: '8.5 CGPA in Computer Science' });
    renderWithProviders(<ProfileCard profile={profile} confidence="high" missingInfo={[]} />);
    expect(screen.getByText('8.5 CGPA in Computer Science')).toBeInTheDocument();
    expect(screen.getByText('Grades Summary')).toBeInTheDocument();
  });

  it('does not render grades summary when empty string', () => {
    const profile = createMockProfile({ grades_summary: '' });
    renderWithProviders(<ProfileCard profile={profile} confidence="high" missingInfo={[]} />);
    expect(screen.queryByText('Grades Summary')).not.toBeInTheDocument();
  });

  it('renders strength, interest, skill badges', () => {
    const profile = createMockProfile({
      strengths: ['Problem solving'],
      interests: ['AI/ML'],
      skills: ['Python'],
    });
    renderWithProviders(<ProfileCard profile={profile} confidence="high" missingInfo={[]} />);
    expect(screen.getByText('Problem solving')).toBeInTheDocument();
    expect(screen.getByText('AI/ML')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Strengths')).toBeInTheDocument();
    expect(screen.getByText('Interests')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });

  it.each([
    ['high', 'High Confidence'],
    ['medium', 'Medium Confidence'],
    ['low', 'Low Confidence'],
  ] as const)('shows "%s" confidence indicator as "%s"', (level, label) => {
    const profile = createMockProfile();
    renderWithProviders(<ProfileCard profile={profile} confidence={level} missingInfo={[]} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('renders missing info list when non-empty', () => {
    const profile = createMockProfile();
    const missingInfo = ['Your GPA score', 'Preferred work location'];
    renderWithProviders(<ProfileCard profile={profile} confidence="medium" missingInfo={missingInfo} />);
    expect(screen.getByText('Your GPA score')).toBeInTheDocument();
    expect(screen.getByText('Preferred work location')).toBeInTheDocument();
  });

  it('does not render missing info when empty', () => {
    const profile = createMockProfile();
    renderWithProviders(<ProfileCard profile={profile} confidence="high" missingInfo={[]} />);
    expect(screen.queryByText(/For better results, share/)).not.toBeInTheDocument();
  });
});
