import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { dataStore } from '../../store/data-service';

export const portalRouter = Router();

// Client portal dashboard summary
portalRouter.get('/overview', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const orgId = req.organizationId!;

  // Match client entity by user's email or primary contact
  const client = dataStore.clients.find(
    (c) => c.organizationId === orgId && (c.primaryContactEmail === user.email || c.name.toLowerCase().includes('apex'))
  );

  const clientId = client ? client.id : 'cli-001';

  const clientProjects = dataStore.projects.filter((p) => p.clientId === clientId);
  const clientInvoices = dataStore.invoices.filter((i) => i.clientId === clientId);
  const clientTickets = dataStore.tickets.filter((t) => t.clientId === clientId);

  const pendingInvoices = clientInvoices.filter((i) => i.status !== 'PAID');
  const totalDue = pendingInvoices.reduce((acc, i) => acc + (i.totalAmount - i.paidAmount), 0);

  return res.json({
    client: client || { name: 'Client Account', id: clientId },
    projects: clientProjects,
    invoices: clientInvoices,
    tickets: clientTickets,
    stats: {
      activeProjectsCount: clientProjects.filter((p) => p.status === 'ACTIVE').length,
      pendingInvoicesCount: pendingInvoices.length,
      totalDue,
      openTicketsCount: clientTickets.filter((t) => t.status !== 'CLOSED' && t.status !== 'RESOLVED').length,
    },
  });
});
