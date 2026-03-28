import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { PathBridgeResponse, AnalysisInput, ConversationEntry, ComparisonResult } from '@/lib/types';

interface AppState {
  apiKey: string | null;
  cloudApiKey: string | null;
  isAnalyzing: boolean;
  analysisStep: number;
  results: PathBridgeResponse | null;
  error: string | null;
  lastInput: AnalysisInput | null;
  conversations: Record<number, ConversationEntry[]>;
  comparisonPair: [number, number] | null;
  comparisonResult: ComparisonResult | null;
  avatarImage: string | null;
  roadmapImages: Record<number, string>;
  imageLoadingStates: Record<string, 'loading' | 'done' | 'error'>;
  visiblePathCount: number;
  unlockedPaths: Set<number>;
}

type Action =
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'SET_CLOUD_API_KEY'; payload: string }
  | { type: 'SET_VISIBLE_PATH_COUNT'; payload: number }
  | { type: 'UNLOCK_PATH'; payload: number }
  | { type: 'START_ANALYSIS'; payload: AnalysisInput }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_RESULTS'; payload: PathBridgeResponse }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'RESET' }
  | { type: 'ADD_CONVERSATION'; payload: { cardIndex: number; entry: ConversationEntry } }
  | { type: 'SET_COMPARISON_PAIR'; payload: [number, number] | null }
  | { type: 'SET_COMPARISON_RESULT'; payload: ComparisonResult | null }
  | { type: 'CLEAR_COMPARISON' }
  | { type: 'SET_AVATAR_IMAGE'; payload: string | null }
  | { type: 'SET_ROADMAP_IMAGE'; payload: { index: number; image: string } }
  | { type: 'SET_IMAGE_LOADING'; payload: { key: string; state: 'loading' | 'done' | 'error' } };

export const initialState: AppState = {
  apiKey: null,
  cloudApiKey: null,
  isAnalyzing: false,
  analysisStep: 0,
  results: null,
  error: null,
  lastInput: null,
  conversations: {},
  comparisonPair: null,
  comparisonResult: null,
  avatarImage: null,
  roadmapImages: {},
  imageLoadingStates: {},
  visiblePathCount: 1,
  unlockedPaths: new Set<number>(),
};

export { type AppState, type Action };

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload };
    case 'SET_CLOUD_API_KEY':
      return { ...state, cloudApiKey: action.payload };
    case 'SET_VISIBLE_PATH_COUNT':
      return { ...state, visiblePathCount: action.payload };
    case 'UNLOCK_PATH': {
      const newUnlocked = new Set(state.unlockedPaths);
      newUnlocked.add(action.payload);
      return { ...state, unlockedPaths: newUnlocked };
    }
    case 'START_ANALYSIS':
      return {
        ...state,
        isAnalyzing: true,
        analysisStep: 1,
        error: null,
        results: null,
        lastInput: action.payload,
        conversations: {},
        comparisonPair: null,
        comparisonResult: null,
        avatarImage: null,
        roadmapImages: {},
        imageLoadingStates: {},
        unlockedPaths: new Set<number>(),
      };
    case 'SET_STEP':
      return { ...state, analysisStep: action.payload };
    case 'SET_RESULTS':
      return { ...state, isAnalyzing: false, results: action.payload, analysisStep: 0 };
    case 'SET_ERROR':
      return { ...state, isAnalyzing: false, error: action.payload, analysisStep: 0 };
    case 'RESET':
      return {
        ...state,
        results: null,
        error: null,
        isAnalyzing: false,
        analysisStep: 0,
        lastInput: null,
        conversations: {},
        comparisonPair: null,
        comparisonResult: null,
        avatarImage: null,
        roadmapImages: {},
        imageLoadingStates: {},
        unlockedPaths: new Set<number>(),
      };
    case 'ADD_CONVERSATION': {
      const prev = state.conversations[action.payload.cardIndex] ?? [];
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.payload.cardIndex]: [...prev, action.payload.entry],
        },
      };
    }
    case 'SET_COMPARISON_PAIR':
      return { ...state, comparisonPair: action.payload };
    case 'SET_COMPARISON_RESULT':
      return { ...state, comparisonResult: action.payload };
    case 'CLEAR_COMPARISON':
      return { ...state, comparisonPair: null, comparisonResult: null };
    case 'SET_AVATAR_IMAGE':
      return {
        ...state,
        avatarImage: action.payload,
        imageLoadingStates: { ...state.imageLoadingStates, avatar: action.payload ? 'done' : 'error' },
      };
    case 'SET_ROADMAP_IMAGE':
      return {
        ...state,
        roadmapImages: { ...state.roadmapImages, [action.payload.index]: action.payload.image },
        imageLoadingStates: { ...state.imageLoadingStates, [`roadmap_${action.payload.index}`]: 'done' },
      };
    case 'SET_IMAGE_LOADING':
      return {
        ...state,
        imageLoadingStates: { ...state.imageLoadingStates, [action.payload.key]: action.payload.state },
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
