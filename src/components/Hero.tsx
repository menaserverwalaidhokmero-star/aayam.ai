import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Wand2, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Play, 
  Flame,
  Cpu
} from 'lucide-react';
import { ToolId } from '../types';

interface HeroProps {
  onStartCreating: () => void;
  onExploreTools: () => void;
  onQuickGenerate: (prompt: string, tool: ToolId) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartCreating,
  onExploreTools,
  onQuickGenerate,
}) => {
  const [quickPrompt, setQuickPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<ToolId>('photo-generator');

  const samplePrompts: Record<string, string[]> = {
    'photo-generator': [
      'Cyberpunk samurai with glowing purple katana in Neo-Tokyo rain',
      'Futuristic biomechanical hummingbird sipping liquid neon starlight',
      'Hyper-realistic cosmic astronaut gazing at a violet Dyson sphere',
    ],
    'video-generator': [
      'Cinematic camera pan through a neon metropolis with floating holographic koi',
      'Bioluminescent quantum flower blooming in deep interstellar space',
    ],
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    onQuickGenerate(quickPrompt.trim(), activeTab);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 cyber-grid">
      {/* Background Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Call To Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Startup Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel-glow border border-purple-500/30 text-xs font-mono text-purple-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-cyan-300 font-semibold">AAYAM AI 3.0</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-300">Next-Gen Neural Synthesis</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.08]">
              Create Beyond <br className="hidden sm:inline" />
              <span className="gradient-text-neon neon-glow-purple">
                Imagination
              </span>
            </h1>

            {/* Tagline & Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Step into the future of creative artificial intelligence. Synthesize photorealistic 8K imagery, prompt-guided neural photo edits, and cinematic high-definition videos in seconds.
            </p>

            {/* Main Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartCreating}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-semibold text-base shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                <Sparkles className="w-5 h-5 text-cyan-300 group-hover:rotate-12 transition-transform" />
                <span>Start Creating</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreTools}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-panel text-slate-200 hover:text-white hover:bg-white/10 border border-slate-700/60 hover:border-cyan-500/40 font-semibold text-base transition-all flex items-center justify-center gap-2"
              >
                <Layers className="w-5 h-5 text-purple-400" />
                <span>Explore Tools</span>
              </button>
            </div>

            {/* Quick Prompt Input Widget */}
            <div className="pt-4 max-w-2xl mx-auto lg:mx-0">
              <form onSubmit={handleQuickSubmit} className="glass-panel p-2 rounded-2xl border border-purple-500/30 focus-within:border-cyan-400/60 shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all">
                <div className="flex items-center gap-2 mb-2 px-2 pt-1">
                  <span className="text-[11px] font-mono uppercase text-slate-400">Quick Prompt:</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab('photo-generator')}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-lg transition-colors ${
                        activeTab === 'photo-generator'
                          ? 'bg-purple-600/40 text-cyan-300 border border-purple-400/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('video-generator')}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-lg transition-colors ${
                        activeTab === 'video-generator'
                          ? 'bg-purple-600/40 text-cyan-300 border border-purple-400/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Video
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={quickPrompt}
                    onChange={(e) => setQuickPrompt(e.target.value)}
                    placeholder={
                      activeTab === 'photo-generator'
                        ? 'e.g., A cybernetic lotus glowing on obsidian water...'
                        : 'e.g., Cinematic camera flyover neon cityscape...'
                    }
                    className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
                  >
                    <Zap className="w-4 h-4 text-cyan-300" />
                    <span>Synthesize</span>
                  </button>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2 px-1">
                  {(samplePrompts[activeTab] || []).map((prompt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setQuickPrompt(prompt)}
                      className="text-[10px] text-slate-400 hover:text-cyan-300 truncate max-w-[280px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md transition-colors"
                    >
                      ✦ {prompt}
                    </button>
                  ))}
                </div>
              </form>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-purple-500/20 max-w-xl mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="font-display font-bold text-xl sm:text-2xl text-white">
                  4.8M<span className="text-cyan-400">+</span>
                </div>
                <div className="text-[11px] text-slate-400">Renders Generated</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-display font-bold text-xl sm:text-2xl text-purple-300">
                  &lt;1.2s
                </div>
                <div className="text-[11px] text-slate-400">Engine Latency</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-display font-bold text-xl sm:text-2xl text-cyan-300">
                  8K UHD
                </div>
                <div className="text-[11px] text-slate-400">Max Resolution</div>
              </div>
            </div>
          </div>

          {/* Right Column: AI-Themed Interactive Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Glowing Holographic Frame */}
              <div className="relative rounded-3xl p-1 bg-gradient-to-b from-purple-500 via-cyan-400 to-indigo-600 shadow-[0_0_50px_rgba(168,85,247,0.35)]">
                <div className="relative rounded-[22px] overflow-hidden bg-[#070514] border border-white/10 aspect-[4/5] sm:aspect-[4/4] lg:aspect-[4/5]">
                  
                  {/* Cyber Hero Image */}
                  <img
                    src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80"
                    alt="AAYAM AI Cyber Art"
                    className="w-full h-full object-cover object-center filter saturate-125"
                  />
                  
                  {/* Neon Overlay Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04020a] via-transparent to-purple-900/20" />
                  
                  {/* Scanline Animation */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-scanline pointer-events-none" />

                  {/* Top Floating HUD Chips */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="glass-panel px-3 py-1.5 rounded-full flex items-center gap-2 border border-purple-500/40 text-[11px] font-mono text-purple-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>SYNTHESIS_ACTIVE</span>
                    </div>
                    <div className="glass-panel px-2.5 py-1 rounded-full border border-cyan-400/40 text-[11px] font-mono text-cyan-300 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-cyan-400" />
                      <span>60 FPS</span>
                    </div>
                  </div>

                  {/* Center HUD Reticle */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                    <div className="w-32 h-32 rounded-full border border-dashed border-cyan-400/60 animate-spin" style={{ animationDuration: '20s' }} />
                  </div>

                  {/* Bottom Generation Info Card */}
                  <div className="absolute bottom-4 left-4 right-4 glass-panel-glow p-4 rounded-2xl border border-purple-500/40">
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        <span className="font-semibold text-white">Neural Synthesis</span>
                      </div>
                      <span className="font-mono text-[10px] text-cyan-300">100% COMPLETE</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-mono line-clamp-2">
                      &quot;Cyber samurai with glowing purple katana in Neo-Tokyo rain, 8K ultra detail&quot;
                    </p>
                    <div className="mt-2.5 flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300">
                        16:9 Cinema
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                        Veo & Nano
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Decorative Elements */}
              <div className="absolute -top-6 -right-6 glass-panel px-4 py-2.5 rounded-2xl border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.3)] hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-300">
                  <Play className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">Text to Video</div>
                  <div className="text-[10px] text-cyan-300 font-mono">Omni-1.2 Ready</div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 glass-panel px-4 py-2.5 rounded-2xl border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.3)] hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">AI Photo Editor</div>
                  <div className="text-[10px] text-purple-300 font-mono">Prompt-Driven</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
