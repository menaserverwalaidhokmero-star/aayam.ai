/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileDock } from './components/MobileDock';
import { Hero } from './components/Hero';
import { ToolsGrid } from './components/ToolsGrid';
import { PhotoGenerator } from './components/PhotoGenerator';
import { PhotoEditor } from './components/PhotoEditor';
import { VideoGenerator } from './components/VideoGenerator';
import { ImageToVideo } from './components/ImageToVideo';
import { Dashboard } from './components/Dashboard';
import { StatusModal } from './components/StatusModal';
import { Footer } from './components/Footer';
import { ToolId, GenerationItem, ApiStatus } from './types';
import { INITIAL_SHOWCASE } from './data/presets';
import { Sparkles, ArrowRight, Play, Eye, Flame, Shield, Layers } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ToolId>('home');
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [initialPromptForTool, setInitialPromptForTool] = useState<string>('');

  // Generation library state with localStorage persistence
  const [generations, setGenerations] = useState<GenerationItem[]>(() => {
    try {
      const saved = localStorage.getItem('aayam_ai_generations');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    return INITIAL_SHOWCASE;
  });

  // Save to localStorage whenever generations change
  useEffect(() => {
    try {
      localStorage.setItem('aayam_ai_generations', JSON.stringify(generations));
    } catch (e) {
      console.warn('Could not write to localStorage', e);
    }
  }, [generations]);

  // Fetch backend status on mount
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data: ApiStatus) => {
        setApiStatus(data);
      })
      .catch((err) => {
        console.error('Failed to query system status:', err);
        setApiStatus({
          status: 'offline',
          isKeyConfigured: false,
          provider: 'Local Express Proxy',
          models: {
            imageGeneration: 'gemini-3.1-flash-lite-image',
            imageEditing: 'gemini-3.1-flash-lite-image',
            videoGeneration: 'gemini-omni-1.2-flash',
            imageToVideo: 'gemini-omni-1.2-flash',
          },
          message: 'Backend server starting. Connect GEMINI_API_KEY in AI Studio Settings > Secrets.',
        });
      });
  }, []);

  const handleSaveGeneration = (item: GenerationItem) => {
    setGenerations((prev) => [item, ...prev]);
  };

  const handleDeleteItem = (id: string) => {
    setGenerations((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setGenerations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleQuickGenerate = (prompt: string, tool: ToolId) => {
    setInitialPromptForTool(prompt);
    setCurrentTab(tool);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectItemToRemix = (item: GenerationItem) => {
    setInitialPromptForTool(item.prompt);
    setCurrentTab(item.tool);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTools = () => {
    const el = document.getElementById('tools-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setCurrentTab('home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#04020a] text-slate-100 selection:bg-purple-600 selection:text-white">
      {/* Top Futuristic Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        apiStatus={apiStatus}
        onOpenStatusModal={() => setIsStatusModalOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div className="space-y-4">
            {/* Hero Section */}
            <Hero
              onStartCreating={() => {
                setCurrentTab('photo-generator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreTools={scrollToTools}
              onQuickGenerate={handleQuickGenerate}
            />

            {/* Feature Cards Grid (All 4 AI Tools) */}
            <ToolsGrid
              onSelectTool={(tool) => {
                setCurrentTab(tool);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Community Showcase & Recent Syntheses */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-purple-500/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400">
                    <Flame className="w-4 h-4 text-cyan-400" />
                    <span>Neural Gallery Showcase</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
                    Featured Creations from AAYAM AI
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setCurrentTab('dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 text-xs font-mono text-purple-300 hover:text-cyan-300 transition-colors"
                >
                  <span>View All In Library</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Showcase Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {INITIAL_SHOWCASE.slice(0, 6).map((item) => {
                  const isVideo = item.tool.includes('video');
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItemToRemix(item)}
                      className="group glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(6,182,212,0.2)] cursor-pointer"
                    >
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        
                        <div className="absolute top-2.5 left-2.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-cyan-300 border border-white/10">
                            {item.tool.replace('-', ' ')}
                          </span>
                        </div>

                        {isVideo && (
                          <div className="absolute bottom-2.5 right-2.5 p-1.5 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20">
                            <Play className="w-3.5 h-3.5 ml-0.5" />
                          </div>
                        )}
                      </div>

                      <div className="p-4 space-y-1.5">
                        <h4 className="text-sm font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono line-clamp-2">
                          {item.prompt}
                        </p>
                        <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-purple-400">
                          <span>Click to remix in Studio</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* 1. AI Photo Generator Studio */}
        {currentTab === 'photo-generator' && (
          <PhotoGenerator
            apiStatus={apiStatus}
            onSaveGeneration={handleSaveGeneration}
            initialPrompt={initialPromptForTool}
            onOpenStatusModal={() => setIsStatusModalOpen(true)}
          />
        )}

        {/* 2. AI Photo Editor Studio */}
        {currentTab === 'photo-editor' && (
          <PhotoEditor
            apiStatus={apiStatus}
            onSaveGeneration={handleSaveGeneration}
            onOpenStatusModal={() => setIsStatusModalOpen(true)}
          />
        )}

        {/* 3. AI Video Generator Studio */}
        {currentTab === 'video-generator' && (
          <VideoGenerator
            apiStatus={apiStatus}
            onSaveGeneration={handleSaveGeneration}
            initialPrompt={initialPromptForTool}
            onOpenStatusModal={() => setIsStatusModalOpen(true)}
          />
        )}

        {/* 4. Image to Video Studio */}
        {currentTab === 'image-to-video' && (
          <ImageToVideo
            apiStatus={apiStatus}
            onSaveGeneration={handleSaveGeneration}
            onOpenStatusModal={() => setIsStatusModalOpen(true)}
          />
        )}

        {/* 5. Library / Dashboard */}
        {currentTab === 'dashboard' && (
          <Dashboard
            items={generations}
            onSelectItemToRemix={handleSelectItemToRemix}
            onDeleteItem={handleDeleteItem}
            onToggleFavorite={handleToggleFavorite}
            onNavigateToTool={(tool) => {
              setCurrentTab(tool);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Professional Footer */}
      <Footer
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenStatusModal={() => setIsStatusModalOpen(true)}
      />

      {/* Mobile Android & Tablet Bottom Dock Bar */}
      <MobileDock
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Backend Engine Status & Diagnostics Modal */}
      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        status={apiStatus}
      />
    </div>
  );
}
