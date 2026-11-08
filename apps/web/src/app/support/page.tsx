'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { apiFetch } from '../../lib/api';
import {
  LifeBuoy,
  Plus,
  Clock,
  Building,
  User,
  AlertCircle,
  CheckCircle2,
  Filter,
} from 'lucide-react';

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('HIGH');
  const [category, setCategory] = useState('Infrastructure');

  const loadTickets = async () => {
    try {
      const data = await apiFetch<any[]>('/support');
      setTickets(data);
    } catch (e) {
      console.warn('Support fallback data:', e);
      setTickets([
        {
          id: 'tick-001',
          clientName: 'Apex Fintech Solutions',
          title: 'Staging Environment API Rate Limit Increase Request',
          description: 'We are starting external sandbox penetration testing and need 500 req/sec quota.',
          category: 'Infrastructure',
          priority: 'HIGH',
          status: 'IN_PROGRESS',
          assignedToName: 'Alex Chen',
          slaHours: 12,
          createdAt: '2026-03-12T09:30:00Z',
        },
      ]);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      await apiFetch(`/support/${ticketId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      loadTickets();
    } catch (err: any) {
      alert(`Error updating ticket status: ${err.message}`);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/support', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          priority,
          category,
          clientId: 'cli-001',
        }),
      });
      setModalOpen(false);
      setTitle('');
      setDescription('');
      loadTickets();
    } catch (err: any) {
      alert(`Error creating ticket: ${err.message}`);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <LifeBuoy className="text-devflow-cyan" />
            Support Helpdesk & Maintenance SLA
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track customer reported issues, SLA response deadlines, and client communication
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-devflow-violet to-devflow-cyan text-white text-xs font-semibold shadow-lg shadow-devflow-violet/20 hover:brightness-110 transition-all"
        >
          <Plus size={16} />
          <span>New Support Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-2xl bg-devflow-card border border-devflow-border hover:border-devflow-cyan/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-devflow-secondaryBg border border-devflow-border text-slate-300 uppercase">
                  {t.category}
                </span>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      t.priority === 'HIGH' || t.priority === 'URGENT'
                        ? 'bg-devflow-rose/20 text-devflow-rose border border-devflow-rose/30'
                        : 'bg-devflow-violet/20 text-devflow-violet'
                    }`}
                  >
                    {t.priority}
                  </span>
                  <span className="text-[10px] font-mono text-devflow-emerald flex items-center gap-1 font-semibold">
                    <Clock size={11} /> SLA: {t.slaHours}h
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white mb-1">{t.title}</h3>
              <p className="text-xs text-devflow-cyan flex items-center gap-1 mb-3">
                <Building size={11} /> {t.clientName || 'Apex Fintech Solutions'}
              </p>
              <p className="text-xs text-slate-300 mb-4 bg-devflow-secondaryBg p-3 rounded-xl border border-devflow-border">
                {t.description}
              </p>
            </div>

            <div className="pt-3 border-t border-devflow-border flex items-center justify-between text-xs">
              <span className="text-slate-400">Assigned: {t.assignedToName || 'Alex Chen'}</span>

              <select
                value={t.status}
                onChange={(e) => handleStatusChange(t.id, e.target.value)}
                className="bg-devflow-secondaryBg text-white text-[11px] font-semibold border border-devflow-border rounded-lg px-2 py-1"
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-devflow-card border border-devflow-border rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-4">Create Support Ticket</h3>
            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Subject / Summary *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Critical Redis cluster failover issue"
                  className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  >
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="API / Backend">API / Backend</option>
                    <option value="Bug Fix">Bug Fix</option>
                    <option value="Security">Security</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High (12h SLA)</option>
                    <option value="URGENT">P1 Urgent (4h SLA)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Details</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Steps, error traces, or requests..."
                  className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-devflow-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-devflow-secondaryBg text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-devflow-cyan text-black font-bold hover:brightness-110 transition-all"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
