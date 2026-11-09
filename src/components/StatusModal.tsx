import React from 'react';
import { Cpu, ShieldCheck, X, CheckCircle, AlertTriangle, ExternalLink, Key, Zap } from 'lucide-react';
import { ApiStatus } from '../types';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: ApiStatus | null;
}

export const StatusModal: React.FC<StatusModalProps> = ({ isOpen, onClose, status }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-lg w-full glass-panel-glow rounded-3xl p-6 sm:p-7 border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.35)] space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                AAYAM AI Architecture &amp; Engine
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Backend System Diagnostics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current State Banner */}
        <div className={`p-4 rounded-2xl border ${
          status?.isKeyConfigured
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            : 'bg-indigo-950/40 border-cyan-500/40 text-cyan-300'
        }`}>
          <div className="flex items-start gap-3">
            {status?.isKeyConfigured ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider font-mono">
                {status?.isKeyConfigured ? 'Live Cloud Neural Synthesis Active' : 'Showcase Simulation Mode Active'}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {status?.message}
              </p>
            </div>
          </div>
        </div>

        {/* Model Pipeline Specs */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Configured Neural Models (Server-Side)</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
              <span className="text-slate-300">Photo Generator:</span>
              <span className="text-purple-300">gemini-3.1-flash-lite-image</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
              <span className="text-slate-300">Photo Editor:</span>
              <span className="text-cyan-300">gemini-3.1-flash-lite-image</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
              <span className="text-slate-300">AI Video (Veo):</span>
              <span className="text-indigo-300">gemini-omni-1.2-flash</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
              <span className="text-slate-300">Image to Video:</span>
              <span className="text-pink-300">gemini-omni-1.2-flash</span>
            </div>
          </div>
        </div>

        {/* Security & Key Policy */}
        <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 font-mono text-purple-400 font-semibold">
            <Key className="w-4 h-4" />
            <span>Zero Client-Side Key Exposure</span>
          </div>
          <p className="leading-relaxed text-slate-400 text-[11px]">
            In strict compliance with modern security architecture, API keys are never exposed in browser JavaScript. All neural generation requests are routed through the secure <code className="text-cyan-300">/api/*</code> server endpoints running Node Express.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
        >
          Close Diagnostics
        </button>

      </div>
    </div>
  );
};
