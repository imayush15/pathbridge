import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, ChevronUp, ExternalLink, Loader2 } from 'lucide-react';
import type { ComparisonDimension } from '@/lib/types';

function DimensionRow({ dim, path1Title, path2Title }: { dim: ComparisonDimension; path1Title: string; path2Title: string }) {
  const winnerIs1 = dim.winner === 1;
  const winnerIs2 = dim.winner === 2;

  return (
    <div className="grid grid-cols-3 gap-2 items-center py-2.5 border-b border-border/30 last:border-b-0">
      <div className={`rounded-lg p-2 text-xs text-center transition-colors ${winnerIs1 ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-semibold' : 'text-foreground/70'}`}>
        <p className="font-medium sm:hidden text-[10px] text-muted-foreground mb-0.5">{path1Title}</p>
        {dim.path1Value}
        {winnerIs1 ? <span className="sr-only"> (winner)</span> : null}
      </div>
      <div className="text-center">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{dim.label}</p>
      </div>
      <div className={`rounded-lg p-2 text-xs text-center transition-colors ${winnerIs2 ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-semibold' : 'text-foreground/70'}`}>
        <p className="font-medium sm:hidden text-[10px] text-muted-foreground mb-0.5">{path2Title}</p>
        {dim.path2Value}
        {winnerIs2 ? <span className="sr-only"> (winner)</span> : null}
      </div>
    </div>
  );
}

function SourcesSection({ chunks }: { chunks: Array<{ uri: string; title: string }> }) {
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

export function ComparisonView() {
  const { state, dispatch } = useApp();

  const isOpen = state.comparisonPair !== null;
  const isLoading = state.comparisonPair !== null && state.comparisonResult === null;
  const result = state.comparisonResult;

  const paths = state.results?.career_paths;
  if (!paths) return null;

  const pair = state.comparisonPair;
  const path1 = pair ? paths[pair[0]] : null;
  const path2 = pair ? paths[pair[1]] : null;

  const handleClose = () => {
    dispatch({ type: 'CLEAR_COMPARISON' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Compare Career Paths
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3" role="status" aria-label="Loading comparison">
            <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Analyzing and comparing career paths...</p>
          </div>
        ) : result && path1 && path2 ? (
          <div className="space-y-4">
            {/* AI Summary */}
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
              {result.groundingChunks && result.groundingChunks.length > 0 ? (
                <Badge variant="secondary" className="mb-2 text-[10px] px-1.5 py-0.5 gap-1">
                  <Globe className="h-2.5 w-2.5" /> Search-grounded
                </Badge>
              ) : null}
              <p className="text-sm leading-relaxed">{result.summary}</p>
              {result.groundingChunks && result.groundingChunks.length > 0 ? (
                <SourcesSection chunks={result.groundingChunks} />
              ) : null}
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-xs font-bold text-primary truncate">{path1.emoji} {path1.title}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">vs</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-primary truncate">{path2.emoji} {path2.title}</p>
              </div>
            </div>

            {/* Dimension rows */}
            <div className="rounded-xl border border-border/40 p-3">
              {result.dimensions.map((dim, i) => (
                <DimensionRow
                  key={dim.label + i}
                  dim={dim}
                  path1Title={path1.title}
                  path2Title={path2.title}
                />
              ))}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
