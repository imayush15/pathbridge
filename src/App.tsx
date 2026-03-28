import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import LandingPage from '@/pages/LandingPage';
import AppPage from '@/pages/AppPage';
import AboutPage from '@/pages/AboutPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<AppPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
          <Toaster position="bottom-right" richColors />
        </TooltipProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
