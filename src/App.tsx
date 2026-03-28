import { AppProvider } from '@/context/AppContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import HomePage from '@/pages/HomePage';
import './index.css';

function App() {
  return (
    <AppProvider>
      <TooltipProvider>
        <HomePage />
        <Toaster position="bottom-right" richColors />
      </TooltipProvider>
    </AppProvider>
  );
}

export default App;
