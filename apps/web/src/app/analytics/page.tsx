'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { apiFetch } from '../../lib/api';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users2,
  CheckCircle2,
  Download,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await apiFetch<any>('/analytics/reports');
        setData(res);
      } catch (e) {
        console.warn('Analytics fallback:', e);
        setData({
          developerProductivity: [
            { developer: 'Alex Chen', completedTasks: 14, loggedHours: 78, sprintVelocity: 94, qualityRating: 4.9 },
            { developer: 'Elena Rostova', completedTasks: 18, loggedHours: 82, sprintVelocity: 96, qualityRating: 5.0 },
            { developer: 'Marcus Vance', completedTasks: 8, loggedHours: 45, sprintVelocity: 90, qualityRating: 4.8 },
          ],
          monthlyFinancials: [
            { month: 'Oct', revenue: 68000, expenses: 42000, profit: 26000 },
            { month: 'Nov', revenue: 84000, expenses: 51000, profit: 33000 },
            { month: 'Dec', revenue: 95000, expenses: 58000, profit: 37000 },
            { month: 'Jan', revenue: 112000, expenses: 64000, profit: 48000 },
            { month: 'Feb', revenue: 138000, expenses: 73000, profit: 65000 },
            { month: 'Mar', revenue: 165000, expenses: 82000, profit: 83000 },
          ],
          leadAcquisitionSources: [
            { source: 'Clutch / Agency Review', leads: 18, dealsWon: 5, totalWonValue: 185000 },
            { source: 'Organic Website Inbound', leads: 24, dealsWon: 6, totalWonValue: 140000 },
            { source: 'Referral & Partnerships', leads: 12, dealsWon: 7, totalWonValue: 240000 },
            { source: 'LinkedIn Direct Outbound', leads: 32, dealsWon: 4, totalWonValue: 95000 },
          ],
          summary: {
            averageProjectMargin: '48.5%',
            onTimeDeliveryRate: '94.2%',
            clientRetentionRate: '96.8%',
            supportSlaCompliance: '99.1%',
          },
        });
      }
    }

    loadReports();
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <BarChart3 className="text-devflow-violet" />
            Executive Business Analytics & Forecasting
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Developer productivity, agency gross margins, channel acquisition ROI, and SLA compliance
          </p>
        </div>

        <button
          onClick={() => alert('Exporting comprehensive agency intelligence PDF...')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-devflow-card border border-devflow-border text-xs text-white hover:border-devflow-violet transition-colors"
        >
          <Download size={14} />
          <span>Export Analytics PDF</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-devflow-card border border-devflow-border">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Average Project Margin</span>
          <span className="text-2xl font-black text-devflow-emerald font-mono">
            {data?.summary?.averageProjectMargin || '48.5%'}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Labor cost efficiency</p>
        </div>
        <div className="p-5 rounded-2xl bg-devflow-card border border-devflow-border">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">On-Time Delivery Rate</span>
          <span className="text-2xl font-black text-devflow-cyan font-mono">
            {data?.summary?.onTimeDeliveryRate || '94.2%'}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Milestones delivered on schedule</p>
        </div>
        <div className="p-5 rounded-2xl bg-devflow-card border border-devflow-border">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Client Retention Rate</span>
          <span className="text-2xl font-black text-white font-mono">
            {data?.summary?.clientRetentionRate || '96.8%'}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Annual contract renewal</p>
        </div>
        <div className="p-5 rounded-2xl bg-devflow-card border border-devflow-border">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Support SLA Compliance</span>
          <span className="text-2xl font-black text-devflow-violet font-mono">
            {data?.summary?.supportSlaCompliance || '99.1%'}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">First response within target</p>
        </div>
      </div>

      {/* Financial P&L Chart */}
      <div className="p-6 rounded-2xl bg-devflow-card border border-devflow-border mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-white">Monthly Profit & Loss Breakdown ($)</h3>
            <p className="text-xs text-slate-400">Comparing gross billed revenue against labor & infra expenses</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.monthlyFinancials || []}>
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#151A29', borderColor: '#1E2638', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="revenue" fill="#8B5CF6" name="Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#F43F5E" name="Expenses" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" fill="#10B981" name="Net Profit" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Developer Productivity & Channel ROI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Developer Productivity */}
        <div className="p-6 rounded-2xl bg-devflow-card border border-devflow-border">
          <h3 className="font-bold text-sm text-white mb-4">Core Developer Productivity Matrix</h3>
          <div className="space-y-3">
            {data?.developerProductivity?.map((dev: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-devflow-secondaryBg border border-devflow-border flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-white">{dev.developer}</h4>
                  <p className="text-[11px] text-slate-400">
                    {dev.completedTasks} Tasks Completed • {dev.loggedHours} Billable Hours
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-devflow-emerald font-bold block">{dev.sprintVelocity}% Velocity</span>
                  <span className="text-[10px] text-slate-400">★ {dev.qualityRating}/5.0</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Channels */}
        <div className="p-6 rounded-2xl bg-devflow-card border border-devflow-border">
          <h3 className="font-bold text-sm text-white mb-4">Lead Source Conversion & Won Value</h3>
          <div className="space-y-3">
            {data?.leadAcquisitionSources?.map((src: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-devflow-secondaryBg border border-devflow-border flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-white">{src.source}</h4>
                  <p className="text-[11px] text-slate-400">
                    {src.leads} Leads Inbound • {src.dealsWon} Closed Deals
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-devflow-emerald font-bold block">
                    ${src.totalWonValue?.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {Math.round((src.dealsWon / src.leads) * 100)}% Win Rate
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
