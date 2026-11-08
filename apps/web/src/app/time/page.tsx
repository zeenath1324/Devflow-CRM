'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { apiFetch } from '../../lib/api';
import {
  Clock,
  Play,
  Square,
  Plus,
  Calendar,
  CheckCircle2,
  FolderGit2,
  DollarSign,
} from 'lucide-react';

export default function TimeTrackingPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Live Timer
  const [isRunning, setIsRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Form
  const [projectId, setProjectId] = useState('');
  const [hours, setHours] = useState(2.5);
  const [isBillable, setIsBillable] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const loadData = async () => {
    try {
      const [timeData, projData] = await Promise.all([
        apiFetch<any[]>('/time'),
        apiFetch<any[]>('/projects'),
      ]);
      setLogs(timeData);
      setProjects(projData);
      if (projData.length > 0) setProjectId(projData[0].id);
    } catch (e) {
      console.warn('Time fallback data:', e);
      setLogs([
        {
          id: 'time-001',
          userName: 'Alex Chen',
          projectName: 'Apex Core Banking Platform V2',
          hours: 4.5,
          isBillable: true,
          date: '2026-03-12',
          description: 'WebSocket protocol framing and ping/pong heartbeat implementation',
        },
        {
          id: 'time-002',
          userName: 'Alex Chen',
          projectName: 'Apex Core Banking Platform V2',
          hours: 3.5,
          isBillable: true,
          date: '2026-03-13',
          description: 'Redis cluster backpressure tuning under synthetic load',
        },
      ]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/time', {
        method: 'POST',
        body: JSON.stringify({
          projectId: projectId || projects[0]?.id || 'proj-001',
          hours: Number(hours),
          isBillable,
          date,
          description,
        }),
      });
      setModalOpen(false);
      setDescription('');
      loadData();
    } catch (err: any) {
      alert(`Error logging time: ${err.message}`);
    }
  };

  const handleStopAndSaveTimer = async () => {
    setIsRunning(false);
    const hrs = Math.max(0.25, parseFloat((timerSeconds / 3600).toFixed(2)));
    try {
      await apiFetch('/time', {
        method: 'POST',
        body: JSON.stringify({
          projectId: projectId || projects[0]?.id || 'proj-001',
          hours: hrs,
          isBillable: true,
          date: new Date().toISOString().split('T')[0],
          description: 'Logged via Live Stopwatch Timer',
        }),
      });
      setTimerSeconds(0);
      loadData();
    } catch (err: any) {
      alert(`Error saving timer: ${err.message}`);
    }
  };

  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalHours = logs.reduce((acc, l) => acc + (l.hours || 0), 0);
  const billableHours = logs.filter((l) => l.isBillable).reduce((acc, l) => acc + (l.hours || 0), 0);

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Clock className="text-devflow-cyan" />
            Time Tracking & Billable Timesheets
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live engineer stopwatch, client billing logs, and project labor margin synchronization
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-devflow-violet to-devflow-cyan text-white text-xs font-semibold shadow-lg shadow-devflow-violet/20 hover:brightness-110 transition-all"
        >
          <Plus size={16} />
          <span>Manual Entry</span>
        </button>
      </div>

      {/* Live Timer Widget Banner */}
      <div className="p-6 rounded-2xl bg-devflow-card border border-devflow-border mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-devflow-violet/15 text-devflow-violet border border-devflow-violet/30">
            <Clock size={28} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Active Stopwatch Tracker</h3>
            <p className="text-xs text-slate-400">Target Project: Apex Core Banking Platform V2</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-3xl font-black font-mono text-white tracking-widest">
            {formatTimer(timerSeconds)}
          </div>

          <div className="flex items-center gap-2">
            {!isRunning ? (
              <button
                onClick={() => setIsRunning(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-devflow-emerald text-white text-xs font-bold hover:brightness-110 transition-all shadow-md shadow-devflow-emerald/20"
              >
                <Play size={15} />
                <span>Start Timer</span>
              </button>
            ) : (
              <button
                onClick={handleStopAndSaveTimer}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-devflow-rose text-white text-xs font-bold hover:brightness-110 transition-all shadow-md shadow-devflow-rose/20"
              >
                <Square size={15} />
                <span>Stop & Commit</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-devflow-secondaryBg border border-devflow-border">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Logged Hours</span>
          <span className="text-xl font-black text-white font-mono">{totalHours.toFixed(1)} hrs</span>
        </div>
        <div className="p-4 rounded-xl bg-devflow-secondaryBg border border-devflow-border">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Client Billable</span>
          <span className="text-xl font-black text-devflow-emerald font-mono">{billableHours.toFixed(1)} hrs</span>
        </div>
        <div className="p-4 rounded-xl bg-devflow-secondaryBg border border-devflow-border">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Billable Efficiency</span>
          <span className="text-xl font-black text-devflow-cyan font-mono">
            {totalHours > 0 ? Math.round((billableHours / totalHours) * 100) : 100}%
          </span>
        </div>
      </div>

      {/* Time Logs Table */}
      <div className="rounded-2xl bg-devflow-card border border-devflow-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-devflow-secondaryBg text-slate-400 uppercase tracking-wider font-semibold border-b border-devflow-border">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Engineer</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4 text-right">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-devflow-border">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-devflow-secondaryBg/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-300">{l.date}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{l.userName}</td>
                  <td className="py-3.5 px-4 text-devflow-cyan font-medium">{l.projectName}</td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">{l.description}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        l.isBillable
                          ? 'bg-devflow-emerald/15 text-devflow-emerald border border-devflow-emerald/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {l.isBillable ? 'BILLABLE' : 'INTERNAL'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-white font-mono">
                    {l.hours} hrs
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Time Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-devflow-card border border-devflow-border rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-4">Manual Timesheet Entry</h3>
            <form onSubmit={handleCreateLog} className="space-y-4 text-xs">
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Hours Spent *</label>
                  <input
                    type="number"
                    step="0.25"
                    required
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="billable"
                  checked={isBillable}
                  onChange={(e) => setIsBillable(e.target.checked)}
                  className="rounded text-devflow-violet focus:ring-0"
                />
                <label htmlFor="billable" className="text-white cursor-pointer">
                  Mark as Client Billable Hour
                </label>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Work Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details of code implemented, refactored, or reviewed..."
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
                  Log Hours
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
