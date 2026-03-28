import { Compass, Settings, Moon, Sun, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useApp } from '@/context/AppContext';
import { useState, useEffect } from 'react';

export function Header({ onOpenApiKey }: { onOpenApiKey: () => void }) {
  const { state } = useApp();
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2.5 text-foreground no-underline">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
            <Compass className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">PathBridge</span>
        </a>

        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenApiKey}
                className="relative cursor-pointer"
                aria-label="API Key Settings"
              >
                <Settings className="h-4 w-4" />
                {state.apiKey && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                    <CheckCircle2 className="h-3 w-3 text-green-500 fill-green-500" />
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {state.apiKey ? 'API key configured' : 'Set your Gemini API key'}
            </TooltipContent>
          </Tooltip>

          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-muted-foreground" />
            <Switch
              checked={dark}
              onCheckedChange={setDark}
              aria-label="Toggle dark mode"
              className="cursor-pointer"
            />
            <Moon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
