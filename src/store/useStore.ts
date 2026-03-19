import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CandidateData } from '../utils/resumeAnalyzer';
import type { JobMatch } from '../utils/jobMatcher';

export interface WhiteLabelConfig {
  platformName: string;
  primaryColor: string;
}

export const defaultWhiteLabelConfig: WhiteLabelConfig = {
  platformName: 'TechJobs AI',
  primaryColor: '#3b82f6',
};

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  whiteLabelConfig: WhiteLabelConfig;
  setWhiteLabelConfig: (config: Partial<WhiteLabelConfig>) => void;

  candidate: CandidateData | null;
  setCandidate: (data: CandidateData | null) => void;

  matchedJobs: JobMatch[];
  setMatchedJobs: (jobs: JobMatch[]) => void;
  
  isProcessing: boolean;
  setIsProcessing: (status: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      
      whiteLabelConfig: defaultWhiteLabelConfig,
      setWhiteLabelConfig: (config) => set((state) => ({ 
        whiteLabelConfig: { ...state.whiteLabelConfig, ...config } 
      })),

      candidate: null,
      setCandidate: (candidate) => set({ candidate }),

      matchedJobs: [],
      setMatchedJobs: (matchedJobs) => set({ matchedJobs }),

      isProcessing: false,
      setIsProcessing: (isProcessing) => set({ isProcessing }),
    }),
    {
      name: 'robo-vagas-storage',
      partialize: (state) => ({ 
        theme: state.theme, 
        whiteLabelConfig: state.whiteLabelConfig,
        candidate: state.candidate,
        matchedJobs: state.matchedJobs
      }),
    }
  )
);
