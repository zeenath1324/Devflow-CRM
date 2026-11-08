import {
  UserRole,
  SubscriptionTier,
  ProjectCategory,
  ProjectStatus,
  TaskStatus,
  Priority,
  DealStage,
  LeadStatus,
  LeadSource,
  InvoiceStatus,
  TicketStatus,
  WorkflowTriggerType,
  WorkflowActionType,
} from '@devflow/shared-types';

export interface OrgEntity {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  plan: SubscriptionTier;
  currency: string;
}

export interface UserEntity {
  id: string;
  organizationId: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ClientEntity {
  id: string;
  organizationId: string;
  name: string;
  industry: string;
  website: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  status: string;
  healthScore: number;
  notes?: string;
  createdAt: string;
}

export interface LeadEntity {
  id: string;
  organizationId: string;
  title: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  source: LeadSource;
  estimatedValue: number;
  score: number;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
}

export interface DealEntity {
  id: string;
  organizationId: string;
  title: string;
  clientId?: string;
  clientName?: string;
  value: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  dealOwnerId?: string;
  dealOwnerName?: string;
  notes?: string;
  createdAt: string;
}

export interface ProjectEntity {
  id: string;
  organizationId: string;
  clientId: string;
  clientName: string;
  name: string;
  category: ProjectCategory;
  billingType: string;
  budget: number;
  actualCost: number;
  status: ProjectStatus;
  startDate: string;
  targetDeliveryDate: string;
  description: string;
  projectManagerId?: string;
  projectManagerName?: string;
  completionPercentage: number;
}

export interface TaskEntity {
  id: string;
  organizationId: string;
  projectId: string;
  projectName: string;
  sprintId?: string;
  title: string;
  description?: string;
  type: string;
  priority: Priority;
  status: TaskStatus;
  estimatedHours: number;
  actualHours: number;
  assigneeId?: string;
  assigneeName?: string;
  dueDate: string;
  createdAt: string;
}

export interface InvoiceEntity {
  id: string;
  organizationId: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: InvoiceStatus;
  items: Array<{ description: string; quantity: number; unitPrice: number; amount: number }>;
  notes?: string;
}

export interface TicketEntity {
  id: string;
  organizationId: string;
  clientId?: string;
  clientName?: string;
  projectId?: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  status: TicketStatus;
  assignedToId?: string;
  assignedToName?: string;
  slaHours: number;
  createdAt: string;
}

export interface WorkflowEntity {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  triggerType: WorkflowTriggerType;
  conditions: any[];
  actionType: WorkflowActionType;
  actionPayload: any;
  isActive: boolean;
  createdAt: string;
}

export interface TimeLogEntity {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  projectId: string;
  projectName: string;
  taskId?: string;
  hours: number;
  isBillable: boolean;
  date: string;
  description: string;
}

class EnterpriseDataStore {
  public orgs: OrgEntity[] = [];
  public users: UserEntity[] = [];
  public clients: ClientEntity[] = [];
  public leads: LeadEntity[] = [];
  public deals: DealEntity[] = [];
  public projects: ProjectEntity[] = [];
  public tasks: TaskEntity[] = [];
  public invoices: InvoiceEntity[] = [];
  public tickets: TicketEntity[] = [];
  public workflows: WorkflowEntity[] = [];
  public timeLogs: TimeLogEntity[] = [];

  constructor() {
    this.seedDemoData();
  }

