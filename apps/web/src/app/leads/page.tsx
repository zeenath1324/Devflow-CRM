'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { apiFetch } from '../../lib/api';
import {
  Target,
  Plus,
  ArrowRightLeft,
  DollarSign,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Sparkles,
  Search,
} from 'lucide-react';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState('CLUTCH');
  const [estimatedValue, setEstimatedValue] = useState(45000);

  const loadLeads = async () => {
    try {
      const data = await apiFetch<any[]>('/leads');
      setLeads(data);
    } catch (e) {
      console.warn('Leads fallback data:', e);
      setLeads([
        {
          id: 'lead-001',
          title: 'Global Logistics Dispatch Web & Mobile App',
          companyName: 'TransGlobal Freight',
          contactName: 'David Sterling',
          email: 'dsterling@transglobal.com',
          phone: '+1-312-555-0178',
          source: 'CLUTCH',
          estimatedValue: 65000,
          score: 88,
          status: 'QUALIFIED',
          notes: 'Wants modern fleet tracking with offline React Native sync.',
        },
        {
          id: 'lead-002',
          title: 'AI Diagnostic Mobile Assistant for Radiologists',
          companyName: 'NeuroScan Inc',
          contactName: 'Lisa Cuddy',
          email: 'lcuddy@neuroscan.med',
          source: 'WEBSITE',
          estimatedValue: 95000,
          score: 94,
          status: 'PROPOSAL_SENT',
          notes: 'High urgency. Proposal submitted on March 5th.',
        },
      ]);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/leads', {
        method: 'POST',
        body: JSON.stringify({
          title,
          companyName,
          contactName,
          email,
          source,
          estimatedValue: Number(estimatedValue),
          status: 'NEW',
        }),
      });
      setModalOpen(false);
      setTitle('');
      setCompanyName('');
      setContactName('');
      setEmail('');
      loadLeads();
    } catch (err: any) {
      alert(`Error creating lead: ${err.message}`);
    }
  };

  const handleConvertLead = async (leadId: string) => {
    if (!confirm('Convert this qualified lead directly into an active Client Account and Sales Pipeline Deal?')) return;
    try {
      const res: any = await apiFetch(`/leads/${leadId}/convert`, { method: 'POST' });
      alert(`Success! Created client "${res.client.name}" and deal "${res.deal.title}" ($${res.deal.value.toLocaleString()})`);
      loadLeads();
    } catch (err: any) {
      alert(`Conversion failed: ${err.message}`);
    }
  };

  const filtered = leads.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.contactName.toLowerCase().includes(search.toLowerCase()) ||
      (l.companyName && l.companyName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Target className="text-devflow-cyan" />
            Lead Management & Conversion Funnel
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Capture prospective software engagements, compute automated lead scores, and convert to deals
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-devflow-violet to-devflow-cyan text-white text-xs font-semibold shadow-lg shadow-devflow-violet/20 hover:brightness-110 transition-all"
        >
          <Plus size={16} />
          <span>Capture Inbound Lead</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-devflow-card border border-devflow-border mb-6">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by scope, project title, company, or contact..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-devflow-secondaryBg border border-devflow-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-devflow-violet"
          />
        </div>
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((l) => (
          <div
            key={l.id}
            className="p-5 rounded-2xl bg-devflow-card border border-devflow-border hover:border-devflow-cyan/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-devflow-cyan/15 text-devflow-cyan border border-devflow-cyan/30 uppercase tracking-wider">
                  Source: {l.source}
                </span>

                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-devflow-violet/15 text-devflow-violet border border-devflow-violet/30 text-xs font-bold">
                  <Sparkles size={12} />
                  <span>Score: {l.score}/100</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white mb-1">{l.title}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-3">
                <Building size={12} className="text-slate-500" />
                <span>{l.companyName || 'Private Inquiry'}</span>
              </p>

              <div className="p-3 rounded-xl bg-devflow-secondaryBg border border-devflow-border text-xs text-slate-300 space-y-1 mb-4">
                <div className="font-semibold text-white">{l.contactName}</div>
                <div className="text-slate-400 flex items-center gap-2">
                  <span className="flex items-center gap-1"><Mail size={11} /> {l.email}</span>
                  {l.phone && <span className="flex items-center gap-1"><Phone size={11} /> {l.phone}</span>}
                </div>
                {l.notes && <div className="text-[11px] text-slate-500 pt-1 italic">{l.notes}</div>}
              </div>
            </div>

            <div className="pt-3 border-t border-devflow-border flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-semibold block">Est. Deal Value</span>
                <span className="text-sm font-black text-devflow-emerald">
                  ${l.estimatedValue?.toLocaleString()}
                </span>
              </div>

              {l.status === 'CONVERTED' ? (
                <span className="flex items-center gap-1 text-xs text-devflow-emerald font-bold">
                  <CheckCircle2 size={14} /> Converted to Deal
                </span>
              ) : (
                <button
                  onClick={() => handleConvertLead(l.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-devflow-violet to-devflow-cyan text-white text-xs font-semibold hover:brightness-110 shadow-sm"
                >
                  <ArrowRightLeft size={13} />
                  <span>Convert to Deal</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Lead Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-devflow-card border border-devflow-border rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-4">Capture Prospective Inbound Lead</h3>
            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Opportunity / Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next.js SaaS Web App Modernization"
                  className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Horizon Labs"
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Rachel Adams"
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rachel@horizon.io"
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Lead Source</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  >
                    <option value="CLUTCH">Clutch</option>
                    <option value="WEBSITE">Website Inbound</option>
                    <option value="REFERRAL">Client Referral</option>
                    <option value="LINKEDIN">LinkedIn</option>
                    <option value="UPWORK">Upwork Enterprise</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Estimated Budget ($ USD)</label>
                <input
                  type="number"
                  value={estimatedValue}
                  onChange={(e) => setEstimatedValue(Number(e.target.value))}
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
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
