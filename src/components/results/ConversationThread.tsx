import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, ChevronUp, ExternalLink, AlertCircle, RotateCcw } from 'lucide-react';
import type { ConversationEntry } from '@/lib/types';

interface Props {
  entries: ConversationEntry[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

function SourcesSection({ chunks }: { chunks: NonNullable<ConversationEntry['groundingChunks']> }) {
  const [expanded, setExpanded] = useState(false);

  if (chunks.length === 0) return null;

  return (
    <div className="mt-2">
      <button
        onClick={() => setExpanded(prev => !prev)}
        className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        aria-expanded={expanded}
        aria-label={`${expanded ? 'Collapse' : 'Expand'} ${chunks.length} source${chunks.length > 1 ? 's' : ''}`}
      >
        {expanded ? <ChevronUp className="h-3 w-3" aria-hidden="true" /> : <ChevronDown className="h-3 w-3" aria-hidden="true" />}
        {chunks.length} source{chunks.length > 1 ? 's' : ''}
      </button>
      <AnimatePresence>
        {expanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-1.5 space-y-1">
              {chunks.map((chunk, i) => (
                <a
                  key={i}
                  href={chunk.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] text-primary hover:underline truncate"
                >
                  <ExternalLink className="h-2.5 w-2.5 flex-shrink-0" />
                  {chunk.title}
                </a>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2" role="status" aria-label="AI is typing a response">
      <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-muted/60 px-4 py-3">
        <div className="flex items-center gap-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-muted-foreground/40"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
            />
          ))}
        </div>
        <span className="sr-only">AI is thinking...</span>
      </div>
    </div>
  );
}

export function ConversationThread({ entries, isLoading, error, onRetry }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [entries.length, isLoading]);

  if (entries.length === 0 && !isLoading && !error) return null;

  return (
    <div ref={scrollRef} className="max-h-72 overflow-y-auto space-y-3 py-3 scrollbar-hide">
      {entries.map((entry, i) => (
        <div key={entry.timestamp + i} className="space-y-2">
          {/* User message */}
          <div className="flex justify-end" role="log" aria-label="Your question">
            <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-primary-foreground">
              <p className="text-sm leading-relaxed">{entry.question}</p>
            </div>
          </div>

          {/* AI response */}
          <div className="flex items-start gap-2" role="log" aria-label="AI response">
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-muted/60 px-4 py-2.5">
              {entry.groundingChunks && entry.groundingChunks.length > 0 ? (
                <Badge variant="secondary" className="mb-1.5 text-[10px] px-1.5 py-0.5 gap-1">
                  <Globe className="h-2.5 w-2.5" /> Search-grounded
                </Badge>
              ) : null}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{entry.answer}</p>
              {entry.groundingChunks && entry.groundingChunks.length > 0 ? (
                <SourcesSection chunks={entry.groundingChunks} />
              ) : null}
            </div>
          </div>
        </div>
      ))}

      {isLoading ? <TypingIndicator /> : null}

      {error ? (
        <div className="flex items-start gap-2">
          <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-destructive/30 bg-destructive/5 px-4 py-2.5">
            <p className="text-sm text-destructive flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              {error}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-1.5 h-7 text-xs cursor-pointer"
              onClick={onRetry}
            >
              <RotateCcw className="mr-1 h-3 w-3" /> Retry
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
