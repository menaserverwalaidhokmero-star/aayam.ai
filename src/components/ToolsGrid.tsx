import React from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Wand2, 
  Video, 
  Film, 
  ArrowRight, 
  Sliders, 
  Layers, 
  Download, 
  Upload, 
  Camera, 
  Play
} from 'lucide-react';
import { ToolId } from '../types';

interface ToolsGridProps {
  onSelectTool: (tool: ToolId) => void;
}

export const ToolsGrid: React.FC<ToolsGridProps> = ({ onSelectTool }) => {
  const tools = [
    {
      id: 'photo-generator' as ToolId,
      name: 'AI Photo Generator',
      tagline: 'Text to High-Definition Imagery',
      description: 'Transform vivid text prompts into breathtaking photorealistic or stylized artwork in seconds. Choose from curated cyber aesthetics, aspect ratios, and resolution tiers.',
      icon: <ImageIcon className="w-6 h-6 text-purple-400" />,
      accentColor: 'from-purple-600/30 to-indigo-600/10',
      borderColor: 'group-hover:border-purple-500/60',
      badge: 'Core Engine',
      badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
      previewImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      features: [
        'Multi-style presets (Cyberpunk, 8K, Anime, Synthwave)',
        'Custom aspect ratios (1:1, 16:9, 9:16, 4:3, 3:4)',
        'Standard & Ultra 4K resolution synthesis',
        'Direct PNG export & prompt cloning',
      ],
      samplePrompt: 'A glowing cybernetic panther with luminescent cyan conduits stalking neon rain...',
    },
    {
      id: 'photo-editor' as ToolId,
      name: 'AI Photo Editor',
      tagline: 'Prompt-Guided Neural Photo Modification',
      description: 'Upload your photos and command alterations using natural language. Add holographic effects, change lighting, replace backdrops, or morph subjects seamlessly.',
      icon: <Wand2 className="w-6 h-6 text-cyan-400" />,
      accentColor: 'from-cyan-600/30 to-blue-600/10',
      borderColor: 'group-hover:border-cyan-500/60',
      badge: 'Interactive',
      badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
      previewImage: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
      features: [
        'Device photo upload & curated template selector',
        'Natural language localized prompt editing',
        'Interactive Before / After split-view slider',
        'High-fidelity edge blending & color harmony',
      ],
      samplePrompt: 'Add glowing purple cyberpunk visor and rainy Neo-Tokyo reflections...',
    },
    {
      id: 'video-generator' as ToolId,
      name: 'AI Video Generator',
      tagline: 'Prompt to Cinematic Motion Video',
      description: 'Generate stunning 60fps cinematic video clips straight from text descriptions. Harness next-generation camera movement, duration controls, and dynamic lighting.',
      icon: <Video className="w-6 h-6 text-indigo-400" />,
      accentColor: 'from-indigo-600/30 to-purple-600/10',
      borderColor: 'group-hover:border-indigo-500/60',
      badge: 'Veo Engine',
      badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40',
      previewImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      features: [
        'Text-to-video generation pipeline (Omni Flash)',
        'Camera dynamics (Orbit, Dolly In, Panoramic Pan)',
        'Widescreen (16:9) & Portrait (9:16) format',
        'Integrated video player with MP4 download',
      ],
      samplePrompt: 'Cinematic drone flyover neon futuristic skyline with holographic banners...',
    },
    {
      id: 'image-to-video' as ToolId,
      name: 'Image to Video',
      tagline: 'Bring Still Photographs to Life',
      description: 'Upload any still picture and provide a motion prompt to animate it into a fluid, expressive video. Perfect for animated portraits, living landscapes, and fluid art.',
      icon: <Film className="w-6 h-6 text-pink-400" />,
      accentColor: 'from-pink-600/30 to-purple-600/10',
      borderColor: 'group-hover:border-pink-500/60',
      badge: 'Motion Synthesis',
      badgeColor: 'bg-pink-950/80 text-pink-300 border-pink-500/40',
      previewImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
      features: [
        'Single image keyframe motion conditioning',
        'Fine-grained motion intensity & camera orbit',
        'Temporal consistency preserving original character',
        'Instant video playback and web loop export',
      ],
      samplePrompt: 'Camera gently glides forward while neon rain ripples across the glass...',
    },
  ];

  return (
    <section id="tools-section" className="py-16 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-mono text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>NEURAL CREATIVE SUITE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Four Powerful AI Engines. <br />
            <span className="gradient-text-neon">Endless Possibilities.</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Purpose-built creative workflows powered by state-of-the-art vision and video diffusion models.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className={`group relative rounded-3xl p-6 sm:p-8 glass-panel border border-white/10 ${tool.borderColor} transition-all duration-300 hover:shadow-[0_10px_40px_rgba(168,85,247,0.2)] flex flex-col justify-between overflow-hidden`}
            >
              {/* Subtle Gradient Backing */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${tool.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              />

              <div className="relative z-10 space-y-6">
                {/* Card Top: Icon & Badge */}
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors shadow-inner">
                    {tool.icon}
                  </div>
                  <span
                    className={`text-xs font-mono px-3 py-1 rounded-full border ${tool.badgeColor}`}
                  >
                    {tool.badge}
                  </span>
                </div>

                {/* Card Headline */}
                <div>
                  <h3 className="text-2xl font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {tool.name}
                  </h3>
                  <div className="text-xs font-mono text-purple-400 mt-1">
                    {tool.tagline}
                  </div>
                  <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {/* Preview Thumbnail Container */}
                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-white/10 bg-black/40 group-hover:border-purple-500/40 transition-all">
                  <img
                    src={tool.previewImage}
                    alt={tool.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Overlay Prompt Pill */}
                  <div className="absolute bottom-3 left-3 right-3 text-[11px] font-mono text-slate-300 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10 truncate">
                    <span className="text-cyan-400">Prompt: </span>
                    {tool.samplePrompt}
                  </div>
                </div>

                {/* Feature Bullet List */}
                <ul className="space-y-2 pt-2">
                  {tool.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="relative z-10 pt-6 mt-4 border-t border-white/10">
                <button
                  onClick={() => onSelectTool(tool.id)}
                  className="w-full py-3.5 px-5 rounded-xl bg-purple-600/30 hover:bg-gradient-to-r hover:from-purple-600 hover:to-cyan-500 text-white font-medium text-sm flex items-center justify-center gap-2 border border-purple-500/40 hover:border-transparent transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                  <span>Launch {tool.name}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
