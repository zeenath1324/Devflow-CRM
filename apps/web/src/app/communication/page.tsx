'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { apiFetch } from '../../lib/api';
import {
  MessageSquare,
  Plus,
  User,
  Clock,
  FolderGit2,
  Send,
} from 'lucide-react';

export default function CommunicationPage() {
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const loadDiscussions = async () => {
    try {
      const data = await apiFetch<any[]>('/communication/discussions');
      setDiscussions(data);
    } catch (e) {
      console.warn('Discussions fallback data:', e);
      setDiscussions([
        {
          id: 'disc-1',
          projectName: 'Apex Core Banking Platform V2',
          author: 'Elena Rostova',
          authorRole: 'Project Manager',
          title: 'Sprint 04 Scope Freeze & Release Readiness',
          content: 'All critical path tasks for Redis cluster failover and WebSocket backpressure have been committed. QA regression run scheduled for 18:00 UTC.',
          createdAt: '2 hours ago',
          repliesCount: 4,
        },
        {
          id: 'disc-2',
          projectName: 'BioHealth Cloud EHR Connector',
          author: 'Alex Chen',
          authorRole: 'Senior Engineer',
          title: 'FHIR v4 DiagnosticReport Resource Mapping Review',
          content: 'Uploaded new schema transformation specs for laboratory findings and Gemini inference summaries. Reviewers requested.',
          createdAt: '1 day ago',
          repliesCount: 2,
        },
      ]);
    }
  };

  useEffect(() => {
    loadDiscussions();
  }, []);

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/communication/discussions', {
        method: 'POST',
        body: JSON.stringify({
          title,
          content,
          projectName: 'Apex Core Banking Platform V2',
        }),
      });
      setModalOpen(false);
      setTitle('');
      setContent('');
      loadDiscussions();
    } catch (err: any) {
      alert(`Error creating post: ${err.message}`);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <MessageSquare className="text-devflow-violet" />
            Communication Hub & Engineering Discussions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            RFCs, sprint standup notes, technical decision records, and project discussions
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-devflow-violet to-devflow-cyan text-white text-xs font-semibold shadow-lg shadow-devflow-violet/20 hover:brightness-110 transition-all"
        >
          <Plus size={16} />
          <span>New Technical Discussion</span>
        </button>
      </div>

      <div className="space-y-4">
        {discussions.map((d) => (
          <div key={d.id} className="p-5 rounded-2xl bg-devflow-card border border-devflow-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-devflow-cyan/15 text-devflow-cyan border border-devflow-cyan/30">
                {d.projectName}
              </span>
              <span className="text-xs text-slate-500 font-mono">{d.createdAt}</span>
            </div>

            <h3 className="text-base font-bold text-white mb-2">{d.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">{d.content}</p>

            <div className="flex items-center justify-between pt-3 border-t border-devflow-border text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{d.author}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-devflow-secondaryBg text-slate-400">
                  {d.authorRole}
                </span>
              </div>
              <button
                onClick={() => alert('Reply dialog opened')}
                className="text-devflow-violet hover:underline font-semibold"
              >
                {d.repliesCount || 0} Replies • Join Discussion
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-devflow-card border border-devflow-border rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-4">Start Engineering Discussion</h3>
            <form onSubmit={handleCreateDiscussion} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Topic Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Architecture RFC: Zero-Downtime Database Migration Strategy"
                  className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Discussion Content *</label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Outline context, trade-offs, and proposed solutions..."
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
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
