import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { dataStore, WorkflowEntity } from '../../store/data-service';
import { WorkflowTriggerType, WorkflowActionType } from '@devflow/shared-types';

export const automationRouter = Router();

// List workflow automation rules
automationRouter.get('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const rules = dataStore.workflows.filter((w) => w.organizationId === orgId);
  return res.json(rules);
});

// Create workflow automation rule
automationRouter.post('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { name, description, triggerType, conditions, actionType, actionPayload } = req.body;
  const orgId = req.organizationId!;

  if (!name || !triggerType || !actionType) {
    return res.status(400).json({ error: 'Name, triggerType, and actionType are required' });
  }

  const newRule: WorkflowEntity = {
    id: `wf-${Date.now()}`,
    organizationId: orgId,
    name,
    description: description || '',
    triggerType: triggerType as WorkflowTriggerType,
    conditions: conditions || [],
    actionType: actionType as WorkflowActionType,
    actionPayload: actionPayload || {},
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  dataStore.workflows.push(newRule);
  return res.status(201).json(newRule);
});

// Toggle rule active status
automationRouter.patch('/:id/toggle', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const rule = dataStore.workflows.find((w) => w.id === req.params.id && w.organizationId === orgId);

  if (!rule) {
    return res.status(404).json({ error: 'Workflow rule not found' });
  }

  rule.isActive = !rule.isActive;
  return res.json(rule);
});

// Test-run a workflow
automationRouter.post('/:id/test', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const rule = dataStore.workflows.find((w) => w.id === req.params.id && w.organizationId === orgId);

  if (!rule) {
    return res.status(404).json({ error: 'Workflow rule not found' });
  }

  // Simulate trigger execution
  const executionResult = {
    executionId: `exec-${Date.now()}`,
    workflowId: rule.id,
    workflowName: rule.name,
    trigger: rule.triggerType,
    conditionEvaluated: 'PASSED (value >= 10000)',
    actionExecuted: rule.actionType,
    status: 'SUCCESS',
    timestamp: new Date().toISOString(),
    logs: [
      `Trigger ${rule.triggerType} fired with mock event payload`,
      `Evaluated ${rule.conditions.length} conditions: All returned true`,
      `Executing action: ${rule.actionType}`,
      `Action ${rule.actionType} dispatched successfully with 0 retries.`,
    ],
  };

  return res.json(executionResult);
});
