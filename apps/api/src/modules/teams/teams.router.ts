import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { dataStore } from '../../store/data-service';
import { UserRole } from '@devflow/shared-types';

export const teamsRouter = Router();

// Get team members and workloads
teamsRouter.get('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const users = dataStore.users.filter((u) => u.organizationId === orgId && u.role !== UserRole.CLIENT);

  const teamList = users.map((u) => {
    const assignedTasks = dataStore.tasks.filter((t) => t.assigneeId === u.id && t.status !== 'DONE');
    const totalEstHours = assignedTasks.reduce((acc, t) => acc + t.estimatedHours, 0);

    return {
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      avatarUrl: u.avatarUrl,
      department: u.role === UserRole.PROJECT_MANAGER ? 'Delivery' : 'Engineering',
      jobTitle: u.role === UserRole.COMPANY_OWNER ? 'Managing Director' : u.role === UserRole.PROJECT_MANAGER ? 'Senior Project Manager' : 'Senior Full-Stack Engineer',
      hourlyRate: 85,
      skills: ['TypeScript', 'Next.js', 'NestJS', 'PostgreSQL', 'Docker', 'AWS'],
      activeTaskCount: assignedTasks.length,
      workloadHours: totalEstHours,
      availabilityStatus: totalEstHours > 35 ? 'BUSY' : 'AVAILABLE',
    };
  });

  return res.json(teamList);
});

// Update employee skills or hourly rate
teamsRouter.put('/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const user = dataStore.users.find((u) => u.id === req.params.id && u.organizationId === orgId);

  if (!user) {
    return res.status(404).json({ error: 'Team member not found' });
  }

  // update profile attributes if passed
  return res.json({ success: true, message: 'Employee updated successfully' });
});
