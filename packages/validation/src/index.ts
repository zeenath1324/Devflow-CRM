import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  companyName: z.string().min(2, 'Company name is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const clientSchema = z.object({
  name: z.string().min(2, 'Client/Company name is required'),
  industry: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  primaryContactName: z.string().min(2, 'Primary contact name is required'),
  primaryContactEmail: z.string().email('Invalid email address'),
  primaryContactPhone: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'LEAD', 'CHURNED']).default('ACTIVE'),
  notes: z.string().optional(),
});

export const leadSchema = z.object({
  title: z.string().min(2, 'Lead title is required'),
  companyName: z.string().optional(),
  contactName: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  source: z.enum([
    'WEBSITE',
    'REFERRAL',
    'LINKEDIN',
    'UPWORK',
    'CLUTCH',
    'INBOUND_EMAIL',
    'OUTBOUND_CAMPAIGN',
    'EVENT',
    'OTHER',
  ]).default('WEBSITE'),
  estimatedValue: z.number().min(0).default(0),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'CONVERTED', 'LOST']).default('NEW'),
  notes: z.string().optional(),
});

export const dealSchema = z.object({
  title: z.string().min(2, 'Deal title is required'),
  clientId: z.string().uuid().optional().nullable(),
  value: z.number().positive('Deal value must be positive'),
  stage: z.enum([
    'DISCOVERY',
    'QUALIFICATION',
    'PROPOSAL',
    'NEGOTIATION',
    'CONTRACT_SENT',
    'CLOSED_WON',
    'CLOSED_LOST',
  ]).default('DISCOVERY'),
  probability: z.number().min(0).max(100).default(50),
  expectedCloseDate: z.string().optional(),
  dealOwnerId: z.string().uuid().optional().nullable(),
  notes: z.string().optional(),
});

export const projectSchema = z.object({
  name: z.string().min(2, 'Project name is required'),
  clientId: z.string().uuid('Valid client ID is required'),
  category: z.enum([
    'WEB_DEVELOPMENT',
    'MOBILE_APP',
    'SAAS_DEVELOPMENT',
    'AI_ML',
    'SOFTWARE_MAINTENANCE',
    'IT_CONSULTING',
  ]),
  billingType: z.enum(['FIXED_COST', 'TIME_AND_MATERIALS', 'MONTHLY_RETAINER']).default('FIXED_COST'),
  budget: z.number().min(0).default(0),
  startDate: z.string().optional(),
  targetDeliveryDate: z.string().optional(),
  status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'TESTING', 'DELIVERED', 'COMPLETED', 'CANCELLED']).default('PLANNING'),
  projectManagerId: z.string().uuid().optional().nullable(),
  description: z.string().optional(),
});

export const taskSchema = z.object({
  title: z.string().min(2, 'Task title is required'),
  projectId: z.string().uuid('Project ID is required'),
  sprintId: z.string().uuid().optional().nullable(),
  type: z.enum(['TASK', 'BUG', 'FEATURE_REQUEST', 'IMPROVEMENT']).default('TASK'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'CODE_REVIEW', 'IN_TESTING', 'DONE']).default('TODO'),
  estimatedHours: z.number().min(0).default(0),
  actualHours: z.number().min(0).default(0),
  assigneeId: z.string().uuid().optional().nullable(),
  dueDate: z.string().optional(),
  description: z.string().optional(),
});

export const invoiceSchema = z.object({
  clientId: z.string().uuid('Client ID is required'),
  projectId: z.string().uuid().optional().nullable(),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  issueDate: z.string(),
  dueDate: z.string(),
  items: z.array(
    z.object({
      description: z.string().min(1, 'Item description required'),
      quantity: z.number().positive(),
      unitPrice: z.number().nonnegative(),
    })
  ).min(1, 'At least one line item is required'),
  taxRate: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
});

export const supportTicketSchema = z.object({
  title: z.string().min(2, 'Subject is required'),
  clientId: z.string().uuid().optional().nullable(),
  projectId: z.string().uuid().optional().nullable(),
  category: z.string().default('General'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  description: z.string().min(5, 'Ticket description is required'),
});

export const timeLogSchema = z.object({
  projectId: z.string().uuid(),
  taskId: z.string().uuid().optional().nullable(),
  hours: z.number().positive('Hours must be greater than 0'),
  isBillable: z.boolean().default(true),
  date: z.string(),
  description: z.string().optional(),
});
