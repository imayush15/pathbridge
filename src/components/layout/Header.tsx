import { Compass, Settings, Moon, Sun, CheckCircle2 } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3 text-foreground no-underline group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/25 transition-transform duration-200 group-hover:scale-105">
            <Compass className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight leading-tight">PathBridge</span>
            <span className="text-[10px] font-medium text-muted-foreground leading-tight hidden sm:block">AI Career Navigator</span>
          </div>
        </a>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger
              onClick={onOpenApiKey}
              className="relative cursor-pointer inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="API Key Settings"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">API Key</span>
              {state.apiKey && (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              {state.apiKey ? 'API key configured' : 'Set your API key'}
            </TooltipContent>
          </Tooltip>

          <div className="h-5 w-px bg-border/60 mx-1" />

          <div className="flex items-center gap-2 rounded-full bg-muted/50 px-2 py-1.5">
            <Sun className="h-3.5 w-3.5 text-muted-foreground" />
            <Switch
              checked={dark}
              onCheckedChange={setDark}
              aria-label="Toggle dark mode"
              className="cursor-pointer"
            />
            <Moon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
