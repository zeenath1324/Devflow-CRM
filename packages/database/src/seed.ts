import { PrismaClient, UserRole, SubscriptionTier, ProjectCategory, ProjectStatus, TaskStatus, Priority, DealStage, LeadStatus, InvoiceStatus, TicketStatus, WorkflowTriggerType, WorkflowActionType } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// Simple sha256 or argon2 fallback for password hashing in seed
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('Seeding DEVFLOW CRM enterprise demo data...');

  // 1. Create Organization (Tenant)
  const org = await prisma.organization.upsert({
    where: { slug: 'nexus-labs' },
    update: {},
    create: {
      name: 'Nexus Software Labs',
      slug: 'nexus-labs',
      plan: SubscriptionTier.ENTERPRISE,
      currency: 'USD',
    },
  });

  console.log(`Created Organization: ${org.name} (${org.id})`);

  // 2. Create Users across roles
  const passwordHash = hashPassword('DevFlow@2026!');

  const owner = await prisma.user.upsert({
    where: { email: 'owner@nexuslabs.dev' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'owner@nexuslabs.dev',
      passwordHash,
      firstName: 'Marcus',
      lastName: 'Vance',
      role: UserRole.COMPANY_OWNER,
    },
  });

  const pm = await prisma.user.upsert({
    where: { email: 'pm@nexuslabs.dev' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'pm@nexuslabs.dev',
      passwordHash,
      firstName: 'Elena',
      lastName: 'Rostova',
      role: UserRole.PROJECT_MANAGER,
    },
  });

  const dev = await prisma.user.upsert({
    where: { email: 'dev@nexuslabs.dev' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'dev@nexuslabs.dev',
      passwordHash,
      firstName: 'Alex',
      lastName: 'Chen',
      role: UserRole.DEVELOPER,
    },
  });

  const clientUser = await prisma.user.upsert({
    where: { email: 'client@fintech.io' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'client@fintech.io',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Jenkins',
      role: UserRole.CLIENT,
    },
  });

  // Employee profiles
  await prisma.employeeProfile.upsert({
    where: { userId: dev.id },
    update: {},
    create: {
      userId: dev.id,
      department: 'Core Engineering',
      jobTitle: 'Senior Full-Stack Engineer',
      hourlyRate: 85.00,
      skills: ['TypeScript', 'Next.js', 'NestJS', 'PostgreSQL', 'Docker'],
      availabilityHoursPerWeek: 40,
    },
  });

  // 3. Create Clients
  const client1 = await prisma.client.create({
    data: {
      organizationId: org.id,
      name: 'Apex Fintech Solutions',
      industry: 'Financial Services',
      website: 'https://apexfintech.io',
      primaryContactName: 'Sarah Jenkins',
      primaryContactEmail: 'client@fintech.io',
      primaryContactPhone: '+1-415-555-0199',
      healthScore: 94,
      status: 'ACTIVE',
      notes: 'High-value enterprise client with ongoing SaaS modernization needs.',
    },
  });

  const client2 = await prisma.client.create({
    data: {
      organizationId: org.id,
      name: 'BioHealth Dynamics',
      industry: 'HealthTech & AI',
      website: 'https://biohealth.ai',
      primaryContactName: 'Dr. Gregory House',
      primaryContactEmail: 'greg@biohealth.ai',
      healthScore: 88,
      status: 'ACTIVE',
    },
  });

  // 4. Create Leads
  await prisma.lead.createMany({
    data: [
      {
        organizationId: org.id,
        title: 'Global Logistics Portal Redesign',
        companyName: 'TransGlobal Freight',
        contactName: 'David Sterling',
        email: 'dsterling@transglobal.com',
        source: 'CLUTCH',
        estimatedValue: 48000.00,
        score: 85,
        status: LeadStatus.QUALIFIED,
      },
      {
        organizationId: org.id,
        title: 'AI Diagnostic Mobile App',
        companyName: 'NeuroScan Inc',
        contactName: 'Lisa Cuddy',
        email: 'lcuddy@neuroscan.med',
        source: 'WEBSITE',
        estimatedValue: 75000.00,
        score: 92,
        status: LeadStatus.PROPOSAL_SENT,
      },
    ],
  });

  // 5. Create Deals
  const deal1 = await prisma.deal.create({
    data: {
      organizationId: org.id,
      title: 'Apex Institutional Trading Web Portal',
      clientId: client1.id,
      value: 120000.00,
      stage: DealStage.NEGOTIATION,
      probability: 80,
      dealOwnerId: owner.id,
      expectedCloseDate: new Date(Date.now() + 15 * 86400000),
    },
  });

  // 6. Create Projects
  const project1 = await prisma.project.create({
    data: {
      organizationId: org.id,
      clientId: client1.id,
      name: 'Apex Core Banking Platform V2',
      category: ProjectCategory.SAAS_DEVELOPMENT,
      budget: 180000.00,
      actualCost: 65000.00,
      status: ProjectStatus.ACTIVE,
      projectManagerId: pm.id,
      description: 'End-to-end cloud-native microservices architecture for real-time asset settlement.',
      startDate: new Date(Date.now() - 30 * 86400000),
      targetDeliveryDate: new Date(Date.now() + 60 * 86400000),
    },
  });

  // 7. Sprints & Tasks
  const sprint1 = await prisma.sprint.create({
    data: {
      projectId: project1.id,
      name: 'Sprint 04 - Trading Engine & WebSockets',
      goal: 'Achieve sub-50ms order matching latency with real-time push updates.',
      startDate: new Date(Date.now() - 7 * 86400000),
      endDate: new Date(Date.now() + 7 * 86400000),
      status: 'ACTIVE',
    },
  });

  await prisma.task.createMany({
    data: [
      {
        projectId: project1.id,
        sprintId: sprint1.id,
        title: 'Implement Redis Pub/Sub WebSocket Stream',
        description: 'Broadcast book updates to subscribed UI clients with backpressure control.',
        type: 'TASK',
        priority: Priority.HIGH,
        status: TaskStatus.IN_PROGRESS,
        estimatedHours: 16,
        actualHours: 8,
        assigneeId: dev.id,
      },
      {
        projectId: project1.id,
        sprintId: sprint1.id,
        title: 'Fix race condition during concurrent order cancellations',
        description: 'P1 Bug: Two simultaneous cancel requests occasionally result in unhandled DB lock.',
        type: 'BUG',
        priority: Priority.URGENT,
        status: TaskStatus.TODO,
        estimatedHours: 6,
        actualHours: 0,
        assigneeId: dev.id,
      },
      {
        projectId: project1.id,
        sprintId: sprint1.id,
        title: 'Automated Playwright E2E tests for Order Booking',
        description: 'Cover deposit -> buy order -> portfolio balance refresh flow.',
        type: 'TASK',
        priority: Priority.MEDIUM,
        status: TaskStatus.DONE,
        estimatedHours: 12,
        actualHours: 10,
        assigneeId: dev.id,
      },
    ],
  });

  // 8. Invoices & Payments
  const invoice1 = await prisma.invoice.create({
    data: {
      organizationId: org.id,
      clientId: client1.id,
      projectId: project1.id,
      invoiceNumber: 'INV-2026-001',
      issueDate: new Date(Date.now() - 10 * 86400000),
      dueDate: new Date(Date.now() + 20 * 86400000),
      subtotal: 45000.00,
      taxRate: 5.0,
      taxAmount: 2250.00,
      totalAmount: 47250.00,
      paidAmount: 47250.00,
      status: InvoiceStatus.PAID,
      notes: 'Milestone 1 Completion - Core Architecture landed.',
      items: {
        create: [
          {
            description: 'Sprint 1 & 2 Deliverables - Database Architecture & Auth',
            quantity: 1,
            unitPrice: 30000.00,
            amount: 30000.00,
          },
          {
            description: 'API Gateway & Cloud Infrastructure Provisioning',
            quantity: 1,
            unitPrice: 15000.00,
            amount: 15000.00,
          },
        ],
      },
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: invoice1.id,
      amount: 47250.00,
      paymentMethod: 'STRIPE',
      reference: 'ch_3Nkd982LKx9812A',
      notes: 'Cleared via Stripe ACH',
    },
  });

  // 9. Support Ticket
  await prisma.ticket.create({
    data: {
      organizationId: org.id,
      clientId: client1.id,
      projectId: project1.id,
      title: 'Staging Environment API Rate Limit Question',
      description: 'We are running load tests on our integration sandbox. Could you increase our throttle limits?',
      priority: Priority.MEDIUM,
      status: TicketStatus.IN_PROGRESS,
      assignedToId: dev.id,
      slaHours: 24,
    },
  });

  // 10. Visual Workflow Automation rule
  await prisma.workflowAutomation.create({
    data: {
      organizationId: org.id,
      name: 'Deal Won → Auto-provision Project & Notify PM',
      description: 'When any sales deal reaches CLOSED_WON, automatically create an active project shell and alert the Project Manager.',
      triggerType: WorkflowTriggerType.DEAL_WON,
      actionType: WorkflowActionType.CREATE_PROJECT,
      isActive: true,
      conditions: [{ field: 'value', operator: 'gte', value: 10000 }],
      actionPayload: { defaultStatus: 'PLANNING', notifyRoles: ['PROJECT_MANAGER', 'TECHNICAL_LEAD'] },
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
