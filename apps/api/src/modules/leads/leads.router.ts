import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { dataStore, LeadEntity, ClientEntity, DealEntity } from '../../store/data-service';
import { leadSchema } from '@devflow/validation';
import { DealStage } from '@devflow/shared-types';

export const leadsRouter = Router();

// List leads
leadsRouter.get('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const { status, source, search } = req.query;

  let results = dataStore.leads.filter((l) => l.organizationId === orgId);

  if (status && typeof status === 'string' && status !== 'ALL') {
    results = results.filter((l) => l.status === status);
  }

  if (source && typeof source === 'string' && source !== 'ALL') {
    results = results.filter((l) => l.source === source);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.contactName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.companyName && l.companyName.toLowerCase().includes(q))
    );
  }

  return res.json(results);
});

// Create lead
leadsRouter.post('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const parseResult = leadSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }

  const orgId = req.organizationId!;
  const data = parseResult.data;

  // Calculate intelligent initial lead score
  let score = 50;
  if (data.estimatedValue > 50000) score += 20;
  if (data.source === 'REFERRAL' || data.source === 'CLUTCH') score += 15;
  if (data.companyName) score += 10;

  const newLead: LeadEntity = {
    id: `lead-${Date.now()}`,
    organizationId: orgId,
    title: data.title,
    companyName: data.companyName || '',
    contactName: data.contactName,
    email: data.email,
    phone: data.phone || '',
    source: data.source as any,
    estimatedValue: data.estimatedValue,
    score: Math.min(100, score),
    status: data.status as any,
    notes: data.notes || '',
    createdAt: new Date().toISOString(),
  };

  dataStore.leads.push(newLead);
  return res.status(201).json(newLead);
});

// Update lead
leadsRouter.put('/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const index = dataStore.leads.findIndex((l) => l.id === req.params.id && l.organizationId === orgId);

  if (index === -1) {
    return res.status(404).json({ error: 'Lead not found' });
  }

  const existing = dataStore.leads[index];
  const updated: LeadEntity = {
    ...existing,
    ...req.body,
    id: existing.id,
    organizationId: existing.organizationId,
  };

  dataStore.leads[index] = updated;
  return res.json(updated);
});

// Convert lead to Client + Deal
leadsRouter.post('/:id/convert', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const lead = dataStore.leads.find((l) => l.id === req.params.id && l.organizationId === orgId);

  if (!lead) {
    return res.status(404).json({ error: 'Lead not found' });
  }

  // 1. Mark lead as CONVERTED
  lead.status = 'CONVERTED' as any;

  // 2. Create client company
  const newClient: ClientEntity = {
    id: `cli-${Date.now()}`,
    organizationId: orgId,
    name: lead.companyName || `${lead.contactName} Ventures`,
    industry: 'Software & Technology',
    website: '',
    primaryContactName: lead.contactName,
    primaryContactEmail: lead.email,
    primaryContactPhone: lead.phone || '',
    status: 'ACTIVE',
    healthScore: 90,
    notes: `Converted from lead: ${lead.title}`,
    createdAt: new Date().toISOString(),
  };
  dataStore.clients.push(newClient);

  // 3. Create deal in pipeline
  const newDeal: DealEntity = {
    id: `deal-${Date.now()}`,
    organizationId: orgId,
    title: lead.title,
    clientId: newClient.id,
    clientName: newClient.name,
    value: lead.estimatedValue || 25000,
    stage: DealStage.QUALIFICATION,
    probability: 60,
    expectedCloseDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    dealOwnerId: req.user?.id,
    dealOwnerName: `${req.user?.firstName} ${req.user?.lastName}`,
    notes: lead.notes || '',
    createdAt: new Date().toISOString(),
  };
  dataStore.deals.push(newDeal);

  return res.json({
    message: 'Lead converted successfully',
    client: newClient,
    deal: newDeal,
  });
});

// Delete lead
leadsRouter.delete('/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const index = dataStore.leads.findIndex((l) => l.id === req.params.id && l.organizationId === orgId);

  if (index === -1) {
    return res.status(404).json({ error: 'Lead not found' });
  }

  dataStore.leads.splice(index, 1);
  return res.json({ success: true, message: 'Lead deleted' });
});
