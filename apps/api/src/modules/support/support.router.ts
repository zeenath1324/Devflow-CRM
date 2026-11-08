import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { dataStore, TicketEntity } from '../../store/data-service';
import { supportTicketSchema } from '@devflow/validation';
import { Priority, TicketStatus } from '@devflow/shared-types';

export const supportRouter = Router();

// List tickets
supportRouter.get('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const { status, priority } = req.query;

  let results = dataStore.tickets.filter((t) => t.organizationId === orgId);

  if (status && typeof status === 'string' && status !== 'ALL') {
    results = results.filter((t) => t.status === status);
  }

  if (priority && typeof priority === 'string' && priority !== 'ALL') {
    results = results.filter((t) => t.priority === priority);
  }

  return res.json(results);
});

// Create ticket
supportRouter.post('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const parseResult = supportTicketSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }

  const orgId = req.organizationId!;
  const data = parseResult.data;
  const client = data.clientId ? dataStore.clients.find((c) => c.id === data.clientId) : undefined;

  const newTicket: TicketEntity = {
    id: `tick-${Date.now()}`,
    organizationId: orgId,
    clientId: data.clientId || undefined,
    clientName: client ? client.name : 'Client',
    projectId: data.projectId || undefined,
    title: data.title,
    description: data.description,
    category: data.category,
    priority: data.priority as Priority,
    status: TicketStatus.OPEN,
    slaHours: data.priority === 'URGENT' ? 4 : data.priority === 'HIGH' ? 12 : 24,
    createdAt: new Date().toISOString(),
  };

  dataStore.tickets.unshift(newTicket);
  return res.status(201).json(newTicket);
});

// Update ticket status
supportRouter.patch('/:id/status', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const { status } = req.body;

  const ticket = dataStore.tickets.find((t) => t.id === req.params.id && t.organizationId === orgId);
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  ticket.status = status as TicketStatus;
  return res.json(ticket);
});
