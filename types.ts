
export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  generationInstructions: string;
}

export interface GeneratedResult {
  experienceId: string;
  company: string;
  role: string;
  bulletPoints: string[];
  contextSources: Array<{
    title: string;
    uri: string;
  }>;
  roadmapContext: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  RESEARCHING = 'RESEARCHING',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
