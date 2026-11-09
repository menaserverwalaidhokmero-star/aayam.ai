import React, { useState } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Wand2, 
  Video, 
  Film, 
  LayoutDashboard, 
  Menu, 
  X, 
  Cpu, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ToolId, ApiStatus } from '../types';

interface NavbarProps {
  currentTab: ToolId;
  onSelectTab: (tab: ToolId) => void;
  apiStatus: ApiStatus | null;
  onOpenStatusModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  apiStatus,
  onOpenStatusModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ToolId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'photo-generator', label: 'Photo Generator', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'photo-editor', label: 'Photo Editor', icon: <Wand2 className="w-4 h-4" /> },
    { id: 'video-generator', label: 'AI Video', icon: <Video className="w-4 h-4" />, badge: 'Veo' },
    { id: 'image-to-video', label: 'Image to Video', icon: <Film className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Library', icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  const handleNavClick = (id: ToolId) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-purple-500/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 group text-left transition-transform active:scale-95"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all">
            <div className="w-full h-full bg-[#070514] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl sm:text-2xl tracking-wider text-white">
                AAYAM<span className="text-cyan-400">AI</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300">
                PRO
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 tracking-wide hidden sm:block">
              Create Beyond Imagination
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs xl:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600/20 text-cyan-300 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action & Status Area */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Engine Status Pill */}
          <button
            onClick={onOpenStatusModal}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] sm:text-xs font-mono transition-all border ${
              apiStatus?.isKeyConfigured
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'bg-indigo-950/40 text-cyan-300 border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
            }`}
            title="Click to view Gemini neural engine status"
          >
            <span className={`w-2 h-2 rounded-full animate-pulse ${
              apiStatus?.isKeyConfigured ? 'bg-emerald-400' : 'bg-cyan-400'
            }`} />
            <Cpu className="w-3.5 h-3.5 opacity-80" />
            <span className="hidden md:inline">
              {apiStatus?.isKeyConfigured ? 'Gemini Live' : 'Engine Ready'}
            </span>
          </button>

          {/* Quick Create CTA */}
          <button
            onClick={() => handleNavClick('photo-generator')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-medium text-xs sm:text-sm hover:brightness-110 shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Creating</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-slate-200 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-purple-500/20 px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="text-xs font-mono uppercase text-slate-400 px-2 py-1">
            Creation Tools
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                currentTab === item.id
                  ? 'bg-purple-600/30 text-cyan-300 border border-purple-500/50'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          ))}

          <div className="pt-2 border-t border-purple-500/20">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenStatusModal();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 font-mono"
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Neural Engine Diagnostics</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
