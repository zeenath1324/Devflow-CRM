'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { apiFetch } from '../../lib/api';
import {
  FolderGit2,
  Plus,
  Calendar,
  Building,
  User,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'gantt'>('grid');

  // Form state
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [category, setCategory] = useState('SAAS_DEVELOPMENT');
  const [budget, setBudget] = useState(120000);
  const [targetDeliveryDate, setTargetDeliveryDate] = useState('2026-06-30');
  const [description, setDescription] = useState('');

  const loadData = async () => {
    try {
      const [projData, clientData] = await Promise.all([
        apiFetch<any[]>('/projects'),
        apiFetch<any[]>('/clients'),
      ]);
      setProjects(projData);
      setClients(clientData);
      if (clientData.length > 0) setClientId(clientData[0].id);
    } catch (e) {
      console.warn('Projects fallback data:', e);
      setProjects([
        {
          id: 'proj-001',
          name: 'Apex Core Banking Platform V2',
          clientName: 'Apex Fintech Solutions',
          category: 'SAAS_DEVELOPMENT',
          budget: 180000,
          actualCost: 72000,
          status: 'ACTIVE',
          startDate: '2026-01-10',
          targetDeliveryDate: '2026-05-30',
          completionPercentage: 62,
          projectManagerName: 'Elena Rostova',
          description: 'Next-gen distributed order book and clearing interface with real-time WebSockets.',
        },
        {
          id: 'proj-002',
          name: 'BioHealth Cloud EHR Connector',
          clientName: 'BioHealth Dynamics',
          category: 'AI_ML',
          budget: 95000,
          actualCost: 41000,
          status: 'ACTIVE',
          startDate: '2026-02-01',
          targetDeliveryDate: '2026-06-15',
          completionPercentage: 45,
          projectManagerName: 'Elena Rostova',
          description: 'FHIR integration engine with automated clinical report summaries via Gemini API.',
        },
      ]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/projects', {
        method: 'POST',
        body: JSON.stringify({
          name,
          clientId: clientId || clients[0]?.id || 'cli-001',
          category,
          budget: Number(budget),
          targetDeliveryDate,
          description,
          status: 'ACTIVE',
        }),
      });
      setModalOpen(false);
      setName('');
      setDescription('');
      loadData();
    } catch (err: any) {
      alert(`Error creating project: ${err.message}`);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <FolderGit2 className="text-devflow-violet" />
            Software Project Engagements
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end delivery tracking, Gantt schedules, budget margins, and engineering velocity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-devflow-secondaryBg border border-devflow-border p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'grid' ? 'bg-devflow-violet text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Card Matrix
            </button>
            <button
              onClick={() => setViewMode('gantt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'gantt' ? 'bg-devflow-violet text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Gantt Roadmap
            </button>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-devflow-violet to-devflow-cyan text-white text-xs font-semibold shadow-lg shadow-devflow-violet/20 hover:brightness-110 transition-all"
          >
            <Plus size={16} />
            <span>New Software Project</span>
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => {
            const margin = p.budget - p.actualCost;
            const marginPct = p.budget > 0 ? Math.round((margin / p.budget) * 100) : 50;

            return (
              <div
                key={p.id}
                className="p-6 rounded-2xl bg-devflow-card border border-devflow-border hover:border-devflow-violet/50 transition-all shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-devflow-violet/15 text-devflow-violet border border-devflow-violet/30 uppercase tracking-wider">
                      {p.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-devflow-emerald/15 text-devflow-emerald border border-devflow-emerald/30">
                      {p.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{p.name}</h3>
                  <p className="text-xs text-devflow-cyan flex items-center gap-1.5 mb-3 font-medium">
                    <Building size={12} /> {p.clientName}
                  </p>
                  <p className="text-xs text-slate-300 mb-4 line-clamp-2">{p.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Milestone Progress</span>
                      <span className="font-bold text-white font-mono">{p.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-devflow-secondaryBg rounded-full h-2 overflow-hidden border border-devflow-border">
                      <div
                        className="h-full bg-gradient-to-r from-devflow-violet to-devflow-cyan rounded-full transition-all"
                        style={{ width: `${p.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Financials: Budget vs Actual Labor */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-devflow-secondaryBg border border-devflow-border text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Budget</span>
                      <span className="font-bold text-white font-mono">${p.budget?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Incurred Cost</span>
                      <span className="font-bold text-devflow-amber font-mono">${p.actualCost?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Gross Margin</span>
                      <span className="font-bold text-devflow-emerald font-mono">+{marginPct}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-devflow-border flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <User size={13} className="text-devflow-violet" />
                    <span>Lead: {p.projectManagerName || 'Elena Rostova'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Clock size={12} className="text-devflow-cyan" />
                    <span>Due: {p.targetDeliveryDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Gantt View */
        <div className="p-6 rounded-2xl bg-devflow-card border border-devflow-border space-y-6">
          <div className="flex items-center justify-between border-b border-devflow-border pb-3 text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Project Deliverable</span>
            <div className="flex items-center gap-8">
              <span>Timeline Window</span>
              <span>Completion</span>
            </div>
          </div>

          {projects.map((p) => (
            <div key={p.id} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white">{p.name} </span>
                  <span className="text-slate-400">({p.clientName})</span>
                </div>
                <div className="flex items-center gap-6 font-mono text-slate-300">
                  <span>{p.startDate} → {p.targetDeliveryDate}</span>
                  <span className="font-bold text-devflow-cyan w-10 text-right">{p.completionPercentage}%</span>
                </div>
              </div>
              <div className="w-full bg-devflow-secondaryBg h-4 rounded-full overflow-hidden border border-devflow-border p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-devflow-violet via-indigo-500 to-devflow-cyan rounded-full"
                  style={{ width: `${p.completionPercentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-devflow-card border border-devflow-border rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-4">Initialize Software Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Next-Gen Telehealth Web & Mobile Portal"
                  className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Client Account *</label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Project Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  >
                    <option value="SAAS_DEVELOPMENT">SaaS Development</option>
                    <option value="WEB_DEVELOPMENT">Web Development</option>
                    <option value="MOBILE_APP">Mobile Application</option>
                    <option value="AI_ML">AI / Machine Learning</option>
                    <option value="SOFTWARE_MAINTENANCE">Software Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Budget ($ USD)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Target Delivery Date</label>
                  <input
                    type="date"
                    value={targetDeliveryDate}
                    onChange={(e) => setTargetDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Technical Scope Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key architectural deliverables, stack components, and SLA targets..."
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
                  className="px-4 py-2 rounded-lg bg-devflow-violet text-white font-semibold hover:bg-devflow-violetHover transition-colors shadow-md shadow-devflow-violet/20"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
