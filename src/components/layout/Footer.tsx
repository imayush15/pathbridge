import { Compass, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/30 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600 text-white">
              <Compass className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">PathBridge</span>
          </div>

          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            Built with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> by the
            <span className="font-medium text-foreground">PathBridge</span> team
          </p>

          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} PathBridge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
