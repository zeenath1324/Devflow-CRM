'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { apiFetch } from '../../lib/api';
import {
  Building2,
  Plus,
  Download,
  Search,
  ExternalLink,
  Mail,
  Phone,
  Activity,
  HeartPulse,
  ChevronRight,
  Filter,
} from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const loadClients = async () => {
    try {
      const data = await apiFetch<any[]>('/clients');
      setClients(data);
    } catch (e) {
      console.warn('Clients fallback data:', e);
      setClients([
        {
          id: 'cli-001',
          name: 'Apex Fintech Solutions',
          industry: 'Banking & Financial Software',
          website: 'https://apexfintech.io',
          primaryContactName: 'Sarah Jenkins',
          primaryContactEmail: 'client@fintech.io',
          primaryContactPhone: '+1-415-555-0199',
          status: 'ACTIVE',
          healthScore: 95,
          notes: 'Enterprise account. 2 Active engagements.',
        },
        {
          id: 'cli-002',
          name: 'BioHealth Dynamics',
          industry: 'HealthTech & AI Diagnostics',
          website: 'https://biohealth.ai',
          primaryContactName: 'Dr. Gregory House',
          primaryContactEmail: 'greg@biohealth.ai',
          primaryContactPhone: '+1-617-555-0144',
          status: 'ACTIVE',
          healthScore: 89,
          notes: 'HIPAA-compliant medical cloud migration.',
        },
      ]);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/clients', {
        method: 'POST',
        body: JSON.stringify({
          name,
          industry,
          website,
          primaryContactName: contactName,
          primaryContactEmail: contactEmail,
          primaryContactPhone: contactPhone,
          status: 'ACTIVE',
        }),
      });
      setModalOpen(false);
      setName('');
      setIndustry('');
      setWebsite('');
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      loadClients();
    } catch (err: any) {
      alert(`Error creating client: ${err.message}`);
    }
  };

  const filtered = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.primaryContactName.toLowerCase().includes(search.toLowerCase()) ||
      c.primaryContactEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase font-mono tracking-widest text-slate-400">
              Accounts & Portfolios
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Building2 className="text-devflow-violet" />
            Client Directory & Organization Accounts
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise client accounts, primary stakeholders, 0–100 health scoring, and active deliverables
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:4000/api/clients/export/csv"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-devflow-card border border-devflow-border text-xs text-slate-300 hover:text-white hover:border-devflow-violet transition-colors font-medium shadow-sm"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </a>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-devflow-violet via-indigo-600 to-devflow-cyan text-white text-xs font-bold shadow-lg shadow-devflow-violet/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus size={15} />
            <span>New Client Account</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-devflow-card border border-devflow-border mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company name, stakeholder, email..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-devflow-secondaryBg border border-devflow-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-devflow-violet font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-devflow-secondaryBg border border-devflow-border p-1 rounded-xl text-xs w-full md:w-auto">
          {['ALL', 'ACTIVE', 'LEAD', 'CHURNED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold transition-colors ${
                statusFilter === st ? 'bg-devflow-violet text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Modern Clients Table */}
      <div className="rounded-2xl bg-devflow-card border border-devflow-border overflow-hidden shadow-subtle-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-devflow-secondaryBg/80 text-slate-400 uppercase tracking-widest font-mono text-[10px] border-b border-devflow-border">
              <tr>
                <th className="py-3.5 px-5">Enterprise Company</th>
                <th className="py-3.5 px-5">Industry Domain</th>
                <th className="py-3.5 px-5">Primary Stakeholder</th>
                <th className="py-3.5 px-5">Client Health</th>
                <th className="py-3.5 px-5">Lifecycle Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-devflow-border/70">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-devflow-secondaryBg/40 transition-colors group">
                  <td className="py-4 px-5 font-bold text-white flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-devflow-violet/15 text-devflow-violet font-black flex items-center justify-center border border-devflow-violet/25 font-mono shadow-sm">
                      {c.name.substring(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <div className="text-white text-xs font-bold group-hover:text-devflow-cyan transition-colors">
                        {c.name}
                      </div>
                      {c.website && (
                        <a
                          href={c.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-slate-400 hover:text-devflow-cyan flex items-center gap-1 font-mono mt-0.5"
                        >
                          {c.website.replace('https://', '')} <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-5 text-slate-300 font-medium">{c.industry || 'Tech / Software'}</td>
                  <td className="py-4 px-5">
                    <div className="font-bold text-white text-xs">{c.primaryContactName}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                      <span className="flex items-center gap-1"><Mail size={11} className="text-slate-500" /> {c.primaryContactEmail}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <HeartPulse size={14} className={c.healthScore >= 90 ? 'text-devflow-emerald' : 'text-devflow-amber'} />
                      <span className="font-bold text-white font-mono">{c.healthScore}/100</span>
                    </div>
                    <div className="w-28 bg-devflow-secondaryBg rounded-full h-1.5 mt-1.5 overflow-hidden border border-devflow-border/60">
                      <div
                        className={`h-full rounded-full ${c.healthScore >= 90 ? 'bg-devflow-emerald' : 'bg-devflow-amber'}`}
                        style={{ width: `${c.healthScore}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-devflow-emerald/15 text-devflow-emerald border border-devflow-emerald/30">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button className="text-devflow-violet hover:text-devflow-violetGlow font-bold text-xs font-mono inline-flex items-center gap-1">
                      <span>Inspect Profile</span>
                      <ChevronRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Client Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-devflow-card border border-devflow-border rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-4">Create New Client Account</h3>
            <form onSubmit={handleCreateClient} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Company / Organization Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Cloud Systems"
                  className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-xl text-white focus:outline-none focus:border-devflow-violet"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. FinTech, Healthcare"
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-xl text-white focus:outline-none focus:border-devflow-violet"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-xl text-white focus:outline-none focus:border-devflow-violet"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Primary Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-xl text-white focus:outline-none focus:border-devflow-violet"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Contact Email *</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-xl text-white focus:outline-none focus:border-devflow-violet"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-devflow-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-devflow-secondaryBg text-slate-300 hover:bg-slate-800 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-devflow-violet text-white font-bold hover:bg-devflow-violetHover transition-colors shadow-md shadow-devflow-violet/20"
                >
                  Create Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
