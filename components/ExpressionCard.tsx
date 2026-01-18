
import React from 'react';
import { ExpressionResult, AnalysisStatus } from '../types';

interface ExpressionCardProps {
  result: ExpressionResult | null;
  status: AnalysisStatus;
}

export const ExpressionCard: React.FC<ExpressionCardProps> = ({ result, status }) => {
  if (status === AnalysisStatus.IDLE && !result) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-800/50 rounded-2xl border border-dashed border-slate-700">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-300">Ready to Analyze</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-xs">Capture a frame to begin facial expression and micro-expression analysis.</p>
      </div>
    );
  }

  if (status === AnalysisStatus.ANALYZING && !result) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-8 bg-slate-800/50 rounded-2xl border border-slate-700 animate-pulse">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium">Consulting EmoLens Core...</p>
      </div>
    );
  }

  if (!result) return null;

  const emotionColors: Record<string, string> = {
    'Joy': 'bg-yellow-500',
    'Happiness': 'bg-yellow-500',
    'Sadness': 'bg-blue-500',
    'Anger': 'bg-rose-500',
    'Surprise': 'bg-purple-500',
    'Fear': 'bg-emerald-500',
    'Disgust': 'bg-orange-700',
    'Contempt': 'bg-zinc-500',
    'Neutral': 'bg-slate-500'
  };

  const getEmotionColor = (emotion: string) => {
    return emotionColors[emotion] || 'bg-indigo-500';
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
      {/* Primary Emotion Hero */}
      <div className="relative overflow-hidden bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1 block">Primary State</span>
            <h2 className="text-4xl font-black text-white">{result.primaryEmotion}</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded uppercase">
                {Math.round(result.confidence * 100)}% Confidence
              </div>
              <div className="px-2 py-0.5 bg-slate-700 text-slate-400 text-[10px] font-bold rounded uppercase">
                {result.secondaryEmotion} Secondary
              </div>
            </div>
          </div>
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getEmotionColor(result.primaryEmotion)} shadow-lg shadow-black/20`}>
             <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
        </div>
      </div>

      {/* Narrative */}
      <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">AI Interpretation</h4>
        <p className="text-slate-300 text-sm leading-relaxed">{result.explanation}</p>
      </div>

      {/* Cues Grid */}
      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Detected Micro-Expressions</h4>
        <div className="flex flex-wrap gap-2">
          {result.cues.map((cue, idx) => (
            <span key={idx} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium rounded-full">
              {cue}
            </span>
          ))}
        </div>
      </div>

      {/* Emotion Breakdown */}
      <div className="flex-1 min-h-[200px]">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Emotional Spectrum</h4>
        <div className="space-y-3">
          {result.emotionBreakdown.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-slate-300 uppercase">{item.emotion}</span>
                <span className="text-slate-500">{Math.round(item.score * 100)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getEmotionColor(item.emotion)} transition-all duration-1000`} 
                  style={{ width: `${item.score * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
