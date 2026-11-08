'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { apiFetch } from '../../lib/api';
import {
  ShieldCheck,
  Building2,
  Check,
  Crown,
  Key,
  HardDrive,
  Users2,
  FolderGit2,
  Sparkles,
  Lock,
} from 'lucide-react';

const PLANS = [
  {
    tier: 'STARTER',
    price: 99,
    features: ['Up to 5 Team Members', '5 Active Projects', 'Basic Kanban & Gantt', '500 AI Copilot Queries/mo', '10 GB Cloud Storage'],
  },
  {
    tier: 'PROFESSIONAL',
    price: 199,
    features: ['Up to 25 Team Members', '25 Active Projects', 'Visual Workflow Builder', '5,000 AI Copilot Queries/mo', '100 GB Cloud Storage'],
  },
  {
    tier: 'BUSINESS',
    price: 399,
    features: ['Up to 100 Team Members', '100 Active Projects', 'Custom Roles & RBAC', '25,000 AI Copilot Queries/mo', '500 GB Cloud Storage'],
  },
  {
    tier: 'ENTERPRISE',
    price: 799,
    features: ['Unlimited Engineers', 'Unlimited Projects', 'Dedicated Gemini 2.5 Pro Model', 'Custom Domain & SSO', 'Multi-tenant RLS Audit Vault'],
  },
];

export default function AdminPage() {
  const [adminData, setAdminData] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);

  const loadAdminData = async () => {
    try {
      const [orgData, logsData, tenantData] = await Promise.all([
        apiFetch<any>('/admin/organization'),
        apiFetch<any[]>('/admin/audit-logs'),
        apiFetch<any[]>('/admin/superadmin/tenants'),
      ]);
      setAdminData(orgData);
      setAuditLogs(logsData);
      setTenants(tenantData);
    } catch (e) {
      console.warn('Admin fallback data:', e);
      setAdminData({
        organization: { name: 'Nexus Software Labs', slug: 'nexus-labs', plan: 'ENTERPRISE' },
        usage: { usersCount: 4, projectsCount: 2, clientsCount: 2, storageUsedGB: 4.8 },
      });
      setAuditLogs([
        { id: 'log-1', timestamp: '15m ago', user: 'Marcus Vance', event: 'USER_ROLE_UPDATED', ip: '192.168.1.104', status: 'SUCCESS' },
        { id: 'log-2', timestamp: '45m ago', user: 'Elena Rostova', event: 'PROJECT_BUDGET_MODIFIED', ip: '192.168.1.109', status: 'SUCCESS' },
        { id: 'log-3', timestamp: '2h ago', user: 'System Worker', event: 'AUTOMATION_RUN_PASSED', ip: '127.0.0.1', status: 'SUCCESS' },
      ]);
      setTenants([
        { id: 'org-nexus-001', name: 'Nexus Software Labs', plan: 'ENTERPRISE', userCount: 4, projectCount: 2, mrr: 799 },
        { id: 'org-quantum-002', name: 'Quantum Mobile Agency', plan: 'BUSINESS', userCount: 18, projectCount: 6, mrr: 399 },
        { id: 'org-hyper-003', name: 'HyperScale Cloud Consulting', plan: 'PROFESSIONAL', userCount: 12, projectCount: 4, mrr: 199 },
      ]);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleUpgradePlan = async (targetTier: string) => {
    try {
      const res: any = await apiFetch('/admin/organization/subscription', {
        method: 'POST',
        body: JSON.stringify({ plan: targetTier }),
      });
      alert(res.message);
      loadAdminData();
    } catch (err: any) {
      alert(`Error updating plan: ${err.message}`);
    }
  };

  const currentPlan = adminData?.organization?.plan || 'ENTERPRISE';

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <ShieldCheck className="text-devflow-cyan" />
            Administration & Multi-Tenant SaaS Subscriptions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organization plan tiers, tenant resource quotas, security audit vaults, and platform management
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-devflow-card border border-devflow-border text-xs">
          <Crown size={14} className="text-devflow-amber" />
          <span className="text-slate-400">Current Plan:</span>
          <span className="font-bold text-devflow-violet font-mono">{currentPlan}</span>
        </div>
      </div>

      {/* Subscription Plans Matrix */}
      <div className="mb-10">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Crown size={16} className="text-devflow-amber" />
          SaaS Subscription Tiers & Feature Entitlements
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((p) => {
            const isCurrent = p.tier === currentPlan;

            return (
              <div
                key={p.tier}
                className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-devflow-card border-devflow-violet shadow-lg shadow-devflow-violet/20'
                    : 'bg-devflow-card/60 border-devflow-border hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-white tracking-wide">{p.tier}</h3>
                    {isCurrent && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-devflow-violet text-white">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-black text-white font-mono">${p.price}</span>
                    <span className="text-xs text-slate-400"> / month</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check size={14} className="text-devflow-emerald flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  disabled={isCurrent}
                  onClick={() => handleUpgradePlan(p.tier)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-devflow-secondaryBg text-slate-500 cursor-default'
                      : 'bg-devflow-violet text-white hover:bg-devflow-violetHover shadow-md shadow-devflow-violet/20'
                  }`}
                >
                  {isCurrent ? 'Current Tier' : `Select ${p.tier}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SuperAdmin Tenants Overview */}
      <div className="rounded-2xl bg-devflow-card border border-devflow-border overflow-hidden mb-10">
        <div className="p-4 border-b border-devflow-border bg-devflow-secondaryBg flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
            <Building2 size={15} className="text-devflow-cyan" />
            SuperAdmin Multi-Tenant Organization Directory
          </h3>
          <span className="text-xs text-slate-400">Total Tenants: {tenants.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase tracking-wider font-semibold border-b border-devflow-border">
              <tr>
                <th className="py-3 px-4">Organization Name</th>
                <th className="py-3 px-4">Subscription Plan</th>
                <th className="py-3 px-4">Seats Allocated</th>
                <th className="py-3 px-4">Active Projects</th>
                <th className="py-3 px-4 text-right">MRR Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-devflow-border">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-devflow-secondaryBg/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{t.name}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-devflow-violet/15 text-devflow-violet border border-devflow-violet/30 font-mono">
                      {t.plan}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{t.userCount} Users</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{t.projectCount} Projects</td>
                  <td className="py-3.5 px-4 text-right font-black text-devflow-emerald font-mono">
                    ${t.mrr}/mo
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Log Vault */}
      <div className="rounded-2xl bg-devflow-card border border-devflow-border p-5">
        <h3 className="font-bold text-xs uppercase tracking-wider text-white mb-4 flex items-center gap-2">
          <Lock size={15} className="text-devflow-rose" />
          Enterprise Security & Access Audit Vault
        </h3>

        <div className="space-y-2.5">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-devflow-secondaryBg border border-devflow-border flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-[11px]">{log.timestamp}</span>
                <span className="font-bold text-white">{log.user}</span>
                <span className="text-devflow-cyan font-semibold">{log.event}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-[11px]">{log.ip}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-devflow-emerald/15 text-devflow-emerald">
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
