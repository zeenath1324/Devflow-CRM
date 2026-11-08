import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { dataStore, ClientEntity } from '../../store/data-service';
import { clientSchema } from '@devflow/validation';

export const clientsRouter = Router();

// List all clients for tenant
clientsRouter.get('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const { search, status } = req.query;

  let results = dataStore.clients.filter((c) => c.organizationId === orgId);

  if (status && typeof status === 'string' && status !== 'ALL') {
    results = results.filter((c) => c.status === status);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.primaryContactName.toLowerCase().includes(q) ||
        c.primaryContactEmail.toLowerCase().includes(q) ||
        (c.industry && c.industry.toLowerCase().includes(q))
    );
  }

  return res.json(results);
});

// CSV Export
clientsRouter.get('/export/csv', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const clients = dataStore.clients.filter((c) => c.organizationId === orgId);

  const header = 'ID,Name,Industry,Contact Name,Contact Email,Contact Phone,Status,Health Score,Website\n';
  const rows = clients
    .map(
      (c) =>
        `"${c.id}","${c.name}","${c.industry || ''}","${c.primaryContactName}","${c.primaryContactEmail}","${
          c.primaryContactPhone || ''
        }","${c.status}",${c.healthScore},"${c.website || ''}"`
    )
    .join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="devflow-clients.csv"');
  return res.send(header + rows);
});

// Get single client
clientsRouter.get('/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const client = dataStore.clients.find((c) => c.id === req.params.id && c.organizationId === orgId);

  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }

  const projects = dataStore.projects.filter((p) => p.clientId === client.id);
  const invoices = dataStore.invoices.filter((i) => i.clientId === client.id);
  const deals = dataStore.deals.filter((d) => d.clientId === client.id);
  const tickets = dataStore.tickets.filter((t) => t.clientId === client.id);

  return res.json({
    ...client,
    projects,
    invoices,
    deals,
    tickets,
  });
});

// Create client
clientsRouter.post('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const parseResult = clientSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }

  const orgId = req.organizationId!;
  const newClient: ClientEntity = {
    id: `cli-${Date.now()}`,
    organizationId: orgId,
    name: parseResult.data.name,
    industry: parseResult.data.industry || 'Software & Technology',
    website: parseResult.data.website || '',
    primaryContactName: parseResult.data.primaryContactName,
    primaryContactEmail: parseResult.data.primaryContactEmail,
    primaryContactPhone: parseResult.data.primaryContactPhone || '',
    status: parseResult.data.status,
    healthScore: 100,
    notes: parseResult.data.notes || '',
    createdAt: new Date().toISOString(),
  };

  dataStore.clients.push(newClient);
  return res.status(201).json(newClient);
});

// Update client
clientsRouter.put('/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const index = dataStore.clients.findIndex((c) => c.id === req.params.id && c.organizationId === orgId);

  if (index === -1) {
    return res.status(404).json({ error: 'Client not found' });
  }

  const existing = dataStore.clients[index];
  const updated: ClientEntity = {
    ...existing,
    ...req.body,
    id: existing.id,
    organizationId: existing.organizationId,
  };

  dataStore.clients[index] = updated;
  return res.json(updated);
});

// Delete client
clientsRouter.delete('/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const index = dataStore.clients.findIndex((c) => c.id === req.params.id && c.organizationId === orgId);

  if (index === -1) {
    return res.status(404).json({ error: 'Client not found' });
  }

  dataStore.clients.splice(index, 1);
  return res.json({ success: true, message: 'Client deleted successfully' });
});
