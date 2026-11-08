'use client';

import React, { useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { apiFetch } from '../../lib/api';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Loader2,
  TrendingUp,
  AlertTriangle,
  FileText,
  DollarSign,
  Cpu,
} from 'lucide-react';

export default function AiCopilotPage() {
  const [messages, setMessages] = useState<any[]>([
    {
      sender: 'assistant',
      text: "👋 Welcome to your dedicated **DevFlow AI Business Copilot Workstation**.\n\nI am directly connected to your tenant's live database—analyzing contracts, sprint velocity, invoice cash flow, and team allocations in real-time.\n\nSelect a recommended analysis below or ask any custom question.",
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (customText?: string) => {
    const text = customText || input;
    if (!text.trim() || loading) return;

    const userMsg = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const data: any = await apiFetch('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text }),
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: `⚠️ Inference error: ${err.message}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const templates = [
    { title: 'Project Schedule Audit', desc: 'Identify any deliverables at risk of slipping past deadlines', prompt: 'Which projects are delayed?' },
    { title: 'Sales Lead Prioritization', desc: 'Rank inbound leads by value and engagement score', prompt: 'Show all leads that need follow-up.' },
    { title: 'Labor Cost vs Budget', desc: 'Verify gross profit margins across active client projects', prompt: 'Which projects have exceeded their estimated budget?' },
    { title: 'Executive Proposal Generator', desc: 'Draft full scope, milestones, and investment terms', prompt: 'Generate a proposal for Apex Fintech.' },
  ];

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Sparkles className="text-devflow-violet" />
            Gemini AI Executive Business Copilot
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Context-grounded operational reasoning, proposal drafting, and predictive analytics
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl bg-devflow-card border border-devflow-border text-devflow-cyan font-mono">
          <Cpu size={14} />
          <span>Model: Gemini 2.5 Flash</span>
        </div>
      </div>

      {/* Suggested Prompt Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {templates.map((t, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(t.prompt)}
            className="p-4 rounded-xl bg-devflow-card border border-devflow-border hover:border-devflow-violet/50 text-left transition-all group"
          >
            <h4 className="font-bold text-xs text-white group-hover:text-devflow-violet transition-colors mb-1">
              {t.title}
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug">{t.desc}</p>
          </button>
        ))}
      </div>

      {/* Main Chat Workstation */}
      <div className="rounded-2xl bg-devflow-card border border-devflow-border h-[560px] flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-devflow-violet to-devflow-cyan text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                  <Bot size={16} />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-devflow-violet text-white rounded-tr-none shadow-md shadow-devflow-violet/20'
                    : 'bg-devflow-secondaryBg border border-devflow-border text-slate-200 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {m.text}
                <div className={`mt-2 text-[9px] ${m.sender === 'user' ? 'text-violet-200' : 'text-slate-500'} text-right`}>
                  {m.time}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-devflow-secondaryBg border border-devflow-border text-slate-300 flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={15} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-devflow-cyan p-2">
              <Loader2 size={16} className="animate-spin" />
              <span>Querying database telemetry & running Gemini inference...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-devflow-border bg-devflow-secondaryBg flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Copilot anything (e.g. Which projects are delayed? Draft a statement of work)..."
            className="flex-1 bg-devflow-card border border-devflow-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-devflow-violet transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-devflow-violet to-devflow-cyan text-white text-xs font-bold hover:brightness-110 disabled:opacity-40 transition-all flex items-center gap-2"
          >
            <Send size={14} />
            <span>Submit</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
