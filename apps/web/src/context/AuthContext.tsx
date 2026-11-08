'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string;
  organization?: {
    id: string;
    name: string;
    slug: string;
    plan: string;
  };
}

interface AuthContextType {
  user: User | null;
  organization: { id: string; name: string; slug: string; plan: string } | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchWorkspace: (orgId: string, orgName: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<{ id: string; name: string; slug: string; plan: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize session from localStorage or set up default demo workspace
    const storedToken = localStorage.getItem('devflow_access_token');
    const storedUser = localStorage.getItem('devflow_user');
    const storedOrg = localStorage.getItem('devflow_org');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (storedOrg) {
          setOrganization(JSON.parse(storedOrg));
        } else if (parsedUser.organization) {
          setOrganization(parsedUser.organization);
        }
      } catch (e) {
        console.error('Failed to parse auth cache:', e);
      }
    } else {
      // Default to demo session for instant enterprise onboarding
      const demoUser: User = {
        id: 'usr-owner-001',
        email: 'owner@nexuslabs.dev',
        firstName: 'Marcus',
        lastName: 'Vance',
        role: 'COMPANY_OWNER',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop',
        organization: {
          id: 'org-nexus-001',
          name: 'Nexus Software Labs',
          slug: 'nexus-labs',
          plan: 'ENTERPRISE',
        },
      };
      setUser(demoUser);
      setOrganization(demoUser.organization!);
      setToken('demo_bearer_token_2026');
      localStorage.setItem('devflow_user', JSON.stringify(demoUser));
      localStorage.setItem('devflow_org', JSON.stringify(demoUser.organization));
      localStorage.setItem('devflow_access_token', 'demo_bearer_token_2026');
      localStorage.setItem('devflow_active_tenant_id', 'org-nexus-001');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data: any = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setToken(data.accessToken);
      setUser(data.user);
      setOrganization(data.user.organization);

      localStorage.setItem('devflow_access_token', data.accessToken);
      localStorage.setItem('devflow_user', JSON.stringify(data.user));
      localStorage.setItem('devflow_org', JSON.stringify(data.user.organization));
      localStorage.setItem('devflow_active_tenant_id', data.user.organization.id);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: any) => {
    setIsLoading(true);
    try {
      const data: any = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setToken(data.accessToken);
      setUser(data.user);
      setOrganization(data.user.organization);

      localStorage.setItem('devflow_access_token', data.accessToken);
      localStorage.setItem('devflow_user', JSON.stringify(data.user));
      localStorage.setItem('devflow_org', JSON.stringify(data.user.organization));
      localStorage.setItem('devflow_active_tenant_id', data.user.organization.id);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setOrganization(null);
    setToken(null);
    localStorage.removeItem('devflow_access_token');
    localStorage.removeItem('devflow_user');
    localStorage.removeItem('devflow_org');
    localStorage.removeItem('devflow_active_tenant_id');
  };

  const switchWorkspace = (orgId: string, orgName: string) => {
    const updatedOrg = {
      id: orgId,
      name: orgName,
      slug: orgName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      plan: 'ENTERPRISE',
    };
    setOrganization(updatedOrg);
    localStorage.setItem('devflow_org', JSON.stringify(updatedOrg));
    localStorage.setItem('devflow_active_tenant_id', orgId);
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        token,
        isLoading,
        login,
        register,
        logout,
        switchWorkspace,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
