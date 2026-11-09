import React, { useState, useRef } from 'react';
import { 
  Film, 
  Upload, 
  Sparkles, 
  Download, 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  AlertCircle, 
  RefreshCw, 
  Cpu, 
  Gauge,
  Image as ImageIcon
} from 'lucide-react';
import { GenerationItem, ApiStatus } from '../types';
import { SAMPLE_SOURCE_IMAGES, PROMPT_SUGGESTIONS } from '../data/presets';
import { ImageUploader, ImageFileMeta } from './ImageUploader';

interface ImageToVideoProps {
  apiStatus: ApiStatus | null;
  onSaveGeneration: (item: GenerationItem) => void;
  onOpenStatusModal: () => void;
}

export const ImageToVideo: React.FC<ImageToVideoProps> = ({
  apiStatus,
  onSaveGeneration,
  onOpenStatusModal,
}) => {
  // Source keyframe preview URL (object URL or sample image URL)
  const [sourceImage, setSourceImage] = useState<string | null>(
    SAMPLE_SOURCE_IMAGES[1].url
  );
  // Source image base64 data for API payload
  const [sourceBase64, setSourceBase64] = useState<string | null>(
    SAMPLE_SOURCE_IMAGES[1].url
  );
  // File metadata for UI display
  const [fileMeta, setFileMeta] = useState<ImageFileMeta | null>({
    name: SAMPLE_SOURCE_IMAGES[1].name,
    size: 0,
    formattedSize: 'Sample Preset',
    type: 'image/jpeg',
    isSample: true,
  });

  // Motion prompt
  const [motionPrompt, setMotionPrompt] = useState(
    'Camera pushes forward smoothly while glowing neon rain gently falls and streetlights cast pulsing purple reflections'
  );

  // Video settings
  const [motionIntensity, setMotionIntensity] = useState<'gentle' | 'dynamic' | 'cinematic'>('cinematic');
  const [duration, setDuration] = useState<'5s' | '10s'>('5s');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');

  // Video state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [currentVideoUrl, setCurrentVideoUrl] = useState(
    'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-code-31911-large.mp4'
  );
  const [lastMotionPrompt, setLastMotionPrompt] = useState(
    'Camera pushes forward smoothly while glowing neon rain gently falls and streetlights cast pulsing purple reflections'
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRealCloudVideo, setIsRealCloudVideo] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle image selected via ImageUploader (Android file picker, Photos, Gallery, Drag-and-Drop)
  const handleImageSelected = (previewUrl: string, base64Data: string, meta: ImageFileMeta) => {
    setSourceImage(previewUrl);
    setSourceBase64(base64Data);
    setFileMeta(meta);
    setError(null);
  };

  // Handle image removed via ImageUploader
  const handleImageRemoved = () => {
    setSourceImage(null);
    setSourceBase64(null);
    setFileMeta(null);
  };

  // Select sample template
  const handleSelectSample = (sample: typeof SAMPLE_SOURCE_IMAGES[0]) => {
    setSourceImage(sample.url);
    setSourceBase64(sample.url);
    setFileMeta({
      name: sample.name,
      size: 0,
      formattedSize: 'Sample Preset',
      type: 'image/jpeg',
      isSample: true,
    });
    setError(null);
  };

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
    if (!sourceImage || !sourceBase64) {
      setError('Please upload a starting frame image from your device or select a sample photo first.');
      return;
    }
    if (!motionPrompt.trim()) {
      setError('Please provide a motion description prompt.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setGenerationStep('Extracting keyframe optical flow vectors...');

    const timer1 = setTimeout(() => {
      setGenerationStep('Propagating motion dynamics across temporal frames...');
    }, 2000);

    const timer2 = setTimeout(() => {
      setGenerationStep('Rendering cinematic motion blur & fluid lighting...');
    }, 4500);

    try {
      const res = await fetch('/api/image-to-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: sourceBase64,
          mimeType: fileMeta?.type || 'image/png',
          motionPrompt: `${motionPrompt.trim()}, ${motionIntensity} motion dynamics`,
          duration,
          aspectRatio,
        }),
      });

      const data = await res.json();

      if (res.ok && data.videoUrl) {
        setCurrentVideoUrl(data.videoUrl);
        setLastMotionPrompt(motionPrompt);
        setIsRealCloudVideo(true);

        const newItem: GenerationItem = {
          id: `img2vid-${Date.now()}`,
          tool: 'image-to-video',
          title: motionPrompt.slice(0, 32) + (motionPrompt.length > 32 ? '...' : ''),
          prompt: motionPrompt.trim(),
          sourceImageUrl: sourceImage,
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
          
          const fallbackLoops = [
            'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-code-31911-large.mp4',
            'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-animation-41484-large.mp4',
            'https://assets.mixkit.co/videos/preview/mixkit-futuristic-tunnel-with-neon-lights-42987-large.mp4',
          ];
          const chosen = fallbackLoops[Math.floor(Math.random() * fallbackLoops.length)];
          setCurrentVideoUrl(chosen);
          setLastMotionPrompt(motionPrompt);
          setIsRealCloudVideo(false);

          const newItem: GenerationItem = {
            id: `img2vid-demo-${Date.now()}`,
            tool: 'image-to-video',
            title: motionPrompt.slice(0, 32) + ' (Demo)',
            prompt: motionPrompt.trim(),
            sourceImageUrl: sourceImage,
            outputUrl: chosen,
            aspectRatio,
            duration,
            createdAt: 'Just now',
            isRealCloud: false,
          };
          onSaveGeneration(newItem);
        } else {
          throw new Error(data.message || 'Image-to-video synthesis failed.');
        }
      }
    } catch (err: any) {
      console.error('Image-to-video error:', err);
      setError(err?.message || 'Failed to synthesize motion from image. Please try again.');
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
    a.download = `AAYAM-Animated-${Date.now()}.mp4`;
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
            <span className="p-2 rounded-xl bg-pink-600/20 border border-pink-500/40 text-pink-300">
              <Film className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Image to Video
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/40">
              Motion Synthesis
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Animate any still photograph into a seamless 60fps cinematic video loop with AI motion steering.
          </p>
        </div>

        {/* Engine Transparency Indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenStatusModal}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              apiStatus?.isKeyConfigured
                ? 'bg-pink-950/60 border-pink-500/40 text-pink-300 hover:border-pink-400'
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
        
        {/* Left Column: Keyframe Upload & Motion Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Upload Card */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
            {/* Native Mobile-Friendly Uploader with Android Gallery, Photos, Drag & Drop, Replace & Remove */}
            <ImageUploader
              id="img2vid-file-input"
              label="Starting Frame Image"
              currentImage={sourceImage}
              fileMeta={fileMeta}
              accentColor="pink"
              onImageSelected={handleImageSelected}
              onImageRemoved={handleImageRemoved}
              onError={(msg) => setError(msg)}
            />

            {/* Quick Sample Selector */}
            <div className="pt-2 border-t border-white/10">
              <span className="text-[11px] font-mono text-slate-400 block mb-2">
                Or select a starting keyframe:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {SAMPLE_SOURCE_IMAGES.map((sample) => {
                  const isSelected = sourceImage === sample.url;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className={`relative rounded-xl overflow-hidden aspect-square border transition-all ${
                        isSelected
                          ? 'border-pink-400 ring-2 ring-pink-400/40 scale-105'
                          : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
                      }`}
                    >
                      <img src={sample.url} alt={sample.name} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Motion Description Prompt */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Motion Description</span>
            </label>

            <textarea
              value={motionPrompt}
              onChange={(e) => setMotionPrompt(e.target.value)}
              placeholder="Describe how camera or elements should move (e.g. volumetric neon smoke drifting, camera orbiting slowly)..."
              rows={3}
              className="w-full bg-black/50 border border-white/10 rounded-2xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-pink-400 transition-all resize-none"
            />

            {/* Suggestions */}
            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-1.5">
                Motion Ideas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PROMPT_SUGGESTIONS.img2vid.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMotionPrompt(sug)}
                    className="text-[10px] bg-pink-950/40 hover:bg-pink-900/60 border border-pink-500/30 text-pink-200 px-2.5 py-1 rounded-lg text-left truncate max-w-full transition-colors"
                  >
                    ✦ {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Motion Dynamics & Timing */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Gauge className="w-3.5 h-3.5 text-purple-400" />
              <span>Motion Dynamics & Length</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {(['gentle', 'cinematic', 'dynamic'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setMotionIntensity(mode)}
                  className={`py-2 px-1 rounded-xl border text-center capitalize text-xs font-medium transition-all ${
                    motionIntensity === mode
                      ? 'bg-pink-600/30 border-pink-400 text-pink-200 shadow-[0_0_12px_rgba(236,72,153,0.3)]'
                      : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <div className="flex-1">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">Duration</span>
                <div className="flex gap-1">
                  {(['5s', '10s'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`flex-1 py-1 rounded-lg text-xs font-mono border ${
                        duration === d
                          ? 'bg-purple-600/30 border-purple-400 text-cyan-300'
                          : 'bg-black/30 border-white/10 text-slate-400'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">Ratio</span>
                <div className="flex gap-1">
                  {(['16:9', '9:16'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setAspectRatio(r)}
                      className={`flex-1 py-1 rounded-lg text-xs font-mono border ${
                        aspectRatio === r
                          ? 'bg-purple-600/30 border-purple-400 text-cyan-300'
                          : 'bg-black/30 border-white/10 text-slate-400'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Notice</p>
                <p className="mt-0.5 text-amber-300/90 leading-relaxed">{error}</p>
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

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white font-semibold text-base shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:brightness-110 active:scale-98 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-pink-300" />
                <span>Interpolating Frame Vectors...</span>
              </>
            ) : (
              <>
                <Film className="w-5 h-5 text-pink-300" />
                <span>Animate into Video</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Video Monitor Viewport */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel-glow p-4 sm:p-6 rounded-3xl border border-pink-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
            
            {/* Viewport Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-400 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                <span className="font-display font-semibold text-white text-sm">
                  Motion Render Viewport
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950/60 text-pink-300 border border-pink-500/30">
                  {motionIntensity}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
                  {duration}
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-400">
                {isRealCloudVideo ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Temporal Synthesis Complete
                  </span>
                ) : (
                  <span className="text-cyan-300">Showcase Simulation</span>
                )}
              </div>
            </div>

            {/* Video Player Display */}
            <div className="relative rounded-2xl overflow-hidden bg-black/80 border border-white/10 min-h-[360px] sm:min-h-[440px] flex items-center justify-center">
              {isGenerating ? (
                /* Scanning Video Loader */
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-pink-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <div className="absolute inset-2 rounded-full border border-cyan-400 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Film className="w-8 h-8 text-pink-400 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-display font-bold text-white">
                      Synthesizing Keyframe Motion
                    </div>
                    <div className="text-xs font-mono text-pink-300 animate-pulse">
                      {generationStep}
                    </div>
                  </div>
                </div>
              ) : !sourceImage ? (
                /* Empty state when no keyframe is loaded */
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-pink-950/40 border border-pink-500/30 text-pink-300 flex items-center justify-center mx-auto mb-1">
                    <ImageIcon className="w-8 h-8 opacity-80" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">No Keyframe Loaded</h4>
                  <p className="text-slate-400 text-xs max-w-sm">
                    Upload a starting image from your Android gallery or pick a preset frame on the left to animate into video.
                  </p>
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

                  {/* Play/Pause overlay */}
                  <button
                    onClick={handleTogglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="p-4 rounded-full bg-black/70 border border-white/20 text-white shadow-xl hover:scale-110 transition-transform">
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </div>
                  </button>

                  <div className="absolute top-3 right-3 text-[10px] font-mono px-2 py-1 rounded bg-black/70 backdrop-blur-md text-pink-300 border border-white/10">
                    60 FPS Video Loop
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Meta Box */}
            <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="truncate">
                <span className="text-pink-400">Motion Description: </span>
                {lastMotionPrompt}
              </span>
              <span className="text-[10px] text-cyan-400 ml-2 flex-shrink-0">
                Veo Temporal Flow
              </span>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/10">
              <div className="text-xs text-slate-400 font-mono">
                Format: <span className="text-white">MP4 (Video Loop)</span>
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
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-cyan-500 text-white text-xs font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Video</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
