'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { apiFetch } from '../../lib/api';
import {
  Users2,
  Mail,
  Briefcase,
  Code2,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function TeamsPage() {
  const [team, setTeam] = useState<any[]>([]);

  useEffect(() => {
    async function loadTeam() {
      try {
        const data = await apiFetch<any[]>('/teams');
        setTeam(data);
      } catch (e) {
        console.warn('Team fallback data:', e);
        setTeam([
          {
            id: 'usr-owner-001',
            firstName: 'Marcus',
            lastName: 'Vance',
            email: 'owner@nexuslabs.dev',
            role: 'COMPANY_OWNER',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop',
            department: 'Executive',
            jobTitle: 'Managing Partner / Principal Architect',
            hourlyRate: 150,
            skills: ['Distributed Systems', 'Cloud Strategy', 'Go', 'TypeScript'],
            activeTaskCount: 2,
            workloadHours: 25,
            availabilityStatus: 'AVAILABLE',
          },
          {
            id: 'usr-pm-002',
            firstName: 'Elena',
            lastName: 'Rostova',
            email: 'pm@nexuslabs.dev',
            role: 'PROJECT_MANAGER',
            avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop',
            department: 'Delivery',
            jobTitle: 'Senior Technical Project Manager',
            hourlyRate: 95,
            skills: ['Agile / Scrum', 'Jira / Linear', 'Risk Mitigation', 'SLA Control'],
            activeTaskCount: 4,
            workloadHours: 35,
            availabilityStatus: 'AVAILABLE',
          },
          {
            id: 'usr-dev-003',
            firstName: 'Alex',
            lastName: 'Chen',
            email: 'dev@nexuslabs.dev',
            role: 'DEVELOPER',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop',
            department: 'Core Engineering',
            jobTitle: 'Lead Full-Stack Engineer',
            hourlyRate: 85,
            skills: ['TypeScript', 'Next.js', 'NestJS', 'PostgreSQL', 'Docker', 'Redis'],
            activeTaskCount: 3,
            workloadHours: 32,
            availabilityStatus: 'AVAILABLE',
          },
        ]);
      }
    }
    loadTeam();
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Users2 className="text-devflow-violet" />
            Engineering Team & Skills Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Talent capabilities, department workloads, billable hourly rates, and capacity allocation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => (
          <div
            key={member.id}
            className="p-6 rounded-2xl bg-devflow-card border border-devflow-border hover:border-devflow-violet/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatarUrl}
                    alt={member.firstName}
                    className="w-12 h-12 rounded-2xl object-cover border border-devflow-border"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-[11px] text-devflow-cyan font-medium">{member.jobTitle}</p>
                    <p className="text-[10px] text-slate-500">{member.department}</p>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    member.availabilityStatus === 'AVAILABLE'
                      ? 'bg-devflow-emerald/15 text-devflow-emerald border border-devflow-emerald/30'
                      : 'bg-devflow-amber/15 text-devflow-amber border border-devflow-amber/30'
                  }`}
                >
                  {member.availabilityStatus}
                </span>
              </div>

              {/* Skills Tags */}
              <div className="mb-4">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1.5">
                  Core Technical Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {member.skills?.map((s: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-devflow-secondaryBg border border-devflow-border text-slate-300 font-mono"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Workload Progress */}
              <div className="p-3 rounded-xl bg-devflow-secondaryBg border border-devflow-border mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Weekly Capacity</span>
                  <span className="font-bold text-white font-mono">{member.workloadHours} / 40 hrs</span>
                </div>
                <div className="w-full bg-devflow-bg rounded-full h-2 overflow-hidden border border-devflow-border">
                  <div
                    className="h-full bg-gradient-to-r from-devflow-violet to-devflow-cyan rounded-full"
                    style={{ width: `${Math.min(100, (member.workloadHours / 40) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-devflow-border flex items-center justify-between text-xs">
              <span className="text-slate-400">Billable Target</span>
              <span className="font-bold text-devflow-emerald font-mono">${member.hourlyRate}/hr</span>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
