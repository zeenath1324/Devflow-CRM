import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { dataStore, TaskEntity } from '../../store/data-service';
import { taskSchema } from '@devflow/validation';
import { TaskStatus, Priority } from '@devflow/shared-types';

export const tasksRouter = Router();

// List tasks
tasksRouter.get('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const { projectId, status, priority, type } = req.query;

  let results = dataStore.tasks.filter((t) => t.organizationId === orgId);

  if (projectId && typeof projectId === 'string') {
    results = results.filter((t) => t.projectId === projectId);
  }

  if (status && typeof status === 'string' && status !== 'ALL') {
    results = results.filter((t) => t.status === status);
  }

  if (priority && typeof priority === 'string' && priority !== 'ALL') {
    results = results.filter((t) => t.priority === priority);
  }

  if (type && typeof type === 'string' && type !== 'ALL') {
    results = results.filter((t) => t.type === type);
  }

  return res.json(results);
});

// Update task status (Kanban drop handler)
tasksRouter.patch('/:id/status', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const { status } = req.body;

  const task = dataStore.tasks.find((t) => t.id === req.params.id && t.organizationId === orgId);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.status = status as TaskStatus;
  return res.json(task);
});

// Create task or bug
tasksRouter.post('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const parseResult = taskSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }

  const orgId = req.organizationId!;
  const data = parseResult.data;
  const project = dataStore.projects.find((p) => p.id === data.projectId);
  const assignee = data.assigneeId ? dataStore.users.find((u) => u.id === data.assigneeId) : undefined;

  const newTask: TaskEntity = {
    id: `task-${Date.now()}`,
    organizationId: orgId,
    projectId: data.projectId,
    projectName: project ? project.name : 'Project',
    sprintId: data.sprintId || undefined,
    title: data.title,
    description: data.description || '',
    type: data.type,
    priority: data.priority as Priority,
    status: data.status as TaskStatus,
    estimatedHours: data.estimatedHours,
    actualHours: data.actualHours,
    assigneeId: data.assigneeId || undefined,
    assigneeName: assignee ? `${assignee.firstName} ${assignee.lastName}` : 'Unassigned',
    dueDate: data.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  };

  dataStore.tasks.push(newTask);
  return res.status(201).json(newTask);
});

// Update task
tasksRouter.put('/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const index = dataStore.tasks.findIndex((t) => t.id === req.params.id && t.organizationId === orgId);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const existing = dataStore.tasks[index];
  const updated: TaskEntity = {
    ...existing,
    ...req.body,
    id: existing.id,
    organizationId: existing.organizationId,
  };

  dataStore.tasks[index] = updated;
  return res.json(updated);
});

// Delete task
tasksRouter.delete('/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const index = dataStore.tasks.findIndex((t) => t.id === req.params.id && t.organizationId === orgId);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  dataStore.tasks.splice(index, 1);
  return res.json({ success: true, message: 'Task deleted' });
});
