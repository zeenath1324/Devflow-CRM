import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { dataStore } from '../../store/data-service';

export const analyticsRouter = Router();

analyticsRouter.get('/reports', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;

  const clients = dataStore.clients.filter((c) => c.organizationId === orgId);
  const projects = dataStore.projects.filter((p) => p.organizationId === orgId);
  const tasks = dataStore.tasks.filter((t) => t.organizationId === orgId);
  const invoices = dataStore.invoices.filter((i) => i.organizationId === orgId);

  const developerProductivity = [
    { developer: 'Alex Chen', completedTasks: 14, loggedHours: 78, sprintVelocity: 94, qualityRating: 4.9 },
    { developer: 'Elena Rostova', completedTasks: 18, loggedHours: 82, sprintVelocity: 96, qualityRating: 5.0 },
    { developer: 'Marcus Vance', completedTasks: 8, loggedHours: 45, sprintVelocity: 90, qualityRating: 4.8 },
  ];

  const monthlyFinancials = [
    { month: 'Oct 2025', revenue: 68000, expenses: 42000, profit: 26000, margin: 38 },
    { month: 'Nov 2025', revenue: 84000, expenses: 51000, profit: 33000, margin: 39 },
    { month: 'Dec 2025', revenue: 95000, expenses: 58000, profit: 37000, margin: 39 },
    { month: 'Jan 2026', revenue: 112000, expenses: 64000, profit: 48000, margin: 43 },
    { month: 'Feb 2026', revenue: 138000, expenses: 73000, profit: 65000, margin: 47 },
    { month: 'Mar 2026', revenue: 165000, expenses: 82000, profit: 83000, margin: 50 },
  ];

  const leadAcquisitionSources = [
    { source: 'Clutch / Agency Review', leads: 18, dealsWon: 5, totalWonValue: 185000 },
    { source: 'Organic Website Inbound', leads: 24, dealsWon: 6, totalWonValue: 140000 },
    { source: 'Referral & Partnerships', leads: 12, dealsWon: 7, totalWonValue: 240000 },
    { source: 'LinkedIn Direct Outbound', leads: 32, dealsWon: 4, totalWonValue: 95000 },
  ];

  return res.json({
    developerProductivity,
    monthlyFinancials,
    leadAcquisitionSources,
    summary: {
      averageProjectMargin: '48.5%',
      onTimeDeliveryRate: '94.2%',
      clientRetentionRate: '96.8%',
      supportSlaCompliance: '99.1%',
    },
  });
});
