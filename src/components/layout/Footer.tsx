import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 text-center text-sm text-muted-foreground">
      <p className="flex items-center justify-center gap-1">
        Built with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> using Gemini AI &bull; Hackathon 2026
      </p>
    </footer>
  );
}
