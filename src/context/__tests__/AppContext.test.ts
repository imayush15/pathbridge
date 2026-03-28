import { renderHook } from '@testing-library/react';
import { reducer, initialState, type Action } from '@/context/AppContext';
import { useApp } from '@/context/AppContext';
import {
  createMockResponse,
  createMockConversation,
  createMockComparison,
} from '@/test/fixtures';
import type { AnalysisInput } from '@/lib/types';

// ---------------------------------------------------------------------------
// initialState defaults
// ---------------------------------------------------------------------------
describe('initialState', () => {
  it('has correct default values', () => {
    expect(initialState.apiKey).toBeNull();
    expect(initialState.cloudApiKey).toBeNull();
    expect(initialState.isAnalyzing).toBe(false);
    expect(initialState.analysisStep).toBe(0);
    expect(initialState.results).toBeNull();
    expect(initialState.error).toBeNull();
    expect(initialState.lastInput).toBeNull();
    expect(initialState.conversations).toEqual({});
    expect(initialState.comparisonPair).toBeNull();
    expect(initialState.comparisonResult).toBeNull();
    expect(initialState.avatarImage).toBeNull();
    expect(initialState.roadmapImages).toEqual({});
    expect(initialState.imageLoadingStates).toEqual({});
    expect(initialState.visiblePathCount).toBe(1);
    expect(initialState.unlockedPaths).toEqual(new Set<number>());
  });
});

