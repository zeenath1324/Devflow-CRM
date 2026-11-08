import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { dataStore, ProjectEntity } from '../../store/data-service';
import { projectSchema } from '@devflow/validation';
import { ProjectCategory, ProjectStatus } from '@devflow/shared-types';

export const projectsRouter = Router();

// List all projects
projectsRouter.get('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const { category, status, search } = req.query;

  let results = dataStore.projects.filter((p) => p.organizationId === orgId);

  if (category && typeof category === 'string' && category !== 'ALL') {
    results = results.filter((p) => p.category === category);
  }

  if (status && typeof status === 'string' && status !== 'ALL') {
    results = results.filter((p) => p.status === status);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter((p) => p.name.toLowerCase().includes(q) || p.clientName.toLowerCase().includes(q));
  }

  return res.json(results);
});

// Get Gantt timeline data
projectsRouter.get('/gantt', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const projects = dataStore.projects.filter((p) => p.organizationId === orgId);

  const ganttItems = projects.map((p) => ({
    id: p.id,
    name: p.name,
    client: p.clientName,
    startDate: p.startDate,
    endDate: p.targetDeliveryDate,
    progress: p.completionPercentage,
    status: p.status,
    category: p.category,
  }));

  return res.json(ganttItems);
});

// Get single project details (with tasks, sprints, budget health)
projectsRouter.get('/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const project = dataStore.projects.find((p) => p.id === req.params.id && p.organizationId === orgId);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const tasks = dataStore.tasks.filter((t) => t.projectId === project.id);
  const invoices = dataStore.invoices.filter((i) => i.projectId === project.id);
  const timeLogs = dataStore.timeLogs.filter((tl) => tl.projectId === project.id);

  return res.json({
    ...project,
    tasks,
    invoices,
    timeLogs,
  });
});

// Create project
projectsRouter.post('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const parseResult = projectSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }

  const orgId = req.organizationId!;
  const data = parseResult.data;
  const client = dataStore.clients.find((c) => c.id === data.clientId);

  const newProject: ProjectEntity = {
    id: `proj-${Date.now()}`,
    organizationId: orgId,
    clientId: data.clientId,
    clientName: client ? client.name : 'Client',
    name: data.name,
    category: data.category as ProjectCategory,
    billingType: data.billingType,
    budget: data.budget,
    actualCost: 0,
    status: data.status as ProjectStatus,
    startDate: data.startDate || new Date().toISOString().split('T')[0],
    targetDeliveryDate: data.targetDeliveryDate || new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
    description: data.description || '',
    projectManagerId: data.projectManagerId || req.user?.id,
    projectManagerName: `${req.user?.firstName} ${req.user?.lastName}`,
    completionPercentage: 0,
  };

  dataStore.projects.push(newProject);
  return res.status(201).json(newProject);
});

// Update project
projectsRouter.put('/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const index = dataStore.projects.findIndex((p) => p.id === req.params.id && p.organizationId === orgId);

  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const existing = dataStore.projects[index];
  const updated: ProjectEntity = {
    ...existing,
    ...req.body,
    id: existing.id,
    organizationId: existing.organizationId,
  };

  dataStore.projects[index] = updated;
  return res.json(updated);
});
