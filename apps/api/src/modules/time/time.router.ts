import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { dataStore, TimeLogEntity } from '../../store/data-service';
import { timeLogSchema } from '@devflow/validation';

export const timeRouter = Router();

// Get time logs
timeRouter.get('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const { projectId, userId } = req.query;

  let results = dataStore.timeLogs.filter((tl) => tl.organizationId === orgId);

  if (projectId && typeof projectId === 'string') {
    results = results.filter((tl) => tl.projectId === projectId);
  }

  if (userId && typeof userId === 'string') {
    results = results.filter((tl) => tl.userId === userId);
  }

  return res.json(results);
});

// Create time log
timeRouter.post('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const parseResult = timeLogSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }

  const orgId = req.organizationId!;
  const data = parseResult.data;
  const project = dataStore.projects.find((p) => p.id === data.projectId);

  const newLog: TimeLogEntity = {
    id: `time-${Date.now()}`,
    organizationId: orgId,
    userId: req.user!.id,
    userName: `${req.user!.firstName} ${req.user!.lastName}`,
    projectId: data.projectId,
    projectName: project ? project.name : 'Project',
    taskId: data.taskId || undefined,
    hours: data.hours,
    isBillable: data.isBillable,
    date: data.date,
    description: data.description || '',
  };

  dataStore.timeLogs.unshift(newLog);

  // Update actual hours on project
  if (project) {
    project.actualCost += data.hours * 85; // blend rate
  }

  return res.status(201).json(newLog);
});
