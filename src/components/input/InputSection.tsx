import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { analyzeWithGemini } from '@/lib/gemini';
import { EXAMPLE_INPUTS } from '@/lib/prompts';
import { FileText, Image, Mic, Sparkles, Upload, X, MicOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import type { AnalysisInput } from '@/lib/types';

export function InputSection({ onOpenApiKey }: { onOpenApiKey: () => void }) {
  const { state, dispatch } = useApp();
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageContext, setImageContext] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
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

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice input is not supported in this browser. Try Chrome.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setVoiceTranscript(transcript);
    };

    recognition.onend = () => setIsRecording(false);
    recognition.start();
    setIsRecording(true);

    // Store reference to stop later
    (window as any).__recognition = recognition;
  };

  const stopRecording = () => {
    (window as any).__recognition?.stop();
    setIsRecording(false);
  };

  const handleAnalyze = async () => {
    if (!state.apiKey) {
      onOpenApiKey();
      toast.error('Please set your Gemini API key first.');
      return;
    }

    // Build input
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
    } else if (activeTab === 'voice') {
      if (!voiceTranscript.trim()) { toast.error('Please record or type a voice transcript.'); return; }
      input.voiceTranscript = voiceTranscript;
      input.text = voiceTranscript;
      input.type = 'voice';
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
        dispatch({ type: 'SET_ERROR', payload: 'Invalid API key. Please check your Gemini API key.' });
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
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Tell us about yourself</h2>
            <p className="mt-2 text-muted-foreground">
              Be messy. Be real. Paste your grades, describe your interests, talk about what you love and hate.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="text" className="cursor-pointer gap-1.5">
                <FileText className="h-4 w-4" /> Text
              </TabsTrigger>
              <TabsTrigger value="image" className="cursor-pointer gap-1.5">
                <Image className="h-4 w-4" /> Image
              </TabsTrigger>
              <TabsTrigger value="voice" className="cursor-pointer gap-1.5">
                <Mic className="h-4 w-4" /> Voice
              </TabsTrigger>
            </TabsList>

            {/* Text Tab */}
            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="text-input" className="text-sm font-medium">
                  Your background, interests, and goals
                </label>
                <Textarea
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Example: I'm in 10th grade CBSE. I got 92 in science, 78 in math, 95 in English..."
                  className="min-h-[160px] resize-y text-base"
                  maxLength={3000}
                />
                <div className="text-right text-xs text-muted-foreground">
                  {text.length}/3000
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_INPUTS.map((example) => (
                  <Badge
                    key={example.label}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => setText(example.text)}
                  >
                    {example.label}
                  </Badge>
                ))}
              </div>
            </TabsContent>

            {/* Image Tab */}
            <TabsContent value="image" className="space-y-4">
              {!imagePreview ? (
                <div
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-muted/30 p-10 transition-colors hover:border-primary/40 cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => document.getElementById('file-upload')?.click()}
                  role="button"
                  aria-label="Upload marksheet or transcript image"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && document.getElementById('file-upload')?.click()}
                >
                  <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                  <p className="text-sm font-medium">Drop your marksheet, transcript, or resume image</p>
                  <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, WebP &bull; Max 10MB</p>
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  />
                </div>
              ) : (
                <div className="relative rounded-xl border border-border overflow-hidden">
                  <img src={imagePreview} alt="Uploaded document preview" className="max-h-64 w-full object-contain bg-muted/20" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8 cursor-pointer"
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

            {/* Voice Tab */}
            <TabsContent value="voice" className="space-y-4">
              <div className="flex flex-col items-center gap-4 py-6">
                <button
                  className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-all cursor-pointer ${
                    isRecording
                      ? 'bg-destructive text-white scale-110'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                  onClick={isRecording ? stopRecording : startRecording}
                  aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                >
                  {isRecording && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-destructive/30" />
                  )}
                  {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                </button>
                <p className="text-sm text-muted-foreground">
                  {isRecording ? 'Listening... click to stop' : 'Click to start speaking'}
                </p>
              </div>
              {voiceTranscript && (
                <div className="space-y-2">
                  <label htmlFor="voice-transcript" className="text-sm font-medium">Transcript (editable)</label>
                  <Textarea
                    id="voice-transcript"
                    value={voiceTranscript}
                    onChange={(e) => setVoiceTranscript(e.target.value)}
                    className="min-h-[100px] text-base"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>

          <Button
            size="lg"
            className="mt-6 w-full cursor-pointer text-base font-semibold h-12"
            onClick={handleAnalyze}
            disabled={state.isAnalyzing}
          >
            {state.isAnalyzing ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing with Gemini...</>
            ) : (
              <><Sparkles className="mr-2 h-4 w-4" /> Generate My Career Pathways</>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
