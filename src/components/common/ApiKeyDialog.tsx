import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { KeyRound, ExternalLink, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export function ApiKeyDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { state, dispatch } = useApp();
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!key.trim()) {
      setError('Please enter your API key');
      return;
    }
    if (!key.startsWith('AIza')) {
      setError('Invalid key format. API keys start with "AIza"');
      return;
    }
    dispatch({ type: 'SET_API_KEY', payload: key.trim() });
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            API Keys
          </DialogTitle>
          <DialogDescription>
            Your key is kept in memory only for this session. Nothing is stored or sent to third parties.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* API Key */}
          <div className="space-y-2">
            <label htmlFor="api-key-input" className="text-sm font-medium">
              API Key
            </label>
            <div className="relative">
              <Input
                id="api-key-input"
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={(e) => { setKey(e.target.value); setError(''); }}
                placeholder="AIzaSy..."
                className="pr-10"
                autoComplete="off"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 cursor-pointer"
                onClick={() => setShowKey(prev => !prev)}
                aria-label={showKey ? 'Hide API key' : 'Show API key'}
              >
                {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-destructive flex items-center gap-1" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Get a free API key <ExternalLink className="h-3 w-3" />
            </a>
            <Button onClick={handleSave} className="cursor-pointer">
              {state.apiKey ? (
                <><CheckCircle2 className="mr-1.5 h-4 w-4" /> Update Key</>
              ) : (
                'Save Key'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
