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
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  { label: 'Executive Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Clients & Accounts', href: '/clients', icon: Building2 },
  { label: 'Leads & Inbound', href: '/leads', icon: Target },
  { label: 'Sales Deals & Pipeline', href: '/deals', icon: KanbanSquare },
  { label: 'Projects & Backlog', href: '/projects', icon: FolderGit2 },
  { label: 'Tasks & Bug Tracker', href: '/tasks', icon: CheckSquare },
  { label: 'Team & Skill Matrix', href: '/teams', icon: Users2 },
  { label: 'Time Tracking', href: '/time', icon: Clock },
  { label: 'Client Portal', href: '/portal', icon: Globe2 },
  { label: 'Finance & Invoicing', href: '/finance', icon: Receipt },
  { label: 'Customer Support SLA', href: '/support', icon: LifeBuoy },
  { label: 'Communication Hub', href: '/communication', icon: MessageSquare },
  { label: 'AI Business Copilot', href: '/ai-copilot', icon: Sparkles, badge: 'Gemini' },
  { label: 'Workflow Automations', href: '/automations', icon: Cpu },
  { label: 'Business Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'SaaS Administration', href: '/admin', icon: ShieldCheck },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out border-r border-devflow-border bg-devflow-bg flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-devflow-border">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-devflow-violet to-devflow-cyan flex items-center justify-center font-bold text-white shadow-lg shadow-devflow-violet/20">
              D
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-wide bg-gradient-to-r from-white via-slate-200 to-devflow-cyan bg-clip-text text-transparent">
                DEVFLOW
              </span>
              <span className="text-[9px] uppercase tracking-widest text-devflow-textMuted font-semibold">
                Enterprise CRM
              </span>
            </div>
          </Link>
        )}

        {collapsed && (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-devflow-violet to-devflow-cyan flex items-center justify-center font-bold text-white shadow-lg">
              D
            </div>
          </div>
        )}

        <button
          onClick={onToggle}
          className="p-1.5 rounded-md text-devflow-textMuted hover:text-white hover:bg-devflow-card transition-colors hidden lg:block"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-devflow-violet/15 text-devflow-violet border border-devflow-violet/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-devflow-card'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                size={18}
                className={`${isActive ? 'text-devflow-violet' : 'text-slate-400 group-hover:text-devflow-cyan'} transition-colors flex-shrink-0`}
              />

              {!collapsed && (
                <div className="flex-1 flex items-center justify-between overflow-hidden">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-gradient-to-r from-devflow-violet to-devflow-cyan text-white shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Tagline */}
      {!collapsed && (
        <div className="p-4 border-t border-devflow-border text-xs text-slate-500 text-center">
          DevFlow OS v1.0.0
        </div>
      )}
    </aside>
  );
}
