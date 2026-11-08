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
} from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
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

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.primaryContactName.toLowerCase().includes(search.toLowerCase()) ||
      c.primaryContactEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Building2 className="text-devflow-violet" />
            Client Directory & Accounts
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise clients, primary stakeholders, health scoring, and active contract profiles
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:4000/api/clients/export/csv"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-devflow-card border border-devflow-border text-xs text-slate-300 hover:text-white hover:border-devflow-violet transition-colors"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </a>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-devflow-violet to-devflow-cyan text-white text-xs font-semibold shadow-lg shadow-devflow-violet/20 hover:brightness-110 transition-all"
          >
            <Plus size={16} />
            <span>New Client Account</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-devflow-card border border-devflow-border mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client company name, contact, email..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-devflow-secondaryBg border border-devflow-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-devflow-violet"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="rounded-2xl bg-devflow-card border border-devflow-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-devflow-secondaryBg text-slate-400 uppercase tracking-wider font-semibold border-b border-devflow-border">
              <tr>
                <th className="py-3.5 px-4">Company Name</th>
                <th className="py-3.5 px-4">Industry</th>
                <th className="py-3.5 px-4">Primary Contact</th>
                <th className="py-3.5 px-4">Client Health</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-devflow-border">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-devflow-secondaryBg/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-devflow-violet/15 text-devflow-violet font-black flex items-center justify-center">
                      {c.name.substring(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <div>{c.name}</div>
                      {c.website && (
                        <a
                          href={c.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-devflow-cyan hover:underline flex items-center gap-1 font-normal"
                        >
                          {c.website.replace('https://', '')} <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-300">{c.industry || 'Tech / Software'}</td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-white">{c.primaryContactName}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1"><Mail size={11} /> {c.primaryContactEmail}</span>
                      {c.primaryContactPhone && (
                        <span className="flex items-center gap-1"><Phone size={11} /> {c.primaryContactPhone}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <HeartPulse size={15} className={c.healthScore >= 90 ? 'text-devflow-emerald' : 'text-devflow-amber'} />
                      <span className="font-bold text-white">{c.healthScore}/100</span>
                    </div>
                    <div className="w-24 bg-devflow-secondaryBg rounded-full h-1.5 mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${c.healthScore >= 90 ? 'bg-devflow-emerald' : 'bg-devflow-amber'}`}
                        style={{ width: `${c.healthScore}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-devflow-emerald/15 text-devflow-emerald border border-devflow-emerald/30">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-devflow-violet hover:underline font-semibold">
                      View Profile
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
                  className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
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
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
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
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
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
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  />
                </div>
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
