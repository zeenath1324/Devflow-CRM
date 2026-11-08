'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { apiFetch } from '../../lib/api';
import {
  CheckSquare,
  Plus,
  Bug,
  Clock,
  User,
  AlertTriangle,
  FolderGit2,
  Filter,
} from 'lucide-react';

const COLUMNS = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'CODE_REVIEW', title: 'Code Review' },
  { id: 'IN_TESTING', title: 'QA & Testing' },
  { id: 'DONE', title: 'Completed' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('ALL');

  // Form state
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [type, setType] = useState('TASK');
  const [priority, setPriority] = useState('HIGH');
  const [estimatedHours, setEstimatedHours] = useState(12);
  const [description, setDescription] = useState('');

  const loadData = async () => {
    try {
      const [taskData, projData] = await Promise.all([
        apiFetch<any[]>('/tasks'),
        apiFetch<any[]>('/projects'),
      ]);
      setTasks(taskData);
      setProjects(projData);
      if (projData.length > 0) setProjectId(projData[0].id);
    } catch (e) {
      console.warn('Tasks fallback data:', e);
      setTasks([
        {
          id: 'task-001',
          projectId: 'proj-001',
          projectName: 'Apex Core Banking Platform V2',
          title: 'Implement Redis Pub/Sub WebSocket Order Stream',
          description: 'Broadcast market book updates to subscribed UI clients with backpressure control.',
          type: 'TASK',
          priority: 'HIGH',
          status: 'IN_PROGRESS',
          estimatedHours: 16,
          actualHours: 8,
          assigneeName: 'Alex Chen',
          dueDate: '2026-03-20',
        },
        {
          id: 'task-002',
          projectId: 'proj-001',
          projectName: 'Apex Core Banking Platform V2',
          title: 'Resolve race condition during concurrent order cancellations',
          description: 'P1: Two simultaneous cancel requests occasionally result in unhandled lock error.',
          type: 'BUG',
          priority: 'URGENT',
          status: 'TODO',
          estimatedHours: 8,
          actualHours: 0,
          assigneeName: 'Alex Chen',
          dueDate: '2026-03-18',
        },
        {
          id: 'task-003',
          projectId: 'proj-002',
          projectName: 'BioHealth Cloud EHR Connector',
          title: 'Configure HIPAA Audit Logging Interceptor',
          description: 'Emit structured JSON logs for all read/write patient encounters.',
          type: 'TASK',
          priority: 'MEDIUM',
          status: 'DONE',
          estimatedHours: 12,
          actualHours: 11,
          assigneeName: 'Alex Chen',
          dueDate: '2026-03-08',
        },
      ]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await apiFetch(`/tasks/${taskId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      loadData();
    } catch (err: any) {
      alert(`Error updating task status: ${err.message}`);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title,
          projectId: projectId || projects[0]?.id || 'proj-001',
          type,
          priority,
          status: 'TODO',
          estimatedHours: Number(estimatedHours),
          description,
        }),
      });
      setModalOpen(false);
      setTitle('');
      setDescription('');
      loadData();
    } catch (err: any) {
      alert(`Error creating task: ${err.message}`);
    }
  };

  const filteredTasks = tasks.filter((t) => (filterType === 'ALL' ? true : t.type === filterType));

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <CheckSquare className="text-devflow-cyan" />
            Agile Kanban Board & Issue Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sprint backlogs, engineering tasks, P1 bug fixes, and hourly estimation tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-devflow-secondaryBg border border-devflow-border p-1 rounded-xl text-xs">
            {['ALL', 'TASK', 'BUG', 'FEATURE_REQUEST'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  filterType === f ? 'bg-devflow-violet text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-devflow-violet to-devflow-cyan text-white text-xs font-semibold shadow-lg shadow-devflow-violet/20 hover:brightness-110 transition-all"
          >
            <Plus size={16} />
            <span>Create Task / Bug</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 overflow-x-auto pb-6">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-devflow-secondaryBg/60 border border-devflow-border rounded-2xl p-3 flex flex-col min-w-[220px]"
            >
              <div className="flex items-center justify-between mb-3 border-b border-devflow-border pb-2.5">
                <span className="text-xs font-bold text-white tracking-wide">{col.title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-devflow-card border border-devflow-border text-slate-300">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Items */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[650px]">
                {colTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-xl bg-devflow-card border border-devflow-border hover:border-devflow-violet/50 transition-all shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider ${
                          t.type === 'BUG'
                            ? 'bg-devflow-rose/20 text-devflow-rose border border-devflow-rose/30'
                            : 'bg-devflow-cyan/15 text-devflow-cyan border border-devflow-cyan/30'
                        }`}
                      >
                        {t.type === 'BUG' ? <Bug size={10} /> : <CheckSquare size={10} />}
                        {t.type}
                      </span>

                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          t.priority === 'URGENT'
                            ? 'bg-devflow-rose/20 text-devflow-rose'
                            : t.priority === 'HIGH'
                            ? 'bg-devflow-amber/20 text-devflow-amber'
                            : 'bg-devflow-violet/20 text-devflow-violet'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white mb-1 leading-snug">{t.title}</h4>
                    <p className="text-[11px] text-slate-400 mb-2 line-clamp-2">{t.description}</p>
                    <p className="text-[10px] text-devflow-cyan flex items-center gap-1 mb-2">
                      <FolderGit2 size={10} /> {t.projectName}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-2">
                      <span className="flex items-center gap-1">
                        <User size={11} className="text-slate-500" /> {t.assigneeName || 'Alex Chen'}
                      </span>
                      <span>
                        {t.actualHours || 0} / {t.estimatedHours}h
                      </span>
                    </div>

                    {/* Quick Move Dropdown */}
                    <div className="pt-2 border-t border-devflow-border flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">Move to:</span>
                      <select
                        value={t.status}
                        onChange={(e) => handleStatusChange(t.id, e.target.value)}
                        className="bg-devflow-secondaryBg text-slate-300 text-[10px] border border-devflow-border rounded px-1.5 py-0.5"
                      >
                        {COLUMNS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="text-center py-8 text-slate-600 text-xs italic">
                    No items in this status
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-devflow-card border border-devflow-border rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-4">Create Task or Bug Report</h3>
            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Title / Issue Summary *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. WebSocket connection handshake timeout under load"
                  className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Target Project *</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Issue Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  >
                    <option value="TASK">Engineering Task</option>
                    <option value="BUG">Defect / Bug</option>
                    <option value="FEATURE_REQUEST">Feature Request</option>
                    <option value="IMPROVEMENT">Performance / Refactor</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">P1 Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Reproduction Steps / Task Specs</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Expected behavior, error logs, and acceptance criteria..."
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
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
