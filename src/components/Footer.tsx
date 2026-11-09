import React from 'react';
import { Sparkles, Cpu, Github, Twitter, Disc as Discord, Shield, Terminal } from 'lucide-react';
import { ToolId } from '../types';

interface FooterProps {
  onSelectTab: (tab: ToolId) => void;
  onOpenStatusModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenStatusModal }) => {
  return (
    <footer className="glass-panel border-t border-purple-500/20 pt-16 pb-24 lg:pb-12 mt-20 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1.5px] shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <div className="w-full h-full bg-[#070514] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-display font-extrabold text-2xl text-white tracking-wider">
                AAYAM<span className="text-cyan-400">AI</span>
              </span>
            </div>

            <p className="text-sm text-slate-300 font-medium">
              Create Beyond Imagination.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier futuristic neural studio for ultra-detailed photo generation, semantic natural language photo editing, and cinematic 60fps video synthesis.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onOpenStatusModal}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-[11px] font-mono text-cyan-300 hover:border-cyan-400 transition-colors"
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Engine Diagnostics</span>
              </button>
            </div>
          </div>

          {/* Column 2: Creation Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200">
              Creative Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => onSelectTab('photo-generator')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  AI Photo Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('photo-editor')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  AI Photo Editor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('video-generator')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  AI Video Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('image-to-video')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Image to Video
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200">
              Platform &amp; Library
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => onSelectTab('dashboard')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Creation Library
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('home')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Showcase Gallery
                </button>
              </li>
              <li>
                <span className="text-slate-500">API Documentation</span>
              </li>
              <li>
                <span className="text-slate-500">Preset Prompts</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200">
              Neural Infrastructure
            </h4>
            <div className="space-y-2 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5 text-purple-300">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>gemini-3.1-flash-lite-image</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>gemini-nano-banana-2.1</span>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-300">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>gemini-omni-1.2-flash (Veo)</span>
              </div>
              <div className="pt-2 text-[10px] text-slate-500">
                Encrypted Full-Stack Proxy
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} AAYAM AI. All rights reserved. Create Beyond Imagination.
          </div>
          <div className="flex items-center gap-6 text-[11px] font-mono">
            <span className="text-slate-400">Production Ready</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Responsive Android &amp; Desktop</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
