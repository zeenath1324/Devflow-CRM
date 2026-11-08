import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';

export const communicationRouter = Router();

const discussions: any[] = [
  {
    id: 'disc-1',
    organizationId: 'org-nexus-001',
    projectId: 'proj-001',
    projectName: 'Apex Core Banking Platform V2',
    author: 'Elena Rostova',
    authorRole: 'Project Manager',
    title: 'Sprint 04 Scope Freeze & Release Readiness',
    content: 'All critical path tasks for Redis cluster failover and WebSocket backpressure have been committed. QA regression run scheduled for 18:00 UTC.',
    createdAt: '2 hours ago',
    repliesCount: 4,
  },
  {
    id: 'disc-2',
    organizationId: 'org-nexus-001',
    projectId: 'proj-002',
    projectName: 'BioHealth Cloud EHR Connector',
    author: 'Alex Chen',
    authorRole: 'Senior Engineer',
    title: 'FHIR v4 DiagnosticReport Resource Mapping Review',
    content: 'Uploaded new schema transformation specs for laboratory findings and Gemini inference summaries. Reviewers requested.',
    createdAt: '1 day ago',
    repliesCount: 2,
  },
];

communicationRouter.get('/discussions', authenticate, (req: AuthenticatedRequest, res: Response) => {
  return res.json(discussions);
});

communicationRouter.post('/discussions', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { projectId, projectName, title, content } = req.body;
  const user = req.user!;

  const newDisc = {
    id: `disc-${Date.now()}`,
    organizationId: req.organizationId!,
    projectId: projectId || 'proj-001',
    projectName: projectName || 'General',
    author: `${user.firstName} ${user.lastName}`,
    authorRole: user.role,
    title: title || 'Project Discussion',
    content,
    createdAt: 'Just now',
    repliesCount: 0,
  };

  discussions.unshift(newDisc);
  return res.status(201).json(newDisc);
});