// ---------------------------------------------------------------------------
// reducer
// ---------------------------------------------------------------------------
describe('reducer', () => {
  // ---- SET_API_KEY ----
  describe('SET_API_KEY', () => {
    it('sets apiKey', () => {
      const next = reducer(initialState, { type: 'SET_API_KEY', payload: 'test-key' });
      expect(next.apiKey).toBe('test-key');
    });
  });

  // ---- SET_CLOUD_API_KEY ----
  describe('SET_CLOUD_API_KEY', () => {
    it('sets cloudApiKey', () => {
      const next = reducer(initialState, { type: 'SET_CLOUD_API_KEY', payload: 'cloud-key' });
      expect(next.cloudApiKey).toBe('cloud-key');
    });
  });

  // ---- SET_VISIBLE_PATH_COUNT ----
  describe('SET_VISIBLE_PATH_COUNT', () => {
    it('sets visiblePathCount', () => {
      const next = reducer(initialState, { type: 'SET_VISIBLE_PATH_COUNT', payload: 3 });
      expect(next.visiblePathCount).toBe(3);
    });
  });

  // ---- UNLOCK_PATH ----
  describe('UNLOCK_PATH', () => {
    it('adds to unlockedPaths Set', () => {
      const next = reducer(initialState, { type: 'UNLOCK_PATH', payload: 2 });
      expect(next.unlockedPaths.has(2)).toBe(true);
      expect(next.unlockedPaths.size).toBe(1);
    });

    it('is idempotent – adding same path twice keeps size unchanged', () => {
      const first = reducer(initialState, { type: 'UNLOCK_PATH', payload: 2 });
      const second = reducer(first, { type: 'UNLOCK_PATH', payload: 2 });
      expect(second.unlockedPaths.size).toBe(1);
      expect(second.unlockedPaths.has(2)).toBe(true);
    });
  });

  // ---- START_ANALYSIS ----
  describe('START_ANALYSIS', () => {
    it('sets isAnalyzing true and resets results/error/conversations/comparison/images', () => {
      const input: AnalysisInput = { type: 'text', text: 'I like coding' };

      // Pre-populate state with data that should be reset
      const dirty = {
        ...initialState,
        results: createMockResponse(),
        error: 'old error',
        conversations: { 0: [createMockConversation()] },
        comparisonPair: [0, 1] as [number, number],
        comparisonResult: createMockComparison(),
        avatarImage: 'data:image/png;base64,abc',
        roadmapImages: { 0: 'data:image/png;base64,xyz' },
        imageLoadingStates: { avatar: 'done' as const },
        unlockedPaths: new Set([1, 2]),
      };

      const next = reducer(dirty, { type: 'START_ANALYSIS', payload: input });

      expect(next.isAnalyzing).toBe(true);
      expect(next.analysisStep).toBe(1);
      expect(next.lastInput).toBe(input);
      expect(next.results).toBeNull();
      expect(next.error).toBeNull();
      expect(next.conversations).toEqual({});
      expect(next.comparisonPair).toBeNull();
      expect(next.comparisonResult).toBeNull();
      expect(next.avatarImage).toBeNull();
      expect(next.roadmapImages).toEqual({});
      expect(next.imageLoadingStates).toEqual({});
      expect(next.unlockedPaths.size).toBe(0);
    });
  });

  // ---- SET_STEP ----
  describe('SET_STEP', () => {
    it('sets analysisStep', () => {
      const next = reducer(initialState, { type: 'SET_STEP', payload: 4 });
      expect(next.analysisStep).toBe(4);
    });
  });

  // ---- SET_RESULTS ----
  describe('SET_RESULTS', () => {
    it('sets results, isAnalyzing false, analysisStep 0', () => {
      const analyzing = { ...initialState, isAnalyzing: true, analysisStep: 3 };
      const mockResults = createMockResponse();
      const next = reducer(analyzing, { type: 'SET_RESULTS', payload: mockResults });

      expect(next.results).toBe(mockResults);
      expect(next.isAnalyzing).toBe(false);
      expect(next.analysisStep).toBe(0);
    });
  });

  // ---- SET_ERROR ----
  describe('SET_ERROR', () => {
    it('sets error, isAnalyzing false, analysisStep 0', () => {
      const analyzing = { ...initialState, isAnalyzing: true, analysisStep: 2 };
      const next = reducer(analyzing, { type: 'SET_ERROR', payload: 'Something went wrong' });

      expect(next.error).toBe('Something went wrong');
      expect(next.isAnalyzing).toBe(false);
      expect(next.analysisStep).toBe(0);
    });
  });

  // ---- RESET ----
  describe('RESET', () => {
    it('resets most state but preserves apiKey and cloudApiKey', () => {
      const populated = {
        ...initialState,
        apiKey: 'keep-me',
        cloudApiKey: 'keep-me-too',
        results: createMockResponse(),
        error: 'an error',
        isAnalyzing: true,
        analysisStep: 5,
        lastInput: { type: 'text' as const, text: 'hello' },
        conversations: { 0: [createMockConversation()] },
        comparisonPair: [0, 1] as [number, number],
        comparisonResult: createMockComparison(),
        avatarImage: 'img',
        roadmapImages: { 0: 'img' },
        imageLoadingStates: { avatar: 'done' as const },
        unlockedPaths: new Set([1]),
        visiblePathCount: 3,
      };

      const next = reducer(populated, { type: 'RESET' });

      expect(next.apiKey).toBe('keep-me');
      expect(next.cloudApiKey).toBe('keep-me-too');
      expect(next.visiblePathCount).toBe(3); // preserved via spread
      expect(next.results).toBeNull();
      expect(next.error).toBeNull();
      expect(next.isAnalyzing).toBe(false);
      expect(next.analysisStep).toBe(0);
      expect(next.lastInput).toBeNull();
      expect(next.conversations).toEqual({});
      expect(next.comparisonPair).toBeNull();
      expect(next.comparisonResult).toBeNull();
      expect(next.avatarImage).toBeNull();
      expect(next.roadmapImages).toEqual({});
      expect(next.imageLoadingStates).toEqual({});
      expect(next.unlockedPaths.size).toBe(0);
    });
  });

  // ---- ADD_CONVERSATION ----
  describe('ADD_CONVERSATION', () => {
    it('creates a new array for a new card index', () => {
      const entry = createMockConversation();
      const next = reducer(initialState, {
        type: 'ADD_CONVERSATION',
        payload: { cardIndex: 0, entry },
      });

      expect(next.conversations[0]).toEqual([entry]);
    });

    it('appends to existing conversation array', () => {
      const entry1 = createMockConversation({ question: 'Q1' });
      const entry2 = createMockConversation({ question: 'Q2' });

      const withOne = reducer(initialState, {
        type: 'ADD_CONVERSATION',
        payload: { cardIndex: 0, entry: entry1 },
      });
      const withTwo = reducer(withOne, {
        type: 'ADD_CONVERSATION',
        payload: { cardIndex: 0, entry: entry2 },
      });

      expect(withTwo.conversations[0]).toHaveLength(2);
      expect(withTwo.conversations[0][0].question).toBe('Q1');
      expect(withTwo.conversations[0][1].question).toBe('Q2');
    });
  });

  // ---- SET_COMPARISON_PAIR ----
  describe('SET_COMPARISON_PAIR', () => {
    it('sets comparisonPair', () => {
      const next = reducer(initialState, {
        type: 'SET_COMPARISON_PAIR',
        payload: [0, 2],
      });
      expect(next.comparisonPair).toEqual([0, 2]);
    });
  });

  // ---- SET_COMPARISON_RESULT ----
  describe('SET_COMPARISON_RESULT', () => {
    it('sets comparisonResult', () => {
      const mockComparison = createMockComparison();
      const next = reducer(initialState, {
        type: 'SET_COMPARISON_RESULT',
        payload: mockComparison,
      });
      expect(next.comparisonResult).toBe(mockComparison);
    });
  });

  // ---- CLEAR_COMPARISON ----
  describe('CLEAR_COMPARISON', () => {
    it('nulls both comparisonPair and comparisonResult', () => {
      const populated = {
        ...initialState,
        comparisonPair: [0, 1] as [number, number],
        comparisonResult: createMockComparison(),
      };
      const next = reducer(populated, { type: 'CLEAR_COMPARISON' });

      expect(next.comparisonPair).toBeNull();
      expect(next.comparisonResult).toBeNull();
    });
  });

  // ---- SET_AVATAR_IMAGE ----
  describe('SET_AVATAR_IMAGE', () => {
    it('sets avatarImage and imageLoadingStates to done when payload is non-null', () => {
      const next = reducer(initialState, {
        type: 'SET_AVATAR_IMAGE',
        payload: 'data:image/png;base64,abc',
      });
      expect(next.avatarImage).toBe('data:image/png;base64,abc');
      expect(next.imageLoadingStates.avatar).toBe('done');
    });

    it('sets avatarImage null and imageLoadingStates to error when payload is null', () => {
      const next = reducer(initialState, {
        type: 'SET_AVATAR_IMAGE',
        payload: null,
      });
      expect(next.avatarImage).toBeNull();
      expect(next.imageLoadingStates.avatar).toBe('error');
    });
  });

  // ---- SET_ROADMAP_IMAGE ----
  describe('SET_ROADMAP_IMAGE', () => {
    it('sets roadmapImages[index] and loading state to done', () => {
      const next = reducer(initialState, {
        type: 'SET_ROADMAP_IMAGE',
        payload: { index: 1, image: 'data:image/png;base64,roadmap1' },
      });
      expect(next.roadmapImages[1]).toBe('data:image/png;base64,roadmap1');
      expect(next.imageLoadingStates['roadmap_1']).toBe('done');
    });
  });

  // ---- SET_IMAGE_LOADING ----
  describe('SET_IMAGE_LOADING', () => {
    it('sets imageLoadingStates[key] to the given state', () => {
      const next = reducer(initialState, {
        type: 'SET_IMAGE_LOADING',
        payload: { key: 'avatar', state: 'loading' },
      });
      expect(next.imageLoadingStates.avatar).toBe('loading');
    });

    it('supports error state', () => {
      const next = reducer(initialState, {
        type: 'SET_IMAGE_LOADING',
        payload: { key: 'roadmap_0', state: 'error' },
      });
      expect(next.imageLoadingStates['roadmap_0']).toBe('error');
    });
  });

  // ---- unknown action ----
  describe('unknown action', () => {
    it('returns state unchanged', () => {
      const state = { ...initialState, apiKey: 'existing' };
      const next = reducer(state, { type: 'TOTALLY_UNKNOWN' } as unknown as Action);
      expect(next).toBe(state);
    });
  });
});

// ---------------------------------------------------------------------------
// useApp hook
// ---------------------------------------------------------------------------
describe('useApp', () => {
  it('throws when used outside AppProvider', () => {
    // Suppress expected React error boundary / console.error noise
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useApp());
    }).toThrow('useApp must be used within AppProvider');

    spy.mockRestore();
  });
});
