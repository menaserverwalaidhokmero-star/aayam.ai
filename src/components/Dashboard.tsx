import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Wand2, 
  Video, 
  Film, 
  Star, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  Play, 
  Sparkles, 
  ArrowUpRight, 
  Filter, 
  X,
  Cpu
} from 'lucide-react';
import { GenerationItem, ToolId } from '../types';

interface DashboardProps {
  items: GenerationItem[];
  onSelectItemToRemix: (item: GenerationItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onNavigateToTool: (tool: ToolId) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  items,
  onSelectItemToRemix,
  onDeleteItem,
  onToggleFavorite,
  onNavigateToTool,
}) => {
  const [filter, setFilter] = useState<'all' | 'photo' | 'edit' | 'video' | 'img2vid' | 'favorites'>('all');
  const [selectedItem, setSelectedItem] = useState<GenerationItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter items
  const filteredItems = items.filter((item) => {
    if (filter === 'favorites') return item.isFavorite;
    if (filter === 'photo') return item.tool === 'photo-generator';
    if (filter === 'edit') return item.tool === 'photo-editor';
    if (filter === 'video') return item.tool === 'video-generator';
    if (filter === 'img2vid') return item.tool === 'image-to-video';
    return true;
  });

  const handleCopyPrompt = (prompt: string, id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (item: GenerationItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const a = document.createElement('a');
    a.href = item.outputUrl;
    const isVid = item.tool.includes('video');
    a.download = `AAYAM-${item.tool}-${item.id}.${isVid ? 'mp4' : 'png'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const photoCount = items.filter((i) => i.tool === 'photo-generator').length;
  const editCount = items.filter((i) => i.tool === 'photo-editor').length;
  const videoCount = items.filter((i) => i.tool === 'video-generator' || i.tool === 'image-to-video').length;
  const favCount = items.filter((i) => i.isFavorite).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-purple-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300">
              <LayoutDashboard className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Creative Library & Dashboard
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage your synthesized neural artifacts, inspect prompts, download high-res renders, and remix creations.
          </p>
        </div>

        {/* Quick Launch Studio Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToTool('photo-generator')}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Generation</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Artifacts</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-white">
            {items.length}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {photoCount} Photos • {videoCount} Videos
          </div>
        </div>

        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Photo Edits</span>
            <Wand2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-cyan-300">
            {editCount}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Before / After Preserved
          </div>
        </div>

        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Starred Favorites</span>
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-amber-300">
            {favCount}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Bookmarked Presets
          </div>
        </div>

        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Neural Engine</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-emerald-300">
            Active
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Multi-Modal Ready
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/10">
          {[
            { id: 'all', label: 'All Artifacts' },
            { id: 'photo', label: 'Photos' },
            { id: 'edit', label: 'Edits' },
            { id: 'video', label: 'Videos' },
            { id: 'img2vid', label: 'Image to Video' },
            { id: 'favorites', label: 'Starred' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === tab.id
                  ? 'bg-purple-600/30 text-cyan-300 border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing {filteredItems.length} items
        </div>
      </div>

      {/* Artifacts Grid */}
      {filteredItems.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center justify-center mx-auto">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-display font-bold text-white">
            No Artifacts Found
          </h3>
          <p className="text-xs text-slate-400">
            No creations match the selected filter category. Launch one of our creation tools to start generating.
          </p>
          <button
            onClick={() => onNavigateToTool('photo-generator')}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          >
            Launch Photo Studio
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isVideo = item.tool === 'video-generator' || item.tool === 'image-to-video';
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(168,85,247,0.2)] cursor-pointer flex flex-col justify-between"
              >
                {/* Media Container */}
                <div className="relative aspect-[16/10] bg-black/60 overflow-hidden">
                  {isVideo ? (
                    <video
                      src={item.outputUrl}
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                      onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
                    />
                  ) : (
                    <img
                      src={item.outputUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-cyan-300 border border-white/10">
                      {item.tool.replace('-', ' ')}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${
                        item.isFavorite
                          ? 'bg-amber-500/30 text-amber-300 border border-amber-400/40'
                          : 'bg-black/60 text-slate-400 hover:text-white border border-white/10'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  {isVideo && (
                    <div className="absolute bottom-2.5 right-2.5 p-1.5 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20">
                      <Play className="w-3.5 h-3.5 ml-0.5" />
                    </div>
                  )}
                </div>

                {/* Info Card Content */}
                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 font-mono">
                    {item.prompt}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-slate-400 font-mono">
                    <span>{item.createdAt}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleCopyPrompt(item.prompt, item.id, e)}
                        className="p-1 hover:text-white rounded hover:bg-white/5 transition-colors"
                        title="Copy Prompt"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={(e) => handleDownload(item, e)}
                        className="p-1 hover:text-white rounded hover:bg-white/5 transition-colors"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteItem(item.id);
                        }}
                        className="p-1 hover:text-red-400 rounded hover:bg-white/5 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox / Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-3xl w-full glass-panel-glow rounded-3xl p-6 border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.3)] space-y-4 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40">
                  {selectedItem.tool.toUpperCase()}
                </span>
                <h3 className="font-display font-bold text-white text-base">
                  {selectedItem.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Media Display */}
            <div className="relative rounded-2xl overflow-hidden bg-black/70 border border-white/10 flex items-center justify-center min-h-[300px]">
              {selectedItem.tool.includes('video') ? (
                <video
                  src={selectedItem.outputUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="max-h-[460px] w-full object-contain rounded-xl"
                />
              ) : (
                <img
                  src={selectedItem.outputUrl}
                  alt={selectedItem.title}
                  className="max-h-[460px] w-full object-contain rounded-xl"
                />
              )}
            </div>

            {/* Prompt & Details */}
            <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2">
              <div className="text-xs font-mono uppercase text-cyan-400">
                Full Synthesis Prompt:
              </div>
              <p className="text-sm text-slate-200 font-mono">
                {selectedItem.prompt}
              </p>
              <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono text-slate-400">
                <span>Aspect: {selectedItem.aspectRatio || '1:1'}</span>
                {selectedItem.style && <span>• Style: {selectedItem.style}</span>}
                {selectedItem.duration && <span>• Duration: {selectedItem.duration}</span>}
                <span>• Created: {selectedItem.createdAt}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  onSelectItemToRemix(selectedItem);
                  setSelectedItem(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Remix in Studio</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyPrompt(selectedItem.prompt, selectedItem.id)}
                  className="px-3.5 py-2 rounded-xl glass-panel text-slate-200 hover:text-white text-xs font-medium flex items-center gap-1.5 border border-white/10"
                >
                  {copiedId === selectedItem.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === selectedItem.id ? 'Copied' : 'Copy Prompt'}</span>
                </button>

                <button
                  onClick={() => handleDownload(selectedItem)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