  private seedDemoData() {
    const orgId = 'org-nexus-001';
    this.orgs.push({
      id: orgId,
      name: 'Nexus Software Labs',
      slug: 'nexus-labs',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop',
      plan: SubscriptionTier.ENTERPRISE,
      currency: 'USD',
    });

    const ownerId = 'usr-owner-001';
    const pmId = 'usr-pm-002';
    const devId = 'usr-dev-003';
    const clientId = 'usr-client-004';

    // Password is hash for 'DevFlow@2026!'
    const demoPasswordHash = '$2a$10$WkGvP7mZ7m9Z3JmS1gYQ2.ZfR3wI1rMv9vB2r0e1f7g6h5i4j3k2l';

    this.users.push(
      {
        id: ownerId,
        organizationId: orgId,
        email: 'owner@nexuslabs.dev',
        passwordHash: demoPasswordHash,
        firstName: 'Marcus',
        lastName: 'Vance',
        role: UserRole.COMPANY_OWNER,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: pmId,
        organizationId: orgId,
        email: 'pm@nexuslabs.dev',
        passwordHash: demoPasswordHash,
        firstName: 'Elena',
        lastName: 'Rostova',
        role: UserRole.PROJECT_MANAGER,
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: devId,
        organizationId: orgId,
        email: 'dev@nexuslabs.dev',
        passwordHash: demoPasswordHash,
        firstName: 'Alex',
        lastName: 'Chen',
        role: UserRole.DEVELOPER,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: clientId,
        organizationId: orgId,
        email: 'client@fintech.io',
        passwordHash: demoPasswordHash,
        firstName: 'Sarah',
        lastName: 'Jenkins',
        role: UserRole.CLIENT,
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop',
        isActive: true,
        createdAt: new Date().toISOString(),
      }
    );

    const client1Id = 'cli-001';
    const client2Id = 'cli-002';
    this.clients.push(
      {
        id: client1Id,
        organizationId: orgId,
        name: 'Apex Fintech Solutions',
        industry: 'Banking & Financial Software',
        website: 'https://apexfintech.io',
        primaryContactName: 'Sarah Jenkins',
        primaryContactEmail: 'client@fintech.io',
        primaryContactPhone: '+1-415-555-0199',
        status: 'ACTIVE',
        healthScore: 95,
        notes: 'Enterprise account. 2 Active engagements.',
        createdAt: '2026-01-15T09:00:00Z',
      },
      {
        id: client2Id,
        organizationId: orgId,
        name: 'BioHealth Dynamics',
        industry: 'HealthTech & AI Diagnostics',
        website: 'https://biohealth.ai',
        primaryContactName: 'Dr. Gregory House',
        primaryContactEmail: 'greg@biohealth.ai',
        primaryContactPhone: '+1-617-555-0144',
        status: 'ACTIVE',
        healthScore: 89,
        notes: 'HIPAA-compliant medical cloud migration.',
        createdAt: '2026-02-10T11:30:00Z',
      }
    );

    this.leads.push(
      {
        id: 'lead-001',
        organizationId: orgId,
        title: 'Global Logistics Dispatch Web & Mobile App',
        companyName: 'TransGlobal Freight',
        contactName: 'David Sterling',
        email: 'dsterling@transglobal.com',
        phone: '+1-312-555-0178',
        source: LeadSource.CLUTCH,
        estimatedValue: 65000,
        score: 88,
        status: LeadStatus.QUALIFIED,
        notes: 'Wants modern fleet tracking with offline React Native sync.',
        createdAt: '2026-03-01T14:20:00Z',
      },
      {
        id: 'lead-002',
        organizationId: orgId,
        title: 'AI Diagnostic Mobile Assistant for Radiologists',
        companyName: 'NeuroScan Inc',
        contactName: 'Lisa Cuddy',
        email: 'lcuddy@neuroscan.med',
        source: LeadSource.WEBSITE,
        estimatedValue: 95000,
        score: 94,
        status: LeadStatus.PROPOSAL_SENT,
        notes: 'High urgency. Proposal submitted on March 5th.',
        createdAt: '2026-03-02T10:15:00Z',
      }
    );

    this.deals.push(
      {
        id: 'deal-001',
        organizationId: orgId,
        title: 'Apex Institutional Trading Web Portal',
        clientId: client1Id,
        clientName: 'Apex Fintech Solutions',
        value: 125000,
        stage: DealStage.NEGOTIATION,
        probability: 85,
        expectedCloseDate: '2026-04-15',
        dealOwnerId: ownerId,
        dealOwnerName: 'Marcus Vance',
        notes: 'Final legal contract review in progress.',
        createdAt: '2026-02-01T12:00:00Z',
      },
      {
        id: 'deal-002',
        organizationId: orgId,
        title: 'BioHealth Patient Portal & Telemedicine App',
        clientId: client2Id,
        clientName: 'BioHealth Dynamics',
        value: 85000,
        stage: DealStage.PROPOSAL,
        probability: 60,
        expectedCloseDate: '2026-04-30',
        dealOwnerId: ownerId,
        dealOwnerName: 'Marcus Vance',
        notes: 'Presenting revised technical architecture next Tuesday.',
        createdAt: '2026-02-15T15:00:00Z',
      }
    );

    const proj1Id = 'proj-001';
    const proj2Id = 'proj-002';
    this.projects.push(
      {
        id: proj1Id,
        organizationId: orgId,
        clientId: client1Id,
        clientName: 'Apex Fintech Solutions',
        name: 'Apex Core Banking Platform V2',
        category: ProjectCategory.SAAS_DEVELOPMENT,
        billingType: 'FIXED_COST',
        budget: 180000,
        actualCost: 72000,
        status: ProjectStatus.ACTIVE,
        startDate: '2026-01-10',
        targetDeliveryDate: '2026-05-30',
        description: 'Next-gen distributed order book and clearing interface with real-time WebSockets.',
        projectManagerId: pmId,
        projectManagerName: 'Elena Rostova',
        completionPercentage: 62,
      },
      {
        id: proj2Id,
        organizationId: orgId,
        clientId: client2Id,
        clientName: 'BioHealth Dynamics',
        name: 'BioHealth Cloud EHR Connector',
        category: ProjectCategory.AI_ML,
        billingType: 'TIME_AND_MATERIALS',
        budget: 95000,
        actualCost: 41000,
        status: ProjectStatus.ACTIVE,
        startDate: '2026-02-01',
        targetDeliveryDate: '2026-06-15',
        description: 'FHIR integration engine with automated clinical report summaries via Gemini API.',
        projectManagerId: pmId,
        projectManagerName: 'Elena Rostova',
        completionPercentage: 45,
      }
    );

    this.tasks.push(
      {
        id: 'task-001',
        organizationId: orgId,
        projectId: proj1Id,
        projectName: 'Apex Core Banking Platform V2',
        title: 'Implement Redis Pub/Sub WebSocket Order Stream',
        description: 'Broadcast market book updates to subscribed UI clients with backpressure control.',
        type: 'TASK',
        priority: Priority.HIGH,
        status: TaskStatus.IN_PROGRESS,
        estimatedHours: 16,
        actualHours: 8,
        assigneeId: devId,
        assigneeName: 'Alex Chen',
        dueDate: '2026-03-20',
        createdAt: '2026-03-10T10:00:00Z',
      },
      {
        id: 'task-002',
        organizationId: orgId,
        projectId: proj1Id,
        projectName: 'Apex Core Banking Platform V2',
        title: 'Resolve race condition during concurrent order cancellations',
        description: 'P1: Two simultaneous cancel requests occasionally result in unhandled lock error.',
        type: 'BUG',
        priority: Priority.URGENT,
        status: TaskStatus.TODO,
        estimatedHours: 8,
        actualHours: 0,
        assigneeId: devId,
        assigneeName: 'Alex Chen',
        dueDate: '2026-03-18',
        createdAt: '2026-03-11T12:00:00Z',
      },
      {
        id: 'task-003',
        organizationId: orgId,
        projectId: proj2Id,
        projectName: 'BioHealth Cloud EHR Connector',
        title: 'Configure HIPAA Audit Logging Interceptor',
        description: 'Emit structured JSON logs for all read/write patient encounters.',
        type: 'TASK',
        priority: Priority.MEDIUM,
        status: TaskStatus.DONE,
        estimatedHours: 12,
        actualHours: 11,
        assigneeId: devId,
        assigneeName: 'Alex Chen',
        dueDate: '2026-03-08',
        createdAt: '2026-03-01T08:00:00Z',
      }
    );

    this.invoices.push(
      {
        id: 'inv-001',
        organizationId: orgId,
        clientId: client1Id,
        clientName: 'Apex Fintech Solutions',
        projectId: proj1Id,
        projectName: 'Apex Core Banking Platform V2',
        invoiceNumber: 'INV-2026-001',
        issueDate: '2026-02-15',
        dueDate: '2026-03-15',
        subtotal: 45000,
        taxRate: 5.0,
        taxAmount: 2250,
        totalAmount: 47250,
        paidAmount: 47250,
        status: InvoiceStatus.PAID,
        items: [
          { description: 'Sprint 1 & 2 Deliverables - Core Engine & Auth', quantity: 1, unitPrice: 30000, amount: 30000 },
          { description: 'Infrastructure & Kubernetes Gateway Setup', quantity: 1, unitPrice: 15000, amount: 15000 },
        ],
        notes: 'Paid in full via ACH.',
      },
      {
        id: 'inv-002',
        organizationId: orgId,
        clientId: client2Id,
        clientName: 'BioHealth Dynamics',
        projectId: proj2Id,
        projectName: 'BioHealth Cloud EHR Connector',
        invoiceNumber: 'INV-2026-002',
        issueDate: '2026-03-01',
        dueDate: '2026-03-31',
        subtotal: 28000,
        taxRate: 5.0,
        taxAmount: 1400,
        totalAmount: 29400,
        paidAmount: 0,
        status: InvoiceStatus.SENT,
        items: [
          { description: 'February Development Hours (140 hrs @ $200/hr blended)', quantity: 140, unitPrice: 200, amount: 28000 },
        ],
        notes: 'Payment terms: Net 30.',
      }
    );

    this.tickets.push(
      {
        id: 'tick-001',
        organizationId: orgId,
        clientId: client1Id,
        clientName: 'Apex Fintech Solutions',
        projectId: proj1Id,
        title: 'Staging Environment API Rate Limit Increase Request',
        description: 'We are starting external sandbox penetration testing and need 500 req/sec quota.',
        category: 'Infrastructure',
        priority: Priority.HIGH,
        status: TicketStatus.IN_PROGRESS,
        assignedToId: devId,
        assignedToName: 'Alex Chen',
        slaHours: 12,
        createdAt: '2026-03-12T09:30:00Z',
      }
    );

    this.workflows.push(
      {
        id: 'wf-001',
        organizationId: orgId,
        name: 'Deal Won → Auto-create Project & Alert Team',
        description: 'When any sales deal reaches CLOSED_WON, automatically instantiate project workspace and notify project leads.',
        triggerType: WorkflowTriggerType.DEAL_WON,
        conditions: [{ field: 'value', operator: 'gte', value: 10000 }],
        actionType: WorkflowActionType.CREATE_PROJECT,
        actionPayload: { defaultStatus: 'PLANNING', notifyRoles: ['PROJECT_MANAGER', 'TECHNICAL_LEAD'] },
        isActive: true,
        createdAt: '2026-01-20T10:00:00Z',
      },
      {
        id: 'wf-002',
        organizationId: orgId,
        name: 'Invoice Overdue → Automated Payment Reminder',
        description: 'Send automated email reminder to client billing contact 3 days after due date.',
        triggerType: WorkflowTriggerType.INVOICE_OVERDUE,
        conditions: [{ field: 'daysOverdue', operator: 'gte', value: 3 }],
        actionType: WorkflowActionType.SEND_EMAIL,
        actionPayload: { template: 'INVOICE_REMINDER_GENTLE' },
        isActive: true,
        createdAt: '2026-02-05T14:00:00Z',
      }
    );

    this.timeLogs.push(
      {
        id: 'time-001',
        organizationId: orgId,
        userId: devId,
        userName: 'Alex Chen',
        projectId: proj1Id,
        projectName: 'Apex Core Banking Platform V2',
        taskId: 'task-001',
        hours: 4.5,
        isBillable: true,
        date: '2026-03-12',
        description: 'WebSocket protocol framing and ping/pong heartbeat implementation',
      },
      {
        id: 'time-002',
        organizationId: orgId,
        userId: devId,
        userName: 'Alex Chen',
        projectId: proj1Id,
        projectName: 'Apex Core Banking Platform V2',
        taskId: 'task-001',
        hours: 3.5,
        isBillable: true,
        date: '2026-03-13',
        description: 'Redis cluster backpressure tuning under synthetic load',
      }
    );
  }
}

export const dataStore = new EnterpriseDataStore();
