import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { analyzeWithGemini, validateCareerPrompt } from '@/lib/gemini';
import { EXAMPLE_INPUTS } from '@/lib/prompts';
import { FileText, Image, Sparkles, Upload, X, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import type { AnalysisInput } from '@/lib/types';

export function InputSection({ onOpenApiKey }: { onOpenApiKey: () => void }) {
  const { state, dispatch } = useApp();
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageContext, setImageContext] = useState('');
  const [activeTab, setActiveTab] = useState('text');

  const handleImageUpload = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum 10MB.');
      return;
    }
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/jpg'].includes(file.type)) {
      toast.error('Unsupported format. Use PNG, JPG, or WebP.');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  }, [handleImageUpload]);

  const [isValidating, setIsValidating] = useState(false);

  const handleAnalyze = async () => {
    if (!state.apiKey) {
      onOpenApiKey();
      toast.error('Please set your API key first.');
      return;
    }

    const input: AnalysisInput = { type: 'text' };

    if (activeTab === 'text') {
      if (!text.trim()) { toast.error('Please enter some information about yourself.'); return; }
      input.text = text;
      input.type = 'text';
    } else if (activeTab === 'image') {
      if (!imageFile && !imageContext.trim()) { toast.error('Please upload an image or add context.'); return; }
      input.text = imageContext;
      input.type = imageFile ? 'image' : 'text';
      if (imageFile) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve((e.target?.result as string).split(',')[1]);
          reader.readAsDataURL(imageFile);
        });
        input.imageBase64 = base64;
        input.imageMimeType = imageFile.type;
      }
    }

    // Validate prompt before proceeding (text-based inputs only)
    const textToValidate = input.text || '';
    if (textToValidate.trim()) {
      setIsValidating(true);
      try {
        const validation = await validateCareerPrompt(state.apiKey, textToValidate);
        if (!validation.valid) {
          setIsValidating(false);
          toast.error(validation.reason || 'Please provide information related to your career, education, or professional growth.');
          return;
        }
      } catch {
        // If validation itself fails, proceed anyway
      }
      setIsValidating(false);
    }

    dispatch({ type: 'START_ANALYSIS', payload: input });

    try {
      const results = await analyzeWithGemini(
        state.apiKey,
        input,
        (step) => dispatch({ type: 'SET_STEP', payload: step })
      );
      dispatch({ type: 'SET_RESULTS', payload: results });
      toast.success('Career pathways ready!');
    } catch (err: any) {
      const message = err?.message || 'Something went wrong. Please try again.';
      if (message.includes('401') || message.includes('API_KEY')) {
        dispatch({ type: 'SET_ERROR', payload: 'Invalid API key. Please check your API key.' });
      } else if (message.includes('429')) {
        dispatch({ type: 'SET_ERROR', payload: 'Rate limited. Please wait a moment and try again.' });
      } else {
        dispatch({ type: 'SET_ERROR', payload: message });
      }
      toast.error(message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Section header */}
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-4 px-3 py-1">
          <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" /> Try it now
        </Badge>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Tell us about yourself</h2>
        <p className="mt-2 text-muted-foreground">
          Be messy. Be real. Paste your grades, describe your interests, or upload a marksheet.
        </p>
      </div>

      <Card className="border-border/40 bg-card/90 backdrop-blur-sm shadow-xl shadow-primary/5 overflow-hidden">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-border/40 px-6 pt-6 pb-3">
              <TabsList className="!flex !w-full !h-11">
                <TabsTrigger value="text" className="cursor-pointer gap-2 text-sm font-medium flex-1 h-full">
                  <FileText className="h-4 w-4" /> Text
                </TabsTrigger>
                <TabsTrigger value="image" className="cursor-pointer gap-2 text-sm font-medium flex-1 h-full">
                  <Image className="h-4 w-4" /> Image
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 sm:p-8">
              {/* Text Tab */}
              <TabsContent value="text" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <label htmlFor="text-input" className="text-sm font-medium">
                    Your background, interests, and goals
                  </label>
                  <Textarea
                    id="text-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Example: I'm in 10th grade CBSE. I got 92 in science, 78 in math, 95 in English. I love painting and robotics..."
                    className="min-h-[180px] resize-y text-base leading-relaxed"
                    maxLength={3000}
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Try an example below</p>
                    <p className="text-xs text-muted-foreground tabular-nums">{text.length}/3000</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_INPUTS.map((example) => (
                    <Badge
                      key={example.label}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors text-xs px-3 py-1.5"
                      onClick={() => setText(example.text)}
                    >
                      {example.label}
                    </Badge>
                  ))}
                </div>
              </TabsContent>

              {/* Image Tab */}
              <TabsContent value="image" className="space-y-4 mt-0">
                {!imagePreview ? (
                  <div
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 p-12 transition-all hover:border-primary/40 hover:bg-primary/5 cursor-pointer group"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => document.getElementById('file-upload')?.click()}
                    role="button"
                    aria-label="Upload marksheet or transcript image"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && document.getElementById('file-upload')?.click()}
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-transform duration-200 group-hover:scale-110">
                      <Upload className="h-7 w-7 text-primary" />
                    </div>
                    <p className="text-sm font-semibold">Drop your marksheet, transcript, or resume</p>
                    <p className="mt-1.5 text-xs text-muted-foreground">PNG, JPG, WebP &bull; Max 10MB</p>
                    <input
                      type="file"
                      id="file-upload"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    />
                  </div>
                ) : (
                  <div className="relative rounded-2xl border border-border overflow-hidden">
                    <img src={imagePreview} alt="Uploaded document preview" className="max-h-64 w-full object-contain bg-muted/20" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute right-3 top-3 h-8 w-8 cursor-pointer rounded-full shadow-lg"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      aria-label="Remove uploaded image"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="space-y-2">
                  <label htmlFor="image-context" className="text-sm font-medium">Additional context (optional)</label>
                  <Textarea
                    id="image-context"
                    value={imageContext}
                    onChange={(e) => setImageContext(e.target.value)}
                    placeholder="E.g., 'This is my Class 10 CBSE marksheet. I also enjoy painting and robotics.'"
                    className="min-h-[80px] text-base"
                  />
                </div>
              </TabsContent>

              {/* Path count toggle */}
              <div className="mt-6 flex items-center justify-between rounded-xl bg-muted/40 p-4">
                <div>
                  <p className="text-sm font-medium">Career paths to show</p>
                  <p className="text-xs text-muted-foreground mt-0.5">You can unlock more later</p>
                </div>
                <div className="flex rounded-lg border border-border bg-background p-0.5">
                  {[1, 2, 3].map((count) => (
                    <button
                      key={count}
                      onClick={() => dispatch({ type: 'SET_VISIBLE_PATH_COUNT', payload: count })}
                      className={`h-8 w-10 rounded-md text-sm font-semibold transition-all cursor-pointer ${
                        state.visiblePathCount === count
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      aria-label={`Show ${count} career path${count > 1 ? 's' : ''}`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit button */}
              <Button
                size="lg"
                className="mt-4 w-full cursor-pointer text-base font-semibold h-13 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
                onClick={handleAnalyze}
                disabled={state.isAnalyzing || isValidating}
              >
                {isValidating ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Validating your input...</>
                ) : state.isAnalyzing ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing your profile...</>
                ) : (
                  <><Sparkles className="mr-2 h-5 w-5" /> Generate My Career Pathways <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
