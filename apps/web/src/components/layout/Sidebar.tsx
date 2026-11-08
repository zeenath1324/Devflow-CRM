'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Target,
  KanbanSquare,
  FolderGit2,
  CheckSquare,
  Users2,
  Clock,
  Globe2,
  Receipt,
  LifeBuoy,
  MessageSquare,
  Sparkles,
  Cpu,
  BarChart3,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_GROUPS = [
  {
    title: 'EXECUTIVE',
    items: [
      { label: 'Executive Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'Business Analytics', href: '/analytics', icon: BarChart3 },
      { label: 'SaaS Administration', href: '/admin', icon: ShieldCheck },
    ],
  },
  {
    title: 'REVENUE & CRM',
    items: [
      { label: 'Clients & Accounts', href: '/clients', icon: Building2 },
      { label: 'Leads & Inbound', href: '/leads', icon: Target },
      { label: 'Sales Deals & Pipeline', href: '/deals', icon: KanbanSquare },
      { label: 'Finance & Invoicing', href: '/finance', icon: Receipt },
    ],
  },
  {
    title: 'DELIVERY & AGILE',
    items: [
      { label: 'Projects & Backlog', href: '/projects', icon: FolderGit2 },
      { label: 'Tasks & Bug Tracker', href: '/tasks', icon: CheckSquare },
      { label: 'Team & Skill Matrix', href: '/teams', icon: Users2 },
      { label: 'Time Tracking', href: '/time', icon: Clock },
    ],
  },
  {
    title: 'INTELLIGENCE & PORTAL',
    items: [
      { label: 'AI Business Copilot', href: '/ai-copilot', icon: Sparkles, badge: 'Gemini' },
      { label: 'Workflow Automations', href: '/automations', icon: Cpu },
      { label: 'Client Portal', href: '/portal', icon: Globe2 },
      { label: 'Support SLA & Helpdesk', href: '/support', icon: LifeBuoy },
      { label: 'Engineering Hub', href: '/communication', icon: MessageSquare },
    ],
  },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out border-r border-devflow-border bg-devflow-bg/95 backdrop-blur-xl flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-devflow-border/80">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-devflow-violet via-indigo-600 to-devflow-cyan flex items-center justify-center font-black text-white shadow-lg shadow-devflow-violet/25 group-hover:scale-105 transition-transform">
              <Zap size={16} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-wider bg-gradient-to-r from-white via-slate-200 to-devflow-cyan bg-clip-text text-transparent">
                DEVFLOW
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold font-mono">
                Agency OS • v1.0
              </span>
            </div>
          </Link>
        )}

        {collapsed && (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-devflow-violet to-devflow-cyan flex items-center justify-center font-bold text-white shadow-lg">
              <Zap size={16} />
            </div>
          </div>
        )}

        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-devflow-card border border-transparent hover:border-devflow-border transition-colors hidden lg:block"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
        {NAV_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!collapsed && (
              <div className="text-[9px] uppercase tracking-widest font-black text-slate-500/80 px-2.5 py-1">
                {group.title}
              </div>
            )}

            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all group relative ${
                    isActive
                      ? 'bg-devflow-violet/15 text-white border border-devflow-violet/35 shadow-sm shadow-devflow-violet/15'
                      : 'text-slate-400 hover:text-white hover:bg-devflow-card/80 hover:border-devflow-border border border-transparent'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  {/* Subtle active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-devflow-violet rounded-r-full shadow-sm shadow-devflow-violet" />
                  )}

                  <Icon
                    size={16}
                    className={`${
                      isActive
                        ? 'text-devflow-violet'
                        : 'text-slate-400 group-hover:text-devflow-cyan'
                    } transition-colors flex-shrink-0`}
                  />

                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between overflow-hidden">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md font-bold bg-gradient-to-r from-devflow-violet to-devflow-cyan text-white shadow-sm font-mono">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Profile Mini-Banner */}
      {!collapsed && (
        <div className="p-3 border-t border-devflow-border/80 bg-devflow-secondaryBg/40">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-mono">Tenant Status:</span>
            <span className="text-devflow-emerald font-bold font-mono text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-devflow-emerald animate-pulse"></span>
              ENTERPRISE RLS
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
