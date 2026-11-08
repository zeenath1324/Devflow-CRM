'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AiCopilotDrawer } from '../ai/AiCopilotDrawer';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [aiCopilotOpen, setAiCopilotOpen] = useState(false);

  return (
    <div className="min-h-screen bg-devflow-bg text-white">
      {/* Collapsible Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Top Application Header */}
      <Header
        sidebarCollapsed={collapsed}
        onOpenAiCopilot={() => setAiCopilotOpen(true)}
      />

      {/* Main Content Area */}
      <main
        className={`transition-all duration-300 pt-16 min-h-screen ${
          collapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Gemini AI Copilot Floating Drawer */}
      <AiCopilotDrawer
        isOpen={aiCopilotOpen}
        onClose={() => setAiCopilotOpen(false)}
      />
    </div>
  );
}
