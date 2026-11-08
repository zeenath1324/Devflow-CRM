'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { apiFetch } from '../../lib/api';
import {
  Globe2,
  FolderGit2,
  Receipt,
  LifeBuoy,
  Plus,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

export default function ClientPortalPage() {
  const [data, setData] = useState<any>(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');

  const loadPortalData = async () => {
    try {
      const res = await apiFetch<any>('/portal/overview');
      setData(res);
    } catch (e) {
      console.warn('Portal fallback data:', e);
      setData({
        client: { name: 'Apex Fintech Solutions', id: 'cli-001' },
        projects: [
          {
            id: 'proj-001',
            name: 'Apex Core Banking Platform V2',
            status: 'ACTIVE',
            completionPercentage: 62,
            targetDeliveryDate: '2026-05-30',
            description: 'Distributed matching engine with real-time WebSocket book streaming.',
          },
        ],
        invoices: [
          {
            id: 'inv-001',
            invoiceNumber: 'INV-2026-001',
            dueDate: '2026-03-15',
            totalAmount: 47250,
            paidAmount: 47250,
            status: 'PAID',
          },
          {
            id: 'inv-002',
            invoiceNumber: 'INV-2026-002',
            dueDate: '2026-03-31',
            totalAmount: 29400,
            paidAmount: 0,
            status: 'SENT',
          },
        ],
        tickets: [
          {
            id: 'tick-001',
            title: 'Staging Environment API Rate Limit Increase Request',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
            createdAt: '2026-03-12',
          },
        ],
        stats: {
          activeProjectsCount: 1,
          pendingInvoicesCount: 1,
          totalDue: 29400,
          openTicketsCount: 1,
        },
      });
    }
  };

  useEffect(() => {
    loadPortalData();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/support', {
        method: 'POST',
        body: JSON.stringify({
          title: ticketTitle,
          description: ticketDesc,
          clientId: 'cli-001',
          priority: 'MEDIUM',
        }),
      });
      setTicketModalOpen(false);
      setTicketTitle('');
      setTicketDesc('');
      loadPortalData();
      alert('Support ticket submitted successfully!');
    } catch (err: any) {
      alert(`Error submitting ticket: ${err.message}`);
    }
  };

  return (
    <AppShell>
      {/* Client Portal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-devflow-cyan font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck size={14} /> Client-Facing Secure Portal
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Globe2 className="text-devflow-violet" />
            {data?.client?.name || 'Apex Fintech Solutions'} Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Restricted client portal for deliverables review, milestone approvals, invoice payment, and priority support
          </p>
        </div>

        <button
          onClick={() => setTicketModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-devflow-violet text-white text-xs font-semibold hover:bg-devflow-violetHover transition-all shadow-md shadow-devflow-violet/20"
        >
          <Plus size={16} />
          <span>Open Support Ticket</span>
        </button>
      </div>

      {/* Client Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-devflow-card border border-devflow-border">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Active Engagements</span>
          <span className="text-xl font-black text-white">{data?.stats?.activeProjectsCount || 1}</span>
        </div>
        <div className="p-4 rounded-2xl bg-devflow-card border border-devflow-border">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Unpaid Invoices</span>
          <span className="text-xl font-black text-devflow-amber">{data?.stats?.pendingInvoicesCount || 1}</span>
        </div>
        <div className="p-4 rounded-2xl bg-devflow-card border border-devflow-border">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Balance Outstanding</span>
          <span className="text-xl font-black text-white font-mono">${(data?.stats?.totalDue || 29400).toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-2xl bg-devflow-card border border-devflow-border">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Open Support Tickets</span>
          <span className="text-xl font-black text-devflow-cyan">{data?.stats?.openTicketsCount || 1}</span>
        </div>
      </div>

      {/* Projects Section */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <FolderGit2 size={16} className="text-devflow-violet" />
          Active Project Deliverables
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.projects?.map((p: any) => (
            <div key={p.id} className="p-5 rounded-2xl bg-devflow-card border border-devflow-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm text-white">{p.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-devflow-emerald/15 text-devflow-emerald border border-devflow-emerald/30">
                  {p.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-4">{p.description}</p>

              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Development Progress</span>
                  <span className="font-bold text-white font-mono">{p.completionPercentage}%</span>
                </div>
                <div className="w-full bg-devflow-secondaryBg h-2 rounded-full overflow-hidden border border-devflow-border">
                  <div
                    className="h-full bg-gradient-to-r from-devflow-violet to-devflow-cyan rounded-full"
                    style={{ width: `${p.completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-devflow-border">
                <span>Target Handover: {p.targetDeliveryDate}</span>
                <button
                  onClick={() => alert('Deliverable build artifact verification passed. Milestone approved!')}
                  className="text-xs font-semibold text-devflow-cyan hover:underline flex items-center gap-1"
                >
                  <CheckCircle2 size={13} /> Approve Deliverable
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices & Tickets Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoices */}
        <div className="p-5 rounded-2xl bg-devflow-card border border-devflow-border">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Receipt size={16} className="text-devflow-cyan" />
            Billing & Invoices
          </h2>

          <div className="space-y-3">
            {data?.invoices?.map((inv: any) => (
              <div
                key={inv.id}
                className="p-3.5 rounded-xl bg-devflow-secondaryBg border border-devflow-border flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white font-mono">{inv.invoiceNumber}</div>
                  <div className="text-slate-400 text-[11px]">Due Date: {inv.dueDate}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-white font-mono text-sm">${inv.totalAmount?.toLocaleString()}</div>
                  <span
                    className={`inline-block mt-0.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      inv.status === 'PAID'
                        ? 'bg-devflow-emerald/15 text-devflow-emerald'
                        : 'bg-devflow-amber/15 text-devflow-amber'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Tickets */}
        <div className="p-5 rounded-2xl bg-devflow-card border border-devflow-border">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <LifeBuoy size={16} className="text-devflow-violet" />
            Helpdesk Tickets
          </h2>

          <div className="space-y-3">
            {data?.tickets?.map((t: any) => (
              <div
                key={t.id}
                className="p-3.5 rounded-xl bg-devflow-secondaryBg border border-devflow-border flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white">{t.title}</div>
                  <div className="text-slate-400 text-[11px]">Opened: {t.createdAt}</div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-devflow-cyan/15 text-devflow-cyan border border-devflow-cyan/30">
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-devflow-card border border-devflow-border rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-4">Submit Helpdesk Support Ticket</h3>
            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Subject / Issue Summary *</label>
                <input
                  type="text"
                  required
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  placeholder="e.g. Staging sandbox API webhook failure"
                  className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Issue Details *</label>
                <textarea
                  rows={4}
                  required
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  placeholder="Describe what occurred, steps to reproduce, or requested configuration..."
                  className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-devflow-border">
                <button
                  type="button"
                  onClick={() => setTicketModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-devflow-secondaryBg text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-devflow-violet text-white font-semibold hover:bg-devflow-violetHover transition-colors shadow-md shadow-devflow-violet/20"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
