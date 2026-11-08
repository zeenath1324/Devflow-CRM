import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { dataStore, InvoiceEntity } from '../../store/data-service';
import { invoiceSchema } from '@devflow/validation';
import { InvoiceStatus } from '@devflow/shared-types';

export const financeRouter = Router();

// List invoices
financeRouter.get('/invoices', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const { status, clientId } = req.query;

  let results = dataStore.invoices.filter((i) => i.organizationId === orgId);

  if (status && typeof status === 'string' && status !== 'ALL') {
    results = results.filter((i) => i.status === status);
  }

  if (clientId && typeof clientId === 'string') {
    results = results.filter((i) => i.clientId === clientId);
  }

  return res.json(results);
});

// Create invoice with itemized line items
financeRouter.post('/invoices', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const parseResult = invoiceSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }

  const orgId = req.organizationId!;
  const data = parseResult.data;
  const client = dataStore.clients.find((c) => c.id === data.clientId);
  const project = data.projectId ? dataStore.projects.find((p) => p.id === data.projectId) : undefined;

  const items = data.items.map((it) => ({
    description: it.description,
    quantity: it.quantity,
    unitPrice: it.unitPrice,
    amount: it.quantity * it.unitPrice,
  }));

  const subtotal = items.reduce((acc, it) => acc + it.amount, 0);
  const taxAmount = (subtotal * data.taxRate) / 100;
  const totalAmount = subtotal + taxAmount;

  const newInvoice: InvoiceEntity = {
    id: `inv-${Date.now()}`,
    organizationId: orgId,
    clientId: data.clientId,
    clientName: client ? client.name : 'Client',
    projectId: data.projectId || undefined,
    projectName: project ? project.name : undefined,
    invoiceNumber: data.invoiceNumber,
    issueDate: data.issueDate,
    dueDate: data.dueDate,
    subtotal,
    taxRate: data.taxRate,
    taxAmount,
    totalAmount,
    paidAmount: 0,
    status: InvoiceStatus.SENT,
    items,
    notes: data.notes || '',
  };

  dataStore.invoices.unshift(newInvoice);
  return res.status(201).json(newInvoice);
});

// Record a payment against an invoice
financeRouter.post('/invoices/:id/payments', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const { amount, paymentMethod, reference } = req.body;

  const invoice = dataStore.invoices.find((i) => i.id === req.params.id && i.organizationId === orgId);
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }

  const payAmt = Number(amount) || 0;
  invoice.paidAmount += payAmt;

  if (invoice.paidAmount >= invoice.totalAmount) {
    invoice.status = InvoiceStatus.PAID;
  } else if (invoice.paidAmount > 0) {
    invoice.status = InvoiceStatus.PARTIALLY_PAID;
  }

  return res.json({
    message: 'Payment recorded successfully',
    invoice,
    payment: {
      amount: payAmt,
      paymentMethod,
      reference,
      date: new Date().toISOString(),
    },
  });
});

// Get financial overview / profit margins
financeRouter.get('/overview', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.organizationId!;
  const invoices = dataStore.invoices.filter((i) => i.organizationId === orgId);
  const projects = dataStore.projects.filter((p) => p.organizationId === orgId);

  const totalInvoiced = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalOutstanding = totalInvoiced - totalCollected;

  const projectMargins = projects.map((p) => {
    const profit = p.budget - p.actualCost;
    const marginPercent = p.budget > 0 ? Math.round((profit / p.budget) * 100) : 50;
    return {
      projectId: p.id,
      name: p.name,
      client: p.clientName,
      budget: p.budget,
      cost: p.actualCost,
      profit,
      marginPercent,
    };
  });

  return res.json({
    totalInvoiced,
    totalCollected,
    totalOutstanding,
    projectMargins,
  });
});
