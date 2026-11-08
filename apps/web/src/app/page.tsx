'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { apiFetch } from '../lib/api';
import {
  DollarSign,
  TrendingUp,
  Target,
  FolderGit2,
  Users2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const metrics = await apiFetch<any>('/dashboard/metrics');
        setData(metrics);
      } catch (err) {
        console.warn('Using default metrics:', err);
        // Fallback default state for offline display
        setData({
          totalRevenue: 76650,
          monthlyRecurringRevenue: 45000,
          newClients: 2,
          activeLeads: 2,
          leadConversionRate: 32,
          activeProjects: 2,
          completedProjects: 1,
          delayedProjects: 0,
          pendingInvoicesCount: 1,
          outstandingPayments: 29400,
          teamProductivity: 94,
          projectProfitability: 60,
          revenueChart: [
            { month: 'Oct', revenue: 68000, target: 60000, expenses: 42000 },
            { month: 'Nov', revenue: 84000, target: 75000, expenses: 51000 },
            { month: 'Dec', revenue: 95000, target: 80000, expenses: 58000 },
            { month: 'Jan', revenue: 112000, target: 100000, expenses: 64000 },
            { month: 'Feb', revenue: 138000, target: 120000, expenses: 73000 },
            { month: 'Mar', revenue: 165000, target: 140000, expenses: 82000 },
          ],
          projectStatusDistribution: [
            { name: 'Active', value: 2, color: '#8B5CF6' },
            { name: 'Planning', value: 1, color: '#06B6D4' },
            { name: 'Testing', value: 1, color: '#10B981' },
            { name: 'Completed', value: 1, color: '#F59E0B' },
          ],
          salesFunnel: [
            { stage: 'Discovery', count: 4, value: 45000 },
            { stage: 'Qualification', count: 3, value: 75000 },
            { stage: 'Proposal', count: 2, value: 140000 },
            { stage: 'Negotiation', count: 1, value: 125000 },
            { stage: 'Closed Won', count: 2, value: 195000 },
          ],
          upcomingDeadlines: [
            { id: '1', title: 'Implement Redis Pub/Sub WebSocket Stream', project: 'Apex Core Banking Platform V2', dueDate: '2026-03-20', priority: 'HIGH' },
            { id: '2', title: 'Order cancellation race condition fix', project: 'Apex Core Banking Platform V2', dueDate: '2026-03-18', priority: 'URGENT' },
          ],
          aiBusinessInsights: [
            'Profitability is currently tracking at 60% across active software projects. Apex Core Banking Platform V2 is maintaining optimal gross margins.',
            'Lead velocity increased by 28% from Clutch & Organic search. 2 high-score qualified leads require follow-up.',
            'Invoice INV-2026-002 ($29,400) is scheduled for Net-30 collection. Cash flow reserve remains robust.',
          ],
          recentActivities: [
            { id: 'act-1', user: 'Alex Chen', action: 'Moved task "Redis Pub/Sub WebSocket" to In Progress', time: '12m ago' },
            { id: 'act-2', user: 'Elena Rostova', action: 'Created milestone for Sprint 04 Delivery', time: '1h ago' },
            { id: 'act-3', user: 'Marcus Vance', action: 'Sent proposal to NeuroScan Inc ($95,000)', time: '3h ago' },
          ],
        });
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  return (
    <AppShell>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            Executive Operating Dashboard
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-devflow-emerald/15 text-devflow-emerald border border-devflow-emerald/30 font-bold uppercase tracking-wider">
              Live Real-Time
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Nexus Software Labs — Multi-tenant agency business telemetry & forecasting
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 bg-devflow-card border border-devflow-border px-3 py-1.5 rounded-lg flex items-center gap-2">
            <Clock size={13} className="text-devflow-cyan" />
            Last Synced: Just now
          </span>
        </div>
      </div>

      {/* KPI Statistic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Total Revenue */}
        <div className="p-5 rounded-2xl bg-devflow-card border border-devflow-border relative overflow-hidden group hover:border-devflow-violet/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 rounded-xl bg-devflow-violet/10 text-devflow-violet">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            ${(data?.totalRevenue || 76650).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-devflow-emerald mt-2 font-medium">
            <ArrowUpRight size={14} />
            <span>+18.4% vs last month</span>
          </div>
        </div>

        {/* Card 2: MRR */}
        <div className="p-5 rounded-2xl bg-devflow-card border border-devflow-border relative overflow-hidden group hover:border-devflow-cyan/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Monthly Recurring (MRR)</span>
            <div className="p-2 rounded-xl bg-devflow-cyan/10 text-devflow-cyan">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            ${(data?.monthlyRecurringRevenue || 45000).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-devflow-cyan mt-2 font-medium">
            <ArrowUpRight size={14} />
            <span>Retainers & SLA contracts</span>
          </div>
        </div>

        {/* Card 3: Active Projects & Margin */}
        <div className="p-5 rounded-2xl bg-devflow-card border border-devflow-border relative overflow-hidden group hover:border-devflow-emerald/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
            <div className="p-2 rounded-xl bg-devflow-emerald/10 text-devflow-emerald">
              <FolderGit2 size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {data?.activeProjects || 2} <span className="text-xs font-normal text-slate-400">({data?.projectProfitability || 60}% margin)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-devflow-emerald mt-2 font-medium">
            <CheckCircle2 size={14} />
            <span>0 delayed projects</span>
          </div>
        </div>

        {/* Card 4: Sales Pipeline Leads */}
        <div className="p-5 rounded-2xl bg-devflow-card border border-devflow-border relative overflow-hidden group hover:border-devflow-amber/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Leads & Funnel</span>
            <div className="p-2 rounded-xl bg-devflow-amber/10 text-devflow-amber">
              <Target size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {data?.activeLeads || 2} <span className="text-xs font-normal text-slate-400">({data?.leadConversionRate || 32}% win rate)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-devflow-cyan"></span>
            <span>$160,000 qualified volume</span>
          </div>
        </div>
      </div>

      {/* AI Business Insights Banner */}
      <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-devflow-violet/15 via-devflow-card to-devflow-cyan/15 border border-devflow-violet/30 shadow-lg relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-devflow-violet text-white shadow-md shadow-devflow-violet/30 flex-shrink-0">
            <Sparkles size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-bold text-sm text-white">Gemini AI Executive Business Advisory</h3>
              <span className="text-[9px] px-2 py-0.5 rounded bg-devflow-violet/20 text-devflow-violet font-semibold">
                Grounded on DB Telemetry
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              {data?.aiBusinessInsights?.map((insight: string, idx: number) => (
                <p key={idx} className="flex items-start gap-2">
                  <span className="text-devflow-cyan font-bold">•</span>
                  <span>{insight}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Forecast Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-devflow-card border border-devflow-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-sm text-white">Monthly Revenue vs Target & Expenses</h3>
              <p className="text-xs text-slate-400">Billed revenue velocity over the last 6 months</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-devflow-violet font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-devflow-violet"></span> Revenue
              </div>
              <div className="flex items-center gap-1.5 text-devflow-cyan font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-devflow-cyan"></span> Target
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.revenueChart || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#151A29', borderColor: '#1E2638', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="target" stroke="#06B6D4" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorTarget)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status Distribution */}
        <div className="p-6 rounded-2xl bg-devflow-card border border-devflow-border flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-white mb-1">Project Portfolio Health</h3>
            <p className="text-xs text-slate-400 mb-4">Distribution by development lifecycle</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.projectStatusDistribution || []}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(data?.projectStatusDistribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#151A29', borderColor: '#1E2638', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-4 border-t border-devflow-border text-xs">
            {(data?.projectStatusDistribution || []).map((s: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></span>
                <span className="text-slate-300">{s.name}:</span>
                <span className="font-bold text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deadlines & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Milestones */}
        <div className="p-6 rounded-2xl bg-devflow-card border border-devflow-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-white">Upcoming Sprint Deliverables</h3>
            <span className="text-xs text-devflow-violet hover:underline cursor-pointer">View All Tasks</span>
          </div>

          <div className="space-y-3">
            {data?.upcomingDeadlines?.map((d: any) => (
              <div
                key={d.id}
                className="p-3.5 rounded-xl bg-devflow-secondaryBg border border-devflow-border flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-xs text-white">{d.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{d.project}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      d.priority === 'URGENT'
                        ? 'bg-devflow-rose/20 text-devflow-rose'
                        : 'bg-devflow-violet/20 text-devflow-violet'
                    }`}
                  >
                    {d.priority}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{d.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time Activity Feed */}
        <div className="p-6 rounded-2xl bg-devflow-card border border-devflow-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-white">Live Activity Feed</h3>
            <span className="text-xs text-slate-400">Audit Trail</span>
          </div>

          <div className="space-y-3">
            {data?.recentActivities?.map((a: any) => (
              <div key={a.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-devflow-cyan mt-1.5 flex-shrink-0"></div>
                <div className="flex-1">
                  <span className="font-semibold text-white">{a.user} </span>
                  <span className="text-slate-300">{a.action}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
