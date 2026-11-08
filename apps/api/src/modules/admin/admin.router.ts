import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { dataStore } from '../../store/data-service';
import { SubscriptionTier, UserRole } from '@devflow/shared-types';

export const adminRouter = Router();

// Get organization settings & current plan
adminRouter.get('/organization', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const org = dataStore.orgs.find((o) => o.id === orgId) || dataStore.orgs[0];

  const planFeatures = {
    [SubscriptionTier.STARTER]: { maxUsers: 5, maxProjects: 5, aiLimitMonthly: 500, storageGB: 10 },
    [SubscriptionTier.PROFESSIONAL]: { maxUsers: 25, maxProjects: 25, aiLimitMonthly: 5000, storageGB: 100 },
    [SubscriptionTier.BUSINESS]: { maxUsers: 100, maxProjects: 100, aiLimitMonthly: 25000, storageGB: 500 },
    [SubscriptionTier.ENTERPRISE]: { maxUsers: 9999, maxProjects: 9999, aiLimitMonthly: 999999, storageGB: 5000 },
  };

  return res.json({
    organization: org,
    tierDetails: planFeatures[org.plan],
    usage: {
      usersCount: dataStore.users.filter((u) => u.organizationId === orgId).length,
      projectsCount: dataStore.projects.filter((p) => p.organizationId === orgId).length,
      clientsCount: dataStore.clients.filter((c) => c.organizationId === orgId).length,
      storageUsedGB: 4.8,
    },
  });
});

// Upgrade / change subscription plan
adminRouter.post('/organization/subscription', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const { plan } = req.body;

  const org = dataStore.orgs.find((o) => o.id === orgId);
  if (!org) {
    return res.status(404).json({ error: 'Organization not found' });
  }

  org.plan = plan as SubscriptionTier;
  return res.json({ message: `Successfully upgraded to ${plan}`, organization: org });
});

// Audit logs
adminRouter.get('/audit-logs', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const sampleLogs = [
    { id: 'log-1', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), user: 'Marcus Vance', event: 'USER_ROLE_UPDATED', ip: '192.168.1.104', status: 'SUCCESS' },
    { id: 'log-2', timestamp: new Date(Date.now() - 45 * 60000).toISOString(), user: 'Elena Rostova', event: 'PROJECT_BUDGET_MODIFIED', ip: '192.168.1.109', status: 'SUCCESS' },
    { id: 'log-3', timestamp: new Date(Date.now() - 120 * 60000).toISOString(), user: 'System Worker', event: 'AUTOMATION_RUN_PASSED', ip: '127.0.0.1', status: 'SUCCESS' },
    { id: 'log-4', timestamp: new Date(Date.now() - 360 * 60000).toISOString(), user: 'Alex Chen', event: 'API_KEY_ROTATED', ip: '192.168.1.112', status: 'SUCCESS' },
  ];

  return res.json(sampleLogs);
});

// SuperAdmin: List all tenant organizations across the SaaS platform
adminRouter.get('/superadmin/tenants', authenticate, (req: AuthenticatedRequest, res: Response) => {
  return res.json(
    dataStore.orgs.map((org) => {
      const userCount = dataStore.users.filter((u) => u.organizationId === org.id).length;
      const projectCount = dataStore.projects.filter((p) => p.organizationId === org.id).length;
      return {
        ...org,
        userCount,
        projectCount,
        mrr: org.plan === SubscriptionTier.ENTERPRISE ? 499 : org.plan === SubscriptionTier.BUSINESS ? 299 : 99,
      };
    })
  );
});
