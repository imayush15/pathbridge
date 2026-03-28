import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { PathBridgeResponse, AnalysisInput } from '@/lib/types';

interface AppState {
  apiKey: string | null;
  isAnalyzing: boolean;
  analysisStep: number;
  results: PathBridgeResponse | null;
  error: string | null;
  lastInput: AnalysisInput | null;
}

type Action =
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'START_ANALYSIS'; payload: AnalysisInput }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_RESULTS'; payload: PathBridgeResponse }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'RESET' };

const initialState: AppState = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('pathbridge_api_key'),
  isAnalyzing: false,
  analysisStep: 0,
  results: null,
  error: null,
  lastInput: null,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_API_KEY':
      localStorage.setItem('pathbridge_api_key', action.payload);
      return { ...state, apiKey: action.payload };
    case 'START_ANALYSIS':
      return { ...state, isAnalyzing: true, analysisStep: 1, error: null, results: null, lastInput: action.payload };
    case 'SET_STEP':
      return { ...state, analysisStep: action.payload };
    case 'SET_RESULTS':
      return { ...state, isAnalyzing: false, results: action.payload, analysisStep: 0 };
    case 'SET_ERROR':
      return { ...state, isAnalyzing: false, error: action.payload, analysisStep: 0 };
    case 'RESET':
      return { ...state, results: null, error: null, isAnalyzing: false, analysisStep: 0, lastInput: null };
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
