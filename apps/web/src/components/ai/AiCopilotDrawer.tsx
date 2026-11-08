'use client';

import React, { useState } from 'react';
import { apiFetch } from '../../lib/api';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User as UserIcon,
  Loader2,
  TrendingUp,
  AlertTriangle,
  FileText,
  DollarSign,
} from 'lucide-react';

interface AiCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export function AiCopilotDrawer({ isOpen, onClose }: AiCopilotDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "👋 Hello! I am your **DevFlow AI Business Copilot**, directly integrated with your live software development workflows.\n\nAsk me anything regarding project timelines, high-velocity leads, client budgets, or proposal drafts.",
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const data: any = await apiFetch('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: textToSend }),
      });

      const assistantMsg: Message = {
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: `⚠️ **Unable to complete AI inference**: ${err.message || 'Check backend connection.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'Delayed Projects?', icon: AlertTriangle, prompt: 'Which projects are delayed?' },
    { label: 'Follow-up Leads', icon: TrendingUp, prompt: 'Show all leads that need follow-up.' },
    { label: 'Budget Exceeded?', icon: DollarSign, prompt: 'Which projects have exceeded their estimated budget?' },
    { label: 'Draft Proposal', icon: FileText, prompt: 'Generate a proposal for this client.' },
    { label: 'Summarize Apex Project', icon: Sparkles, prompt: 'Summarize the progress of Project Apex Core Banking Platform.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg h-full bg-devflow-card border-l border-devflow-border flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-devflow-border flex items-center justify-between bg-devflow-bg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-devflow-violet to-devflow-cyan text-white shadow-md">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                DevFlow AI Copilot
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-devflow-violet/20 text-devflow-violet font-semibold">
                  Gemini Flash 2.5
                </span>
              </h3>
              <p className="text-xs text-slate-400">Context-grounded agency intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-devflow-secondaryBg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-3 bg-devflow-secondaryBg border-b border-devflow-border">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">Suggested Actions</div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp, idx) => {
              const Icon = qp.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(qp.prompt)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-devflow-card hover:bg-devflow-violet/20 hover:text-devflow-violet border border-devflow-border text-slate-300 transition-colors"
                >
                  <Icon size={12} className="text-devflow-cyan" />
                  <span>{qp.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-devflow-violet/20 text-devflow-violet flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={15} />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-devflow-violet text-white rounded-tr-none shadow-md shadow-devflow-violet/20'
                    : 'bg-devflow-secondaryBg border border-devflow-border text-slate-200 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {m.text}
                <div className={`mt-1.5 text-[9px] ${m.sender === 'user' ? 'text-violet-200' : 'text-slate-500'} text-right`}>
                  {m.timestamp}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-devflow-secondaryBg border border-devflow-border text-slate-300 flex items-center justify-center flex-shrink-0 mt-1">
                  <UserIcon size={14} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <Loader2 size={16} className="animate-spin text-devflow-cyan" />
              <span>Analyzing live tenant telemetry...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-devflow-border bg-devflow-bg flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask DevFlow Copilot about projects, revenue, leads..."
            className="flex-1 bg-devflow-secondaryBg border border-devflow-border rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-devflow-violet transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="p-2 rounded-xl bg-gradient-to-r from-devflow-violet to-devflow-cyan text-white hover:brightness-110 disabled:opacity-40 transition-all flex-shrink-0"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
