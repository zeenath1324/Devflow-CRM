'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Bell,
  Sparkles,
  Play,
  Square,
  Building,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Clock,
  Command,
} from 'lucide-react';

interface HeaderProps {
  onOpenAiCopilot: () => void;
  sidebarCollapsed: boolean;
}

export function Header({ onOpenAiCopilot, sidebarCollapsed }: HeaderProps) {
  const { user, organization, logout, switchWorkspace } = useAuth();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1485); // 24m 45s

  React.useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? `${h}:` : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const workspaces = [
    { id: 'org-nexus-001', name: 'Nexus Software Labs' },
    { id: 'org-quantum-002', name: 'Quantum Mobile Agency' },
    { id: 'org-hyper-003', name: 'HyperScale Cloud Consulting' },
  ];

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 border-b border-devflow-border/80 bg-devflow-bg/85 backdrop-blur-xl transition-all duration-300 flex items-center justify-between px-6 ${
        sidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Search Input with Hotkey Pill */}
      <div className="flex items-center gap-3 w-80 lg:w-96">
        <div className="relative w-full">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search projects, accounts, invoices, commits..."
            className="w-full pl-9 pr-14 py-1.5 text-xs bg-devflow-secondaryBg/80 border border-devflow-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-devflow-violet/60 transition-colors font-medium shadow-inner"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono font-semibold text-slate-500 bg-devflow-card border border-devflow-border px-1.5 py-0.5 rounded-md">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Workspace Switcher */}
        <div className="relative">
          <button
            onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-devflow-border bg-devflow-secondaryBg/70 hover:border-devflow-violet/50 text-xs text-white transition-all shadow-sm"
          >
            <Building size={13} className="text-devflow-cyan" />
            <span className="font-bold max-w-[130px] truncate tracking-tight">{organization?.name || 'Workspace'}</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold font-mono bg-devflow-violet/20 text-devflow-violet">
              ENTERPRISE
            </span>
            <ChevronDown size={13} className="text-slate-500" />
          </button>

          {workspaceMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-devflow-card border border-devflow-border rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="text-[9px] uppercase font-bold text-slate-500 px-2 py-1 tracking-wider font-mono">
                Active Tenant Organizations
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    switchWorkspace(ws.id, ws.name);
                    setWorkspaceMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 text-xs rounded-xl transition-colors flex items-center justify-between ${
                    organization?.id === ws.id
                      ? 'bg-devflow-violet/20 text-devflow-violet font-bold'
                      : 'text-slate-300 hover:bg-devflow-secondaryBg'
                  }`}
                >
                  <span className="truncate">{ws.name}</span>
                  {organization?.id === ws.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-devflow-violet shadow-sm shadow-devflow-violet"></span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Billable Stopwatch */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1 bg-devflow-secondaryBg/80 border border-devflow-border rounded-xl">
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={`p-1 rounded-lg transition-all ${
              isTimerRunning
                ? 'bg-devflow-rose/20 text-devflow-rose hover:bg-devflow-rose/30'
                : 'bg-devflow-emerald/20 text-devflow-emerald hover:bg-devflow-emerald/30'
            }`}
          >
            {isTimerRunning ? <Square size={11} /> : <Play size={11} />}
          </button>
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-white tracking-wider">
            {isTimerRunning && <span className="w-1.5 h-1.5 rounded-full bg-devflow-rose animate-ping"></span>}
            <span>{formatTimer(timerSeconds)}</span>
          </div>
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold">
            Billable
          </span>
        </div>

        {/* Gemini AI Copilot Trigger */}
        <button
          onClick={onOpenAiCopilot}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-devflow-violet via-indigo-600 to-devflow-cyan text-white text-xs font-bold shadow-md shadow-devflow-violet/20 hover:brightness-110 active:scale-95 transition-all"
        >
          <Sparkles size={13} />
          <span className="hidden md:inline font-mono">Ask AI Copilot</span>
        </button>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-devflow-secondaryBg border border-transparent hover:border-devflow-border transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-devflow-cyan shadow-sm shadow-devflow-cyan"></span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-devflow-secondaryBg border border-transparent hover:border-devflow-border transition-colors"
          >
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop'}
              alt={user?.firstName || 'User'}
              className="w-7 h-7 rounded-xl object-cover border border-devflow-border shadow-sm"
            />
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">
                {user ? `${user.firstName} ${user.lastName}` : 'Marcus Vance'}
              </span>
              <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">
                {user?.role || 'COMPANY_OWNER'}
              </span>
            </div>
            <ChevronDown size={12} className="text-slate-500" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-devflow-card border border-devflow-border rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-devflow-border mb-1">
                <p className="text-xs font-bold text-white">{user?.firstName} {user?.lastName}</p>
                <p className="text-[11px] text-slate-400 truncate font-mono">{user?.email}</p>
                <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full bg-devflow-violet/20 text-devflow-violet font-bold font-mono uppercase">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-devflow-rose hover:bg-devflow-rose/10 rounded-xl transition-colors font-semibold"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
