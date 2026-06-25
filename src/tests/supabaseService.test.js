import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchPains,
  addPain,
  toggleVote,
  submitSolution,
  submitTool,
  fetchApprovedTools,
  searchAll,
  fetchPendingSolutions,
  fetchPendingTools,
  approveSolution,
  rejectSolution,
  approveTool,
  rejectTool,
} from '../lib/supabaseService';
import { supabase } from '../lib/supabaseClient';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock Supabase client
vi.mock('../lib/supabaseClient', () => {
  const mockFrom = vi.fn();
  const mockStorage = {
    from: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({ data: { path: 'path' }, error: null }),
      getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://example.com/photo.jpg' } })),
    })),
  };
  return {
    supabase: {
      from: mockFrom,
      storage: mockStorage,
      rpc: vi.fn().mockResolvedValue({ error: null }),
    },
  };
});

describe('supabaseService', () => {
  let mockPainsData = [];
  let mockVotesData = [];
  let mockSolutionsData = [];
  let mockToolsData = [];
  
  let mockPainsError = null;
  let mockVotesError = null;
  let mockSolutionsError = null;
  let mockToolsError = null;

  function createChainMock(resolveValue) {
    const chain = {};
    const chainMethods = [
      'select', 'insert', 'update', 'delete', 'eq', 'order',
      'limit', 'single', 'maybeSingle', 'or'
    ];
    
    chainMethods.forEach(method => {
      chain[method] = vi.fn().mockImplementation(() => chain);
    });
    
    chain.then = vi.fn().mockImplementation((onFulfilled) => {
      return Promise.resolve(resolveValue).then(onFulfilled);
    });
    
    return chain;
  }

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    
    mockPainsData = [
      { id: 1, text: '"Pain 1"', description: 'Desc 1', status: 'open', votes: 10, created_at: '2026-06-01' },
      { id: 2, text: '"Pain 2"', description: 'Desc 2', status: 'solved', votes: 5, created_at: '2026-06-02' }
    ];
    mockVotesData = [{ pain_id: 1, session_id: 'session-123' }];
    mockSolutionsData = [{ id: 10, pain_id: 2, tool_name: 'Tool X', status: 'pending' }];
    mockToolsData = [{ id: 100, name: 'Tool Y', status: 'pending' }];
    
    mockPainsError = null;
    mockVotesError = null;
    mockSolutionsError = null;
    mockToolsError = null;

    supabase.from.mockImplementation((tableName) => {
      if (tableName === 'pains') {
        return createChainMock({ data: mockPainsData, error: mockPainsError });
      }
      if (tableName === 'pain_votes') {
        return createChainMock({ data: mockVotesData, error: mockVotesError });
      }
      if (tableName === 'solutions') {
        return createChainMock({ data: mockSolutionsData, error: mockSolutionsError });
      }
      if (tableName === 'tools') {
        return createChainMock({ data: mockToolsData, error: mockToolsError });
      }
      return createChainMock({ data: [], error: null });
    });
  });

  describe('fetchPains', () => {
    it('should fetch pains and map voted & pending flags correctly', async () => {
      localStorageMock.getItem.mockReturnValue('session-123');
      
      const result = await fetchPains();
      
      expect(supabase.from).toHaveBeenCalledWith('pains');
      expect(supabase.from).toHaveBeenCalledWith('pain_votes');
      expect(supabase.from).toHaveBeenCalledWith('solutions');
      
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[0].voted).toBe(true);
      expect(result[0].hasPendingSolution).toBe(false);
      
      expect(result[1].id).toBe(2);
      expect(result[1].voted).toBe(false);
      expect(result[1].hasPendingSolution).toBe(true);
    });

    it('should return empty array on fetch error', async () => {
      mockPainsError = { message: 'Fetch error' };
      mockPainsData = null;

      const result = await fetchPains();
      expect(result).toEqual([]);
    });
  });

  describe('addPain', () => {
    it('should insert pain into pains table and insert user vote', async () => {
      const newPain = { id: 3, text: '"My New Pain"', description: 'Some desc', status: 'open', votes: 1 };
      
      // Override default pains mock for single row insert
      supabase.from.mockImplementation((tableName) => {
        if (tableName === 'pains') {
          return createChainMock({ data: newPain, error: null });
        }
        return createChainMock({ data: [], error: null });
      });

      const result = await addPain('My New Pain', 'Some desc');
      
      expect(supabase.from).toHaveBeenCalledWith('pains');
      expect(supabase.from).toHaveBeenCalledWith('pain_votes');
      expect(result).toEqual({ ...newPain, voted: true });
    });
  });

  describe('toggleVote', () => {
    it('should add a vote if it does not already exist', async () => {
      // Stub check for existing vote to return null
      supabase.from.mockImplementation((tableName) => {
        if (tableName === 'pain_votes') {
          return createChainMock({ data: null, error: null }); // no vote
        }
        if (tableName === 'pains') {
          return createChainMock({ data: { id: 1, votes: 10 }, error: null });
        }
        return createChainMock({ data: [], error: null });
      });

      const voted = await toggleVote(1);
      
      expect(voted).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith('pain_votes');
    });

    it('should remove a vote if it already exists', async () => {
      // Stub check for existing vote to return a record
      supabase.from.mockImplementation((tableName) => {
        if (tableName === 'pain_votes') {
          return createChainMock({ data: { id: 99, pain_id: 1 }, error: null });
        }
        if (tableName === 'pains') {
          return createChainMock({ data: { id: 1, votes: 10 }, error: null });
        }
        return createChainMock({ data: [], error: null });
      });

      const voted = await toggleVote(1);
      
      expect(voted).toBe(false);
      expect(supabase.from).toHaveBeenCalledWith('pain_votes');
    });
  });

  describe('submitSolution', () => {
    it('should insert a pending solution', async () => {
      const mockFile = new File([''], 'test.png', { type: 'image/png' });
      
      supabase.from.mockImplementation((tableName) => {
        if (tableName === 'solutions') {
          return createChainMock({ data: { id: 45, tool_name: 'Sol 1' }, error: null });
        }
        return createChainMock({ data: [], error: null });
      });

      const result = await submitSolution(1, {
        toolName: 'Sol 1',
        toolUrl: 'http://test.com',
        toolDescription: 'Desc',
        photoFile: mockFile
      });

      expect(supabase.storage.from).toHaveBeenCalledWith('tool-images');
      expect(supabase.from).toHaveBeenCalledWith('solutions');
      expect(result.tool_name).toBe('Sol 1');
    });
  });

  describe('submitTool', () => {
    it('should insert a pending tool submission', async () => {
      supabase.from.mockImplementation((tableName) => {
        if (tableName === 'tools') {
          return createChainMock({ data: { id: 77, name: 'Tool A' }, error: null });
        }
        return createChainMock({ data: [], error: null });
      });

      const result = await submitTool({
        name: 'Tool A',
        url: 'tool-a.com',
        description: 'Testing tool submission',
        category: 'plugin'
      });

      expect(supabase.from).toHaveBeenCalledWith('tools');
      expect(result.name).toBe('Tool A');
    });
  });

  describe('searchAll', () => {
    it('should search pains and tools by keyword', async () => {
      const result = await searchAll('figma');
      
      expect(supabase.from).toHaveBeenCalledWith('pains');
      expect(supabase.from).toHaveBeenCalledWith('tools');
      expect(result.pains).toHaveLength(2);
    });
  });

  describe('admin functions', () => {
    it('approveSolution should approve solution and update pain to solved', async () => {
      supabase.from.mockImplementation((tableName) => {
        if (tableName === 'solutions') {
          return createChainMock({ data: { id: 10, pain_id: 1, tool_name: 'Solved Tool', tool_url: 't.com' }, error: null });
        }
        if (tableName === 'pains') {
          return createChainMock({ data: { id: 1 }, error: null });
        }
        return createChainMock({ data: [], error: null });
      });

      const success = await approveSolution(10);
      expect(success).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith('solutions');
      expect(supabase.from).toHaveBeenCalledWith('pains');
    });

    it('rejectSolution should set status to rejected', async () => {
      const success = await rejectSolution(10);
      expect(success).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith('solutions');
    });

    it('approveTool should set status to approved', async () => {
      const success = await approveTool(100);
      expect(success).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith('tools');
    });

    it('rejectTool should set status to rejected', async () => {
      const success = await rejectTool(100);
      expect(success).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith('tools');
    });
  });
});
