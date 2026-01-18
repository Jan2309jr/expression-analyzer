
export interface EmotionScore {
  emotion: string;
  score: number; // 0 to 1
}

export interface ExpressionResult {
  primaryEmotion: string;
  secondaryEmotion: string;
  confidence: number;
  explanation: string;
  cues: string[];
  emotionBreakdown: EmotionScore[];
  timestamp: number;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  CAPTURING = 'CAPTURING',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
