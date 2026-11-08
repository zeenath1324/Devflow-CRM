import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { dataStore, DealEntity } from '../../store/data-service';
import { dealSchema } from '@devflow/validation';
import { DealStage } from '@devflow/shared-types';

export const dealsRouter = Router();

// Get deals pipeline / board grouped or list
dealsRouter.get('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const deals = dataStore.deals.filter((d) => d.organizationId === orgId);
  return res.json(deals);
});

// Update deal stage (drag & drop handler)
dealsRouter.patch('/:id/stage', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const { stage } = req.body;

  const deal = dataStore.deals.find((d) => d.id === req.params.id && d.organizationId === orgId);
  if (!deal) {
    return res.status(404).json({ error: 'Deal not found' });
  }

  deal.stage = stage as DealStage;
  if (stage === 'CLOSED_WON') {
    deal.probability = 100;
  } else if (stage === 'CLOSED_LOST') {
    deal.probability = 0;
  }

  return res.json(deal);
});

// Create deal
dealsRouter.post('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const parseResult = dealSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }

  const orgId = req.organizationId!;
  const data = parseResult.data;

  const client = data.clientId ? dataStore.clients.find((c) => c.id === data.clientId) : undefined;

  const newDeal: DealEntity = {
    id: `deal-${Date.now()}`,
    organizationId: orgId,
    title: data.title,
    clientId: data.clientId || undefined,
    clientName: client ? client.name : 'Prospect',
    value: data.value,
    stage: data.stage as DealStage,
    probability: data.probability,
    expectedCloseDate: data.expectedCloseDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    dealOwnerId: data.dealOwnerId || req.user?.id,
    dealOwnerName: `${req.user?.firstName} ${req.user?.lastName}`,
    notes: data.notes || '',
    createdAt: new Date().toISOString(),
  };

  dataStore.deals.push(newDeal);
  return res.status(201).json(newDeal);
});

// Update deal
dealsRouter.put('/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const index = dataStore.deals.findIndex((d) => d.id === req.params.id && d.organizationId === orgId);

  if (index === -1) {
    return res.status(404).json({ error: 'Deal not found' });
  }

  const existing = dataStore.deals[index];
  const updated: DealEntity = {
    ...existing,
    ...req.body,
    id: existing.id,
    organizationId: existing.organizationId,
  };

  dataStore.deals[index] = updated;
  return res.json(updated);
});

// Delete deal
dealsRouter.delete('/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const index = dataStore.deals.findIndex((d) => d.id === req.params.id && d.organizationId === orgId);

  if (index === -1) {
    return res.status(404).json({ error: 'Deal not found' });
  }

  dataStore.deals.splice(index, 1);
  return res.json({ success: true, message: 'Deal deleted' });
});
