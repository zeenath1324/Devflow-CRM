// DEVFLOW CRM — Comprehensive Shared Types & Enums

export enum UserRole {
  SAAS_SUPER_ADMIN = 'SAAS_SUPER_ADMIN',
  COMPANY_OWNER = 'COMPANY_OWNER',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  BUSINESS_DEVELOPMENT_MANAGER = 'BUSINESS_DEVELOPMENT_MANAGER',
  SALES_EXECUTIVE = 'SALES_EXECUTIVE',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  TECHNICAL_LEAD = 'TECHNICAL_LEAD',
  DEVELOPER = 'DEVELOPER',
  UI_UX_DESIGNER = 'UI_UX_DESIGNER',
  QA_ENGINEER = 'QA_ENGINEER',
  FINANCE_MANAGER = 'FINANCE_MANAGER',
  HR_MANAGER = 'HR_MANAGER',
  SUPPORT_AGENT = 'SUPPORT_AGENT',
  CLIENT = 'CLIENT',
}

export enum SubscriptionTier {
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  BUSINESS = 'BUSINESS',
  ENTERPRISE = 'ENTERPRISE',
}

export enum SubscriptionStatus {
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELLED = 'CANCELLED',
}

export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LEAD = 'LEAD',
  CHURNED = 'CHURNED',
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  PROPOSAL_SENT = 'PROPOSAL_SENT',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST',
}

export enum LeadSource {
  WEBSITE = 'WEBSITE',
  REFERRAL = 'REFERRAL',
  LINKEDIN = 'LINKEDIN',
  UPWORK = 'UPWORK',
  CLUTCH = 'CLUTCH',
  INBOUND_EMAIL = 'INBOUND_EMAIL',
  OUTBOUND_CAMPAIGN = 'OUTBOUND_CAMPAIGN',
  EVENT = 'EVENT',
  OTHER = 'OTHER',
}

export enum DealStage {
  DISCOVERY = 'DISCOVERY',
  QUALIFICATION = 'QUALIFICATION',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  CONTRACT_SENT = 'CONTRACT_SENT',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
}

export enum ProjectCategory {
  WEB_DEVELOPMENT = 'WEB_DEVELOPMENT',
  MOBILE_APP = 'MOBILE_APP',
  SAAS_DEVELOPMENT = 'SAAS_DEVELOPMENT',
  AI_ML = 'AI_ML',
  SOFTWARE_MAINTENANCE = 'SOFTWARE_MAINTENANCE',
  IT_CONSULTING = 'IT_CONSULTING',
}

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  TESTING = 'TESTING',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ProjectBillingType {
  FIXED_COST = 'FIXED_COST',
  TIME_AND_MATERIALS = 'TIME_AND_MATERIALS',
  MONTHLY_RETAINER = 'MONTHLY_RETAINER',
}

export enum TaskType {
  TASK = 'TASK',
  BUG = 'BUG',
  FEATURE_REQUEST = 'FEATURE_REQUEST',
  IMPROVEMENT = 'IMPROVEMENT',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  CODE_REVIEW = 'CODE_REVIEW',
  IN_TESTING = 'IN_TESTING',
  DONE = 'DONE',
}

export enum SprintStatus {
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export enum TimesheetStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  STRIPE = 'STRIPE',
  BANK_TRANSFER = 'BANK_TRANSFER',
  PAYPAL = 'PAYPAL',
  CREDIT_CARD = 'CREDIT_CARD',
  OTHER = 'OTHER',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_CLIENT = 'PENDING_CLIENT',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum WorkflowTriggerType {
  DEAL_WON = 'DEAL_WON',
  DEAL_CREATED = 'DEAL_CREATED',
  LEAD_CREATED = 'LEAD_CREATED',
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_ASSIGNED = 'PROJECT_ASSIGNED',
  TASK_OVERDUE = 'TASK_OVERDUE',
  TASK_COMPLETED = 'TASK_COMPLETED',
  INVOICE_OVERDUE = 'INVOICE_OVERDUE',
  MILESTONE_APPROVED = 'MILESTONE_APPROVED',
  TICKET_CREATED = 'TICKET_CREATED',
}

export enum WorkflowActionType {
  SEND_EMAIL = 'SEND_EMAIL',
  CREATE_PROJECT = 'CREATE_PROJECT',
  ASSIGN_TASK = 'ASSIGN_TASK',
  SEND_NOTIFICATION = 'SEND_NOTIFICATION',
  UPDATE_STATUS = 'UPDATE_STATUS',
  CALL_WEBHOOK = 'CALL_WEBHOOK',
}

// User & Auth Context
export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  isSuperAdmin?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatarUrl?: string;
    organization: {
      id: string;
      name: string;
      slug: string;
      logoUrl?: string;
      plan: SubscriptionTier;
    };
  };
}

// Executive Dashboard Metrics
export interface DashboardMetrics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  newClients: number;
  activeLeads: number;
  leadConversionRate: number;
  activeProjects: number;
  completedProjects: number;
  delayedProjects: number;
  pendingInvoicesCount: number;
  outstandingPayments: number;
  teamProductivity: number;
  projectProfitability: number;
  revenueChart: Array<{ month: string; revenue: number; target: number; expenses: number }>;
  projectStatusDistribution: Array<{ name: string; value: number; color: string }>;
  salesFunnel: Array<{ stage: string; count: number; value: number }>;
  recentActivities: Array<{ id: string; user: string; action: string; time: string; type: string }>;
  upcomingDeadlines: Array<{ id: string; title: string; project: string; dueDate: string; priority: Priority }>;
  aiBusinessInsights: string[];
}
