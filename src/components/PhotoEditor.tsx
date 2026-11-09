import React, { useState, useRef } from 'react';
import { 
  Wand2, 
  Upload, 
  Download, 
  Sparkles, 
  RefreshCw, 
  Image as ImageIcon, 
  SlidersHorizontal, 
  Check, 
  AlertCircle, 
  Eye, 
  Layers,
  Cpu
} from 'lucide-react';
import { GenerationItem, ApiStatus } from '../types';
import { SAMPLE_SOURCE_IMAGES, PROMPT_SUGGESTIONS } from '../data/presets';
import { ImageUploader, ImageFileMeta } from './ImageUploader';

interface PhotoEditorProps {
  apiStatus: ApiStatus | null;
  onSaveGeneration: (item: GenerationItem) => void;
  onOpenStatusModal: () => void;
}

export const PhotoEditor: React.FC<PhotoEditorProps> = ({
  apiStatus,
  onSaveGeneration,
  onOpenStatusModal,
}) => {
  // Original source image preview URL (object URL or remote sample URL)
  const [sourceImage, setSourceImage] = useState<string | null>(
    SAMPLE_SOURCE_IMAGES[0].url
  );
  // Source image base64 data for API payload
  const [sourceBase64, setSourceBase64] = useState<string | null>(
    SAMPLE_SOURCE_IMAGES[0].url
  );
  // File metadata for UI display (filename, size, type)
  const [fileMeta, setFileMeta] = useState<ImageFileMeta | null>({
    name: SAMPLE_SOURCE_IMAGES[0].name,
    size: 0,
    formattedSize: 'Sample Preset',
    type: 'image/jpeg',
    isSample: true,
  });

  // Edited result image
  const [editedImage, setEditedImage] = useState<string>(
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80'
  );

  const [prompt, setPrompt] = useState(
    'Add an intricate glowing purple cybernetic eye and subtle holographic circuits on the cheek'
  );

  // Split-slider position (0 to 100%)
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState<'split' | 'sideBySide' | 'resultOnly'>('split');

  // Process states
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusStep, setStatusStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRealCloudEdit, setIsRealCloudEdit] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

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
    setPrompt(sample.prompt);
    setError(null);
  };

  // Perform AI edit
  const handleEdit = async () => {
    if (!sourceImage || !sourceBase64) {
      setError('Please upload an image from your device or select a sample photo first.');
      return;
    }
    if (!prompt.trim()) {
      setError('Please enter an instruction prompt describing what to edit.');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setStatusStep('Segmenting image semantic zones...');

    const timer1 = setTimeout(() => {
      setStatusStep('Injecting latent prompt modifications...');
    }, 1400);

    const timer2 = setTimeout(() => {
      setStatusStep('Harmonizing lighting, shadows, and textures...');
    }, 2800);

    try {
      const res = await fetch('/api/edit-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          imageBase64: sourceBase64,
          mimeType: fileMeta?.type || 'image/png',
        }),
      });

      const data = await res.json();

      if (res.ok && data.imageUrl) {
        setEditedImage(data.imageUrl);
        setIsRealCloudEdit(true);

        const newItem: GenerationItem = {
          id: `edit-${Date.now()}`,
          tool: 'photo-editor',
          title: prompt.slice(0, 32) + (prompt.length > 32 ? '...' : ''),
          prompt: prompt.trim(),
          sourceImageUrl: sourceImage,
          outputUrl: data.imageUrl,
          aspectRatio: '1:1',
          createdAt: 'Just now',
          isRealCloud: true,
        };
        onSaveGeneration(newItem);
      } else {
        if (data.error === 'API_KEY_NOT_CONFIGURED') {
          setError('GEMINI_API_KEY is not connected in Settings > Secrets. Displaying showcase simulation mode.');
          // Use high-end cyber artistic edit
          const fallbackEdits = [
            'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
          ];
          const chosen = fallbackEdits[Math.floor(Math.random() * fallbackEdits.length)];
          setEditedImage(chosen);
          setIsRealCloudEdit(false);

          const newItem: GenerationItem = {
            id: `edit-demo-${Date.now()}`,
            tool: 'photo-editor',
            title: prompt.slice(0, 32) + ' (Demo)',
            prompt: prompt.trim(),
            sourceImageUrl: sourceImage,
            outputUrl: chosen,
            aspectRatio: '1:1',
            createdAt: 'Just now',
            isRealCloud: false,
          };
          onSaveGeneration(newItem);
        } else {
          throw new Error(data.message || 'Edit operation failed.');
        }
      }
    } catch (err: any) {
      console.error('Photo editing failed:', err);
      setError(err?.message || 'Could not process image modification. Please try again.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsProcessing(false);
      setStatusStep('');
    }
  };

  const handleDownload = () => {
    if (!editedImage) return;
    const a = document.createElement('a');
    a.href = editedImage;
    a.download = `AAYAM-Edited-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Drag handle logic for split slider
  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPos(percent);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-purple-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-300">
              <Wand2 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
              AI Photo Editor
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Transform uploaded photographs with natural language instructions. Add futuristic props, alter backdrops, and adjust lighting.
          </p>
        </div>

        {/* Engine Transparency Indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenStatusModal}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              apiStatus?.isKeyConfigured
                ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 hover:border-cyan-400'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:border-amber-400'
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>
              {apiStatus?.isKeyConfigured ? 'Model: gemini-3.1-flash-lite' : 'Showcase Mode (No Key)'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Image Upload & Edit Prompt */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Upload Card */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
            {/* Native Mobile-Friendly Uploader with Android Gallery, Photos, Drag & Drop, Replace & Remove */}
            <ImageUploader
              id="photo-editor-file-input"
              label="Source Photograph"
              currentImage={sourceImage}
              fileMeta={fileMeta}
              accentColor="cyan"
              onImageSelected={handleImageSelected}
              onImageRemoved={handleImageRemoved}
              onError={(msg) => setError(msg)}
            />

            {/* Quick Sample Selector */}
            <div className="pt-2 border-t border-white/10">
              <span className="text-[11px] font-mono text-slate-400 block mb-2">
                Or try with a sample photo:
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
                          ? 'border-cyan-400 ring-2 ring-cyan-400/40 scale-105'
                          : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
                      }`}
                    >
                      <img
                        src={sample.url}
                        alt={sample.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Edit Instruction Card */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Edit Instructions (Natural Language)</span>
            </label>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Add glowing purple holographic cyberpunk visor and neon rain reflections..."
              rows={3}
              className="w-full bg-black/50 border border-white/10 rounded-2xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all resize-none"
            />

            {/* Edit Presets */}
            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-1.5">
                Suggested Transformations:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PROMPT_SUGGESTIONS.edit.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(sug)}
                    className="text-[10px] bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-200 px-2.5 py-1 rounded-lg text-left truncate max-w-full transition-colors"
                  >
                    ✦ {sug}
                  </button>
                ))}
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

          {/* Apply Edit Action Button */}
          <button
            onClick={handleEdit}
            disabled={isProcessing}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-semibold text-base shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] hover:brightness-110 active:scale-98 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-cyan-300" />
                <span>Applying Neural Transformation...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 text-cyan-300" />
                <span>Apply Transformation</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Comparison Canvas & Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel-cyan p-4 sm:p-6 rounded-3xl border border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
            
            {/* View Mode Toggle Header */}
            <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-white/10 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                <span className="font-display font-semibold text-white text-sm">
                  Comparison Viewport
                </span>
              </div>

              {/* View Mode Pills */}
              <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setViewMode('split')}
                  className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                    viewMode === 'split'
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Split Slider
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('sideBySide')}
                  className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                    viewMode === 'sideBySide'
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Side-by-Side
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('resultOnly')}
                  className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                    viewMode === 'resultOnly'
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Result Only
                </button>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-white/10 min-h-[380px] sm:min-h-[480px] flex items-center justify-center select-none">
              
              {isProcessing ? (
                /* Scanning loader */
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <div className="absolute inset-2 rounded-full border border-purple-500 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Wand2 className="w-8 h-8 text-cyan-400 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-display font-bold text-white">
                      Processing AI Image Transformation
                    </div>
                    <div className="text-xs font-mono text-cyan-300 animate-pulse">
                      {statusStep}
                    </div>
                  </div>
                </div>
              ) : !sourceImage ? (
                /* Empty state when no image is uploaded */
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 flex items-center justify-center mx-auto mb-1">
                    <ImageIcon className="w-8 h-8 opacity-80" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">No Photograph Loaded</h4>
                  <p className="text-slate-400 text-xs max-w-sm">
                    Upload a picture from your device or select one of the sample portraits on the left to begin editing.
                  </p>
                </div>
              ) : viewMode === 'split' ? (
                /* Interactive Before / After Split Slider */
                <div
                  ref={containerRef}
                  onMouseMove={(e) => e.buttons === 1 && handleSliderMove(e.clientX)}
                  onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
                  className="relative w-full h-[480px] cursor-ew-resize overflow-hidden"
                >
                  {/* Edited Result (Underneath) */}
                  <img
                    src={editedImage}
                    alt="Edited result"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 text-[10px] font-mono px-2 py-1 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
                    AFTER (AI EDITED)
                  </div>

                  {/* Original Image (Clipped by sliderPos) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPos}%` }}
                  >
                    <img
                      src={sourceImage}
                      alt="Original source"
                      className="absolute inset-0 w-full h-full object-cover max-w-none"
                      style={{ width: containerRef.current?.clientWidth || '100%' }}
                    />
                    <div className="absolute top-3 left-3 text-[10px] font-mono px-2 py-1 rounded bg-black/80 text-slate-300 border border-white/20 backdrop-blur-md">
                      BEFORE (ORIGINAL)
                    </div>
                  </div>

                  {/* Slider Divider Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)]"
                    style={{ left: `${sliderPos}%` }}
                  >
                    {/* Handle pill */}
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.8)] border-2 border-white">
                      <SlidersHorizontal className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </div>
              ) : viewMode === 'sideBySide' ? (
                /* Side-by-side mode */
                <div className="grid grid-cols-2 gap-2 p-2 w-full h-full">
                  <div className="relative rounded-xl overflow-hidden aspect-square border border-white/10">
                    <img src={sourceImage} alt="Original" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 text-[9px] font-mono px-2 py-0.5 rounded bg-black/80 text-slate-300">
                      BEFORE
                    </div>
                  </div>
                  <div className="relative rounded-xl overflow-hidden aspect-square border border-cyan-500/40">
                    <img src={editedImage} alt="Edited" className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-400/40">
                      AFTER
                    </div>
                  </div>
                </div>
              ) : (
                /* Result only */
                <div className="relative w-full h-full flex items-center justify-center p-2">
                  <img src={editedImage} alt="Edited result" className="max-h-[500px] w-full object-contain rounded-xl" />
                </div>
              )}

            </div>

            {/* Prompt Meta Box */}
            <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="truncate">
                <span className="text-purple-400">Transform Instruction: </span>
                {prompt}
              </span>
              <span className="text-[10px] text-slate-500 ml-2 flex-shrink-0">
                Lossless 32-bit
              </span>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/10">
              <div className="text-xs text-slate-400 font-mono">
                {isRealCloudEdit ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Gemini Neural Synthesis Complete
                  </span>
                ) : (
                  <span className="text-cyan-300">Showcase Simulation</span>
                )}
              </div>

              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Result</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
