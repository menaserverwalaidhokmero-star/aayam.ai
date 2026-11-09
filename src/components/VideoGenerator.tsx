import React, { useState, useRef } from 'react';
import { 
  Video, 
  Sparkles, 
  Download, 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Clock, 
  Monitor, 
  AlertCircle, 
  RefreshCw,
  Cpu,
  Compass
} from 'lucide-react';
import { GenerationItem, ApiStatus } from '../types';
import { PROMPT_SUGGESTIONS } from '../data/presets';

interface VideoGeneratorProps {
  apiStatus: ApiStatus | null;
  onSaveGeneration: (item: GenerationItem) => void;
  initialPrompt?: string;
  onOpenStatusModal: () => void;
}

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({
  apiStatus,
  onSaveGeneration,
  initialPrompt = '',
  onOpenStatusModal,
}) => {
  const [prompt, setPrompt] = useState(
    initialPrompt || 'Cinematic camera pan through a neon cyberpunk metropolis with floating holographic koi fish and flying hovercrafts in foggy rain'
  );

  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [duration, setDuration] = useState<'5s' | '10s'>('5s');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [cameraMotion, setCameraMotion] = useState('Dolly In');

  // Video generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Current video source
  const [currentVideoUrl, setCurrentVideoUrl] = useState(
    'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-animation-41484-large.mp4'
  );
  const [lastPrompt, setLastPrompt] = useState(
    'Cinematic camera pan through a neon cyberpunk metropolis with floating holographic koi fish and flying hovercrafts in foggy rain'
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRealCloudVideo, setIsRealCloudVideo] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  const cameraOptions = [
    { id: 'Dolly In', label: 'Dolly In', desc: 'Forward smooth push' },
    { id: 'Orbit 360', label: 'Orbit 360°', desc: 'Curved rotation around subject' },
    { id: 'Panoramic Pan', label: 'Panoramic Pan', desc: 'Horizontal wide sweep' },
    { id: 'Crane Up', label: 'Crane Up', desc: 'Vertical rising cinematic perspective' },
  ];

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please provide a prompt for video synthesis.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setGenerationStep('Conditioning spatial-temporal latent space...');

    const timer1 = setTimeout(() => {
      setGenerationStep('Synthesizing 60fps motion keyframes...');
    }, 2000);

    const timer2 = setTimeout(() => {
      setGenerationStep('Applying volumetric neon lighting & physics simulation...');
    }, 4500);

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${prompt.trim()}, camera motion: ${cameraMotion}, ultra cinematic 60fps`,
          aspectRatio,
          duration,
          resolution,
        }),
      });

      const data = await res.json();

      if (res.ok && data.videoUrl) {
        setCurrentVideoUrl(data.videoUrl);
        setLastPrompt(prompt);
        setIsRealCloudVideo(true);

        const newItem: GenerationItem = {
          id: `video-${Date.now()}`,
          tool: 'video-generator',
          title: prompt.slice(0, 32) + (prompt.length > 32 ? '...' : ''),
          prompt: prompt.trim(),
          outputUrl: data.videoUrl,
          aspectRatio,
          duration,
          createdAt: 'Just now',
          isRealCloud: true,
        };
        onSaveGeneration(newItem);
      } else {
        if (data.error === 'API_KEY_NOT_CONFIGURED') {
          setError('GEMINI_API_KEY is not connected in Settings > Secrets. Displaying showcase simulation video.');
          
          // Showcase high-grade cyber/neon animation loops
          const fallbackVideos = [
            'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-animation-41484-large.mp4',
            'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-code-31911-large.mp4',
            'https://assets.mixkit.co/videos/preview/mixkit-futuristic-tunnel-with-neon-lights-42987-large.mp4',
          ];
          const chosen = fallbackVideos[Math.floor(Math.random() * fallbackVideos.length)];
          setCurrentVideoUrl(chosen);
          setLastPrompt(prompt);
          setIsRealCloudVideo(false);

          const newItem: GenerationItem = {
            id: `video-demo-${Date.now()}`,
            tool: 'video-generator',
            title: prompt.slice(0, 32) + ' (Demo)',
            prompt: prompt.trim(),
            outputUrl: chosen,
            aspectRatio,
            duration,
            createdAt: 'Just now',
            isRealCloud: false,
          };
          onSaveGeneration(newItem);
        } else {
          throw new Error(data.message || 'Video synthesis failed.');
        }
      }
    } catch (err: any) {
      console.error('Video generation error:', err);
      setError(err?.message || 'Video generation failed. Please try again.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleDownload = () => {
    if (!currentVideoUrl) return;
    const a = document.createElement('a');
    a.href = currentVideoUrl;
    a.download = `AAYAM-Video-${Date.now()}.mp4`;
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
            <span className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300">
              <Video className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
              AI Video Generator
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
              Veo / Omni-1.2
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Produce cinematic video sequences directly from text prompts with professional camera dynamics and lighting.
          </p>
        </div>

        {/* Engine Transparency Indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenStatusModal}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              apiStatus?.isKeyConfigured
                ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300 hover:border-indigo-400'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:border-amber-400'
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>
              {apiStatus?.isKeyConfigured ? 'Model: gemini-omni-1.2-flash' : 'Showcase Mode (No Key)'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Prompt & Video Settings */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Prompt Card */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Text-to-Video Prompt</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {prompt.length}/600 chars
              </span>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe motion, camera movement, environment, atmosphere, and action..."
              rows={4}
              className="w-full bg-black/50 border border-white/10 rounded-2xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 transition-all resize-none"
            />

            {/* Prompt Suggestions */}
            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-1.5">
                Cinematic Inspirations:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PROMPT_SUGGESTIONS.video.slice(0, 3).map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(sug)}
                    className="text-[10px] bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-200 px-2.5 py-1 rounded-lg text-left truncate max-w-full transition-colors"
                  >
                    ✦ {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Camera Motion Selector */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Camera Dynamics</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              {cameraOptions.map((cam) => {
                const isSelected = cameraMotion === cam.id;
                return (
                  <button
                    key={cam.id}
                    type="button"
                    onClick={() => setCameraMotion(cam.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-600/30 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-semibold">{cam.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{cam.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Video Settings: Aspect Ratio, Duration, Resolution */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>Output Specifications</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {/* Aspect Ratio */}
              <div>
                <span className="text-[10px] font-mono text-slate-400 block mb-1">Ratio</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('16:9')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono border ${
                      aspectRatio === '16:9'
                        ? 'bg-purple-600/30 border-purple-400 text-cyan-300'
                        : 'bg-black/30 border-white/10 text-slate-400'
                    }`}
                  >
                    16:9
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono border ${
                      aspectRatio === '9:16'
                        ? 'bg-purple-600/30 border-purple-400 text-cyan-300'
                        : 'bg-black/30 border-white/10 text-slate-400'
                    }`}
                  >
                    9:16
                  </button>
                </div>
              </div>

              {/* Duration */}
              <div>
                <span className="text-[10px] font-mono text-slate-400 block mb-1">Duration</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setDuration('5s')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono border ${
                      duration === '5s'
                        ? 'bg-purple-600/30 border-purple-400 text-cyan-300'
                        : 'bg-black/30 border-white/10 text-slate-400'
                    }`}
                  >
                    5s
                  </button>
                  <button
                    type="button"
                    onClick={() => setDuration('10s')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono border ${
                      duration === '10s'
                        ? 'bg-purple-600/30 border-purple-400 text-cyan-300'
                        : 'bg-black/30 border-white/10 text-slate-400'
                    }`}
                  >
                    10s
                  </button>
                </div>
              </div>

              {/* Resolution */}
              <div>
                <span className="text-[10px] font-mono text-slate-400 block mb-1">Resolution</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setResolution('720p')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono border ${
                      resolution === '720p'
                        ? 'bg-purple-600/30 border-purple-400 text-cyan-300'
                        : 'bg-black/30 border-white/10 text-slate-400'
                    }`}
                  >
                    720p
                  </button>
                  <button
                    type="button"
                    onClick={() => setResolution('1080p')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono border ${
                      resolution === '1080p'
                        ? 'bg-purple-600/30 border-purple-400 text-cyan-300'
                        : 'bg-black/30 border-white/10 text-slate-400'
                    }`}
                  >
                    1080p
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error Notice */}
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

          {/* Primary Video Synthesis Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-semibold text-base shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:brightness-110 active:scale-98 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-cyan-300" />
                <span>Generating Spatial Frames...</span>
              </>
            ) : (
              <>
                <Video className="w-5 h-5 text-cyan-300" />
                <span>Generate AI Video</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Video Player Viewport */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel-glow p-4 sm:p-6 rounded-3xl border border-indigo-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
            
            {/* Viewport Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                <span className="font-display font-semibold text-white text-sm">
                  Video Preview Monitor
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/30">
                  {aspectRatio}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                  {resolution} • {duration}
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-400">
                {isRealCloudVideo ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Veo Engine Ready
                  </span>
                ) : (
                  <span className="text-cyan-300">Showcase Simulation</span>
                )}
              </div>
            </div>

            {/* Video Player Box */}
            <div className="relative rounded-2xl overflow-hidden bg-black/80 border border-white/10 min-h-[360px] sm:min-h-[440px] flex items-center justify-center">
              {isGenerating ? (
                /* Scanning Video Loader */
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <div className="absolute inset-2 rounded-full border border-cyan-400 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="w-8 h-8 text-indigo-400 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-display font-bold text-white">
                      Synthesizing 60fps Video
                    </div>
                    <div className="text-xs font-mono text-cyan-300 animate-pulse">
                      {generationStep}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center group">
                  <video
                    ref={videoRef}
                    src={currentVideoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={`w-full max-h-[500px] object-contain rounded-xl ${
                      aspectRatio === '9:16' ? 'max-w-[320px]' : ''
                    }`}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />

                  {/* Play / Pause Overlay Button on hover */}
                  <button
                    onClick={handleTogglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="p-4 rounded-full bg-black/70 border border-white/20 text-white shadow-xl hover:scale-110 transition-transform">
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </div>
                  </button>

                  {/* Top-Right Resolution & Duration Pill */}
                  <div className="absolute top-3 right-3 text-[10px] font-mono px-2 py-1 rounded bg-black/70 backdrop-blur-md text-cyan-300 border border-white/10">
                    60 FPS • {resolution}
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Meta Box */}
            <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="truncate">
                <span className="text-indigo-400">Video Prompt: </span>
                {lastPrompt}
              </span>
              <span className="text-[10px] text-cyan-400 ml-2 flex-shrink-0">
                Camera: {cameraMotion}
              </span>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/10">
              <div className="text-xs text-slate-400 font-mono">
                Format: <span className="text-white">MP4 (H.264 / AAC)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTogglePlay}
                  className="px-3.5 py-2 rounded-xl glass-panel text-slate-200 hover:text-white text-xs font-medium flex items-center gap-1.5 border border-white/10 transition-colors"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-xs font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download MP4</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
