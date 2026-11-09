import React from 'react';
import { Sparkles, Image as ImageIcon, Wand2, Video, Film, LayoutDashboard } from 'lucide-react';
import { ToolId } from '../types';

interface MobileDockProps {
  currentTab: ToolId;
  onSelectTab: (tab: ToolId) => void;
}

export const MobileDock: React.FC<MobileDockProps> = ({ currentTab, onSelectTab }) => {
  const dockItems: { id: ToolId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'photo-generator', label: 'Generate', icon: <ImageIcon className="w-5 h-5" /> },
    { id: 'photo-editor', label: 'Editor', icon: <Wand2 className="w-5 h-5" /> },
    { id: 'video-generator', label: 'Video', icon: <Video className="w-5 h-5" /> },
    { id: 'image-to-video', label: 'Img2Vid', icon: <Film className="w-5 h-5" /> },
    { id: 'dashboard', label: 'Library', icon: <LayoutDashboard className="w-5 h-5" /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-3 left-0 right-0 z-40 px-3 pointer-events-none">
      <nav className="max-w-md mx-auto glass-panel-glow rounded-2xl p-1.5 flex items-center justify-around pointer-events-auto shadow-[0_8px_30px_rgba(0,0,0,0.8)] border border-purple-500/30">
        {dockItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative ${
                isActive
                  ? 'text-cyan-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-0.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" />
              )}
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive
                    ? 'bg-purple-600/30 scale-110 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                    : ''
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[10px] font-medium tracking-tight mt-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
