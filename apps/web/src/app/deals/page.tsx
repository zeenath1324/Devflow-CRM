'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { apiFetch } from '../../lib/api';
import {
  KanbanSquare,
  Plus,
  DollarSign,
  User,
  Calendar,
  Building,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const STAGES = [
  { id: 'DISCOVERY', name: 'Discovery' },
  { id: 'QUALIFICATION', name: 'Qualification' },
  { id: 'PROPOSAL', name: 'Proposal Sent' },
  { id: 'NEGOTIATION', name: 'Negotiation' },
  { id: 'CONTRACT_SENT', name: 'Contract Sent' },
  { id: 'CLOSED_WON', name: 'Closed Won' },
];

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [value, setValue] = useState(75000);
  const [stage, setStage] = useState('DISCOVERY');
  const [probability, setProbability] = useState(50);

  const loadDeals = async () => {
    try {
      const data = await apiFetch<any[]>('/deals');
      setDeals(data);
    } catch (e) {
      console.warn('Deals fallback data:', e);
      setDeals([
        {
          id: 'deal-001',
          title: 'Apex Institutional Trading Web Portal',
          clientName: 'Apex Fintech Solutions',
          value: 125000,
          stage: 'NEGOTIATION',
          probability: 85,
          expectedCloseDate: '2026-04-15',
          dealOwnerName: 'Marcus Vance',
        },
        {
          id: 'deal-002',
          title: 'BioHealth Patient Portal & Telemedicine App',
          clientName: 'BioHealth Dynamics',
          value: 85000,
          stage: 'PROPOSAL',
          probability: 60,
          expectedCloseDate: '2026-04-30',
          dealOwnerName: 'Marcus Vance',
        },
      ]);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const handleStageChange = async (dealId: string, newStage: string) => {
    try {
      await apiFetch(`/deals/${dealId}/stage`, {
        method: 'PATCH',
        body: JSON.stringify({ stage: newStage }),
      });
      loadDeals();
    } catch (err: any) {
      alert(`Error updating stage: ${err.message}`);
    }
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/deals', {
        method: 'POST',
        body: JSON.stringify({
          title,
          value: Number(value),
          stage,
          probability: Number(probability),
        }),
      });
      setModalOpen(false);
      setTitle('');
      loadDeals();
    } catch (err: any) {
      alert(`Error creating deal: ${err.message}`);
    }
  };

  const totalPipelineValue = deals.reduce((acc, d) => acc + (d.value || 0), 0);

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <KanbanSquare className="text-devflow-violet" />
            Sales Pipeline & Deal Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track software contract proposals, win probabilities, and expected close dates
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Total Pipeline Value</span>
            <span className="text-base font-black text-devflow-emerald">${totalPipelineValue.toLocaleString()}</span>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-devflow-violet to-devflow-cyan text-white text-xs font-semibold shadow-lg shadow-devflow-violet/20 hover:brightness-110 transition-all"
          >
            <Plus size={16} />
            <span>New Deal</span>
          </button>
        </div>
      </div>

      {/* Pipeline Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 overflow-x-auto pb-4">
        {STAGES.map((stg) => {
          const stageDeals = deals.filter((d) => d.stage === stg.id);
          const stageTotal = stageDeals.reduce((acc, d) => acc + (d.value || 0), 0);

          return (
            <div
              key={stg.id}
              className="bg-devflow-secondaryBg/70 border border-devflow-border rounded-2xl p-3 flex flex-col min-w-[210px]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white tracking-wide">{stg.name}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-devflow-card border border-devflow-border text-slate-400">
                  {stageDeals.length}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 mb-3 border-b border-devflow-border pb-2">
                ${stageTotal.toLocaleString()}
              </div>

              {/* Deal Cards in Column */}
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[600px]">
                {stageDeals.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 rounded-xl bg-devflow-card border border-devflow-border hover:border-devflow-violet/50 transition-all shadow-sm"
                  >
                    <h4 className="text-xs font-bold text-white mb-1 leading-snug">{d.title}</h4>
                    <p className="text-[11px] text-devflow-cyan flex items-center gap-1 mb-2">
                      <Building size={11} /> {d.clientName || 'Prospect'}
                    </p>

                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-black text-devflow-emerald">${d.value?.toLocaleString()}</span>
                      <span className="text-[10px] font-mono text-slate-400 font-semibold">{d.probability}% prob</span>
                    </div>

                    {/* Quick stage mover */}
                    <div className="pt-2 border-t border-devflow-border/70 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">{d.dealOwnerName || 'Elena'}</span>
                      <select
                        value={d.stage}
                        onChange={(e) => handleStageChange(d.id, e.target.value)}
                        className="bg-devflow-secondaryBg text-slate-300 text-[10px] border border-devflow-border rounded px-1 py-0.5"
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-slate-600 text-xs italic">
                    No deals in stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Deal Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-devflow-card border border-devflow-border rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-4">Create Sales Deal</h3>
            <form onSubmit={handleCreateDeal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Deal Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Apex Multi-Cloud Kubernetes Migration"
                  className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Deal Value ($ USD) *</label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Probability (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={probability}
                    onChange={(e) => setProbability(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Pipeline Stage</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
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
                  className="px-4 py-2 rounded-lg bg-devflow-violet text-white font-semibold hover:bg-devflow-violetHover transition-colors shadow-md shadow-devflow-violet/20"
                >
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
