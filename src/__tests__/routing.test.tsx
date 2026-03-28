import { createElement } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import LandingPage from '@/pages/LandingPage';
import AppPage from '@/pages/AppPage';
import AboutPage from '@/pages/AboutPage';

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

function renderRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppProvider>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<AppPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </TooltipProvider>
      </AppProvider>
    </MemoryRouter>,
  );
}

describe('Routing', () => {
  it('renders the landing page at "/"', () => {
    renderRoute('/');
    expect(screen.getByText(/Your career pathway/i)).toBeInTheDocument();
  });

  it('renders the app page at "/app"', () => {
    renderRoute('/app');
    expect(screen.getByText(/Tell us about yourself/i)).toBeInTheDocument();
  });

  it('renders the about page at "/about"', () => {
    renderRoute('/about');
    expect(screen.getByText(/About PathBridge/i)).toBeInTheDocument();
  });
});
