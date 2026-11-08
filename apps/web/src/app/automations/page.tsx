'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { apiFetch } from '../../lib/api';
import {
  Cpu,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
  Mail,
  FolderGit2,
  Bell,
  Code,
} from 'lucide-react';

export default function AutomationsPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState('DEAL_WON');
  const [actionType, setActionType] = useState('CREATE_PROJECT');

  const loadWorkflows = async () => {
    try {
      const data = await apiFetch<any[]>('/automation');
      setWorkflows(data);
    } catch (e) {
      console.warn('Workflows fallback data:', e);
      setWorkflows([
        {
          id: 'wf-001',
          name: 'Deal Won → Auto-create Project & Alert Team',
          description: 'When any sales deal reaches CLOSED_WON, automatically instantiate project workspace and notify project leads.',
          triggerType: 'DEAL_WON',
          conditions: [{ field: 'value', operator: 'gte', value: 10000 }],
          actionType: 'CREATE_PROJECT',
          isActive: true,
        },
        {
          id: 'wf-002',
          name: 'Invoice Overdue → Automated Payment Reminder',
          description: 'Send automated email reminder to client billing contact 3 days after due date.',
          triggerType: 'INVOICE_OVERDUE',
          conditions: [{ field: 'daysOverdue', operator: 'gte', value: 3 }],
          actionType: 'SEND_EMAIL',
          isActive: true,
        },
      ]);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, []);

  const handleToggle = async (wfId: string) => {
    try {
      await apiFetch(`/automation/${wfId}/toggle`, { method: 'PATCH' });
      loadWorkflows();
    } catch (err: any) {
      alert(`Error toggling rule: ${err.message}`);
    }
  };

  const handleTestRun = async (wfId: string) => {
    try {
      const res: any = await apiFetch(`/automation/${wfId}/test`, { method: 'POST' });
      setTestResult(res);
    } catch (err: any) {
      alert(`Error running test: ${err.message}`);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/automation', {
        method: 'POST',
        body: JSON.stringify({
          name,
          description,
          triggerType,
          actionType,
          conditions: [{ field: 'status', operator: 'eq', value: 'TRIGGERED' }],
        }),
      });
      setModalOpen(false);
      setName('');
      setDescription('');
      loadWorkflows();
    } catch (err: any) {
      alert(`Error creating rule: ${err.message}`);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Cpu className="text-devflow-cyan" />
            Visual Workflow Automation Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build event-driven triggers, conditional business rules, and autonomous background automations
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-devflow-violet to-devflow-cyan text-white text-xs font-semibold shadow-lg shadow-devflow-violet/20 hover:brightness-110 transition-all"
        >
          <Plus size={16} />
          <span>New Automation Rule</span>
        </button>
      </div>

      {/* Rules Grid */}
      <div className="space-y-4 mb-8">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className="p-6 rounded-2xl bg-devflow-card border border-devflow-border hover:border-devflow-violet/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    wf.isActive ? 'bg-devflow-emerald shadow-sm shadow-devflow-emerald' : 'bg-slate-600'
                  }`}
                ></span>
                <h3 className="font-bold text-sm text-white">{wf.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-devflow-secondaryBg border border-devflow-border text-slate-400">
                  {wf.isActive ? 'ACTIVE' : 'PAUSED'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-4">{wf.description}</p>

              {/* Visual Pipeline Block */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-devflow-secondaryBg border border-devflow-border text-devflow-cyan font-mono font-semibold">
                  <Zap size={13} />
                  <span>Trigger: {wf.triggerType}</span>
                </div>

                <ArrowRight size={14} className="text-slate-500" />

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-devflow-secondaryBg border border-devflow-border text-devflow-violet font-mono font-semibold">
                  <Code size={13} />
                  <span>Condition: Evaluated True</span>
                </div>

                <ArrowRight size={14} className="text-slate-500" />

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-devflow-secondaryBg border border-devflow-border text-devflow-emerald font-mono font-semibold">
                  <CheckCircle2 size={13} />
                  <span>Action: {wf.actionType}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <button
                onClick={() => handleTestRun(wf.id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-devflow-secondaryBg border border-devflow-border text-xs text-white hover:border-devflow-cyan hover:text-devflow-cyan transition-colors"
              >
                <Play size={13} />
                <span>Test Run</span>
              </button>

              <button
                onClick={() => handleToggle(wf.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  wf.isActive
                    ? 'bg-devflow-rose/15 text-devflow-rose hover:bg-devflow-rose/25'
                    : 'bg-devflow-emerald/15 text-devflow-emerald hover:bg-devflow-emerald/25'
                }`}
              >
                {wf.isActive ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Test Execution Result Console */}
      {testResult && (
        <div className="p-5 rounded-2xl bg-devflow-card border border-devflow-border mb-8 animate-in fade-in">
          <div className="flex items-center justify-between mb-3 border-b border-devflow-border pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-devflow-emerald"></span>
              <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                Execution Simulator Result: {testResult.workflowName}
              </h3>
            </div>
            <button
              onClick={() => setTestResult(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>

          <div className="font-mono text-[11px] text-slate-300 space-y-1 bg-devflow-secondaryBg p-3.5 rounded-xl border border-devflow-border">
            {testResult.logs?.map((l: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-devflow-cyan">›</span>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Workflow Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-devflow-card border border-devflow-border rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-4">Create Workflow Automation</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Rule Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Milestone Approved → Notify Client & Finance"
                  className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Trigger Event</label>
                  <select
                    value={triggerType}
                    onChange={(e) => setTriggerType(e.target.value)}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  >
                    <option value="DEAL_WON">Deal Marked Won</option>
                    <option value="TASK_OVERDUE">Task Overdue</option>
                    <option value="INVOICE_OVERDUE">Invoice Overdue</option>
                    <option value="MILESTONE_APPROVED">Milestone Approved</option>
                    <option value="LEAD_CREATED">New Inbound Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Autonomous Action</label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value)}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  >
                    <option value="CREATE_PROJECT">Instantiate Project Shell</option>
                    <option value="SEND_EMAIL">Dispatch Email Notification</option>
                    <option value="ASSIGN_TASK">Assign Urgent Remediation Task</option>
                    <option value="SEND_NOTIFICATION">Broadcast Slack / In-App Alert</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain when and why this rule should execute..."
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
                  Save Automation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
