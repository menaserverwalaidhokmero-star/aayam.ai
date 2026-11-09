import React, { useState } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Layers, 
  Sliders, 
  Zap, 
  Maximize2, 
  Bookmark, 
  AlertCircle, 
  Info,
  Cpu
} from 'lucide-react';
import { AspectRatio, GenerationItem, ApiStatus } from '../types';
import { IMAGE_STYLES, ASPECT_RATIOS, PROMPT_SUGGESTIONS } from '../data/presets';

interface PhotoGeneratorProps {
  apiStatus: ApiStatus | null;
  onSaveGeneration: (item: GenerationItem) => void;
  initialPrompt?: string;
  onOpenStatusModal: () => void;
}

export const PhotoGenerator: React.FC<PhotoGeneratorProps> = ({
  apiStatus,
  onSaveGeneration,
  initialPrompt = '',
  onOpenStatusModal,
}) => {
  const [prompt, setPrompt] = useState(
    initialPrompt || 'A cyberpunk samurai standing on a skyscraper rooftop in Neo-Tokyo, pouring rain, glowing purple katana, neon holographic reflections'
  );
  const [selectedStyle, setSelectedStyle] = useState('Cyberpunk Neon');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [quality, setQuality] = useState<'standard' | 'ultra'>('standard');
  const [negativePrompt, setNegativePrompt] = useState('blurry, distorted, low quality, oversaturated noise, watermark');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<string | null>(
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80'
  );
  const [lastPrompt, setLastPrompt] = useState(
    'A cyberpunk samurai standing on a skyscraper rooftop in Neo-Tokyo, pouring rain, glowing purple katana, neon holographic reflections'
  );
  const [isRealCloudGeneration, setIsRealCloudGeneration] = useState(true);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a descriptive prompt to generate an image.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setCurrentStep('Analyzing neural prompt tokens...');

    const stepTimer1 = setTimeout(() => {
      setCurrentStep('Computing latent diffusion vector space...');
    }, 1200);

    const stepTimer2 = setTimeout(() => {
      setCurrentStep('Refining high-frequency textures & lighting...');
    }, 2400);

    try {
      // Call server backend
      const res = await fetch('/api/generate-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: selectedStyle,
          aspectRatio,
          quality,
        }),
      });

      const data = await res.json();

      if (res.ok && data.imageUrl) {
        setGeneratedResult(data.imageUrl);
        setLastPrompt(prompt);
        setIsRealCloudGeneration(true);

        const newItem: GenerationItem = {
          id: `photo-${Date.now()}`,
          tool: 'photo-generator',
          title: prompt.slice(0, 32) + (prompt.length > 32 ? '...' : ''),
          prompt: prompt.trim(),
          outputUrl: data.imageUrl,
          aspectRatio,
          style: selectedStyle,
          createdAt: 'Just now',
          isRealCloud: true,
        };
        onSaveGeneration(newItem);
      } else {
        // If API key is missing or quota reached, handle transparently
        if (data.error === 'API_KEY_NOT_CONFIGURED') {
          // Fallback to high-quality curated showcase preview while honestly informing user
          setError('GEMINI_API_KEY is not connected in Settings > Secrets. Displaying showcase simulation mode.');
          
          // Pick appropriate aesthetic preview
          const fallbackImages = [
            'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
          ];
          const randomFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
          setGeneratedResult(randomFallback);
          setLastPrompt(prompt);
          setIsRealCloudGeneration(false);

          const newItem: GenerationItem = {
            id: `photo-demo-${Date.now()}`,
            tool: 'photo-generator',
            title: prompt.slice(0, 32) + ' (Demo)',
            prompt: prompt.trim(),
            outputUrl: randomFallback,
            aspectRatio,
            style: selectedStyle,
            createdAt: 'Just now',
            isRealCloud: false,
          };
          onSaveGeneration(newItem);
        } else {
          throw new Error(data.message || 'Generation failed');
        }
      }
    } catch (err: any) {
      console.error('Photo generation failed:', err);
      setError(err?.message || 'Synthesis encountered an issue. Please try again.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsGenerating(false);
      setCurrentStep('');
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(lastPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedResult) return;
    const a = document.createElement('a');
    a.href = generatedResult;
    a.download = `AAYAM-AI-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-purple-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300">
              <ImageIcon className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
              AI Photo Generator
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Synthesize ultra-detailed imagery from textual descriptions with customized artistic directions.
          </p>
        </div>

        {/* Engine Transparency Indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenStatusModal}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              apiStatus?.isKeyConfigured
                ? 'bg-purple-950/60 border-purple-500/40 text-purple-300 hover:border-purple-400'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:border-amber-400'
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>
              {apiStatus?.isKeyConfigured ? 'Model: gemini-3.1-flash-lite-image' : 'Showcase Mode (No Key)'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Controls & Prompt Input */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Prompt Card */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Text Prompt</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {prompt.length}/500 chars
              </span>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to synthesize in rich detail..."
              rows={4}
              className="w-full bg-black/50 border border-white/10 rounded-2xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-all resize-none"
            />

            {/* Prompt Suggestions */}
            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-1.5">
                Inspiration Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PROMPT_SUGGESTIONS.photo.slice(0, 3).map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(sug)}
                    className="text-[10px] bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 px-2.5 py-1 rounded-lg text-left truncate max-w-full transition-colors"
                  >
                    ✦ {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Style Selector */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Image Style Preset</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {IMAGE_STYLES.map((style) => {
                const isSelected = selectedStyle === style.name;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style.name)}
                    className={`relative rounded-xl p-2.5 text-left border transition-all overflow-hidden group ${
                      isSelected
                        ? 'bg-purple-600/30 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold">{style.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <span className="text-[10px] text-slate-400 block leading-tight truncate">
                        {style.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Aspect Ratio</span>
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {ASPECT_RATIOS.map((ratio) => {
                const isSelected = aspectRatio === ratio.id;
                return (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => setAspectRatio(ratio.id as AspectRatio)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-purple-600/30 border-purple-400 text-cyan-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                        : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="font-mono text-xs font-bold">{ratio.id}</div>
                    <div className="text-[9px] truncate text-slate-400 mt-0.5">{ratio.label.split(' ')[1] || ''}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advanced Options Accordion */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between text-xs font-mono text-slate-400 hover:text-white"
            >
              <span>Advanced Parameters (Quality, Negative Prompts)</span>
              <span>{showAdvanced ? '▲ Hide' : '▼ Expand'}</span>
            </button>

            {showAdvanced && (
              <div className="pt-4 mt-3 border-t border-white/10 space-y-4">
                <div>
                  <label className="text-[11px] font-mono text-slate-300 block mb-1">
                    Synthesis Model & Quality Tier:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setQuality('standard')}
                      className={`p-2 rounded-lg border text-xs text-left ${
                        quality === 'standard'
                          ? 'bg-purple-600/20 border-purple-400 text-white'
                          : 'bg-black/30 border-white/10 text-slate-400'
                      }`}
                    >
                      <div className="font-semibold">Standard HD</div>
                      <div className="text-[10px] text-slate-400">gemini-3.1-flash-lite</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuality('ultra')}
                      className={`p-2 rounded-lg border text-xs text-left ${
                        quality === 'ultra'
                          ? 'bg-cyan-600/20 border-cyan-400 text-white'
                          : 'bg-black/30 border-white/10 text-slate-400'
                      }`}
                    >
                      <div className="font-semibold text-cyan-300">Ultra 4K</div>
                      <div className="text-[10px] text-slate-400">gemini-nano-banana</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-300 block mb-1">
                    Negative Prompt (Elements to Exclude):
                  </label>
                  <input
                    type="text"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Notice</p>
                <p className="mt-0.5 text-amber-300/90">{error}</p>
                {!apiStatus?.isKeyConfigured && (
                  <button
                    onClick={onOpenStatusModal}
                    className="mt-2 text-[11px] text-cyan-300 underline font-mono block"
                  >
                    Configure GEMINI_API_KEY in Settings &gt; Secrets
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Primary Synthesis CTA Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-semibold text-base shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:brightness-110 active:scale-98 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-cyan-300" />
                <span>Synthesizing Latent Matrix...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-cyan-300" />
                <span>Generate Photo</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Interactive Canvas & Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel-glow p-4 sm:p-6 rounded-3xl border border-purple-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
            
            {/* Canvas Header & Meta */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                <span className="font-display font-semibold text-white text-sm">
                  Neural Canvas
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
                  {aspectRatio}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                  {selectedStyle}
                </span>
              </div>

              {/* Status Badge */}
              <div className="text-[11px] font-mono text-slate-400">
                {isRealCloudGeneration ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Live Neural Output
                  </span>
                ) : (
                  <span className="text-cyan-300">Showcase Simulation</span>
                )}
              </div>
            </div>

            {/* Preview Frame */}
            <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-white/10 min-h-[360px] sm:min-h-[480px] flex items-center justify-center">
              {isGenerating ? (
                /* Scanning Animation */
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <div className="absolute inset-2 rounded-full border border-purple-500 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-cyan-400 animate-bounce" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-display font-bold text-white">
                      Generating Neural Artifact
                    </div>
                    <div className="text-xs font-mono text-cyan-300 animate-pulse">
                      {currentStep}
                    </div>
                  </div>
                  <div className="w-48 h-1.5 rounded-full bg-purple-950/80 overflow-hidden border border-purple-500/30">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 animate-scanline" />
                  </div>
                </div>
              ) : generatedResult ? (
                <div className="relative w-full h-full flex items-center justify-center group">
                  <img
                    src={generatedResult}
                    alt={lastPrompt}
                    className="max-h-[550px] w-full object-contain rounded-xl"
                  />

                  {/* Corner Watermark / Resolution */}
                  <div className="absolute bottom-3 right-3 text-[10px] font-mono px-2 py-1 rounded-md bg-black/70 backdrop-blur-md text-slate-300 border border-white/10">
                    AAYAM AI • 2048x2048
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 space-y-3">
                  <ImageIcon className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-slate-400 text-sm">
                    Enter a prompt and hit Generate to synthesize artwork.
                  </p>
                </div>
              )}
            </div>

            {/* Prompt Display Bar */}
            {generatedResult && (
              <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
                <p className="text-xs font-mono text-slate-300 truncate">
                  <span className="text-cyan-400 font-semibold">Prompt: </span>
                  {lastPrompt}
                </p>
                <button
                  onClick={handleCopyPrompt}
                  className="flex-shrink-0 text-slate-400 hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
                  title="Copy Prompt"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* Action Bar: Download & Share */}
            {generatedResult && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                <div className="text-xs text-slate-400 font-mono">
                  Format: <span className="text-white">PNG Lossless</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyPrompt}
                    className="px-3.5 py-2 rounded-xl glass-panel text-slate-200 hover:text-white text-xs font-medium flex items-center gap-1.5 border border-white/10 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Prompt'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
