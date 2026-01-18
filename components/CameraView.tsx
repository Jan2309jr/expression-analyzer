
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AnalysisStatus } from '../types';

interface CameraViewProps {
  onCapture: (base64: string) => void;
  status: AnalysisStatus;
  isContinuous: boolean;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, status, isContinuous }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Could not access camera. Please check permissions.');
      console.error(err);
    }
  };

  const captureFrame = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
        const base64 = dataUrl.split(',')[1];
        onCapture(base64);
      }
    }
  }, [onCapture]);

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="relative w-full aspect-video md:aspect-auto md:h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl ring-1 ring-slate-700/50">
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-center p-6">
          <svg className="w-12 h-12 text-rose-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-rose-400 font-medium">{error}</p>
          <button 
            onClick={startCamera}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-semibold transition-colors"
          >
            Retry Camera
          </button>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover scale-x-[-1]"
          />
          
          {/* Overlay Effects */}
          <div className="absolute inset-0 pointer-events-none border-[16px] border-slate-900/20"></div>
          <div className="absolute inset-4 pointer-events-none border border-white/10 rounded-xl"></div>
          
          {/* Scanning Animation */}
          {status === AnalysisStatus.ANALYZING && (
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-scan-line"></div>
          )}

          {/* UI Controls on Camera */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <button 
              disabled={status === AnalysisStatus.ANALYZING}
              onClick={captureFrame}
              className={`group flex items-center justify-center w-16 h-16 rounded-full border-4 border-white/20 transition-all ${status === AnalysisStatus.ANALYZING ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center transition-all group-hover:bg-indigo-100">
                {status === AnalysisStatus.ANALYZING ? (
                  <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-900"></div>
                )}
              </div>
            </button>
          </div>

          <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-full">
            <div className={`w-2 h-2 rounded-full ${isContinuous ? 'bg-indigo-500' : 'bg-slate-500'}`}></div>
            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">
              {isContinuous ? 'Continuous Analysis' : 'On-Demand'}
            </span>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
      <style>{`
        @keyframes scan-line {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan-line {
          animation: scan-line 2s linear infinite;
        }
      `}</style>
    </div>
  );
};
