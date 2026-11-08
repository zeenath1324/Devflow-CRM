'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { apiFetch } from '../../lib/api';
import {
  Receipt,
  Plus,
  DollarSign,
  TrendingUp,
  CreditCard,
  Building,
  CheckCircle2,
  Calendar,
  FileText,
} from 'lucide-react';

export default function FinancePage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Invoice Form
  const [clientId, setClientId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
  const [itemDesc, setItemDesc] = useState('Core Engineering Sprints (80 hrs)');
  const [itemQty, setItemQty] = useState(1);
  const [itemPrice, setItemPrice] = useState(16000);
  const [taxRate, setTaxRate] = useState(5.0);

  // Payment Form
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('STRIPE');
  const [reference, setReference] = useState('');

  const loadData = async () => {
    try {
      const [invData, clientData, overData] = await Promise.all([
        apiFetch<any[]>('/finance/invoices'),
        apiFetch<any[]>('/clients'),
        apiFetch<any>('/finance/overview'),
      ]);
      setInvoices(invData);
      setClients(clientData);
      setOverview(overData);
      if (clientData.length > 0) setClientId(clientData[0].id);
    } catch (e) {
      console.warn('Finance fallback data:', e);
      setInvoices([
        {
          id: 'inv-001',
          clientName: 'Apex Fintech Solutions',
          projectName: 'Apex Core Banking Platform V2',
          invoiceNumber: 'INV-2026-001',
          issueDate: '2026-02-15',
          dueDate: '2026-03-15',
          subtotal: 45000,
          taxRate: 5.0,
          taxAmount: 2250,
          totalAmount: 47250,
          paidAmount: 47250,
          status: 'PAID',
        },
        {
          id: 'inv-002',
          clientName: 'BioHealth Dynamics',
          projectName: 'BioHealth Cloud EHR Connector',
          invoiceNumber: 'INV-2026-002',
          issueDate: '2026-03-01',
          dueDate: '2026-03-31',
          subtotal: 28000,
          taxRate: 5.0,
          taxAmount: 1400,
          totalAmount: 29400,
          paidAmount: 0,
          status: 'SENT',
        },
      ]);
      setOverview({
        totalInvoiced: 76650,
        totalCollected: 47250,
        totalOutstanding: 29400,
        projectMargins: [
          { name: 'Apex Core Banking Platform V2', client: 'Apex Fintech Solutions', budget: 180000, cost: 72000, profit: 108000, marginPercent: 60 },
          { name: 'BioHealth Cloud EHR Connector', client: 'BioHealth Dynamics', budget: 95000, cost: 41000, profit: 54000, marginPercent: 57 },
        ],
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/finance/invoices', {
        method: 'POST',
        body: JSON.stringify({
          clientId: clientId || clients[0]?.id || 'cli-001',
          invoiceNumber,
          issueDate,
          dueDate,
          items: [
            {
              description: itemDesc,
              quantity: Number(itemQty),
              unitPrice: Number(itemPrice),
            },
          ],
          taxRate: Number(taxRate),
        }),
      });
      setInvoiceModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(`Error creating invoice: ${err.message}`);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    try {
      await apiFetch(`/finance/invoices/${selectedInvoice.id}/payments`, {
        method: 'POST',
        body: JSON.stringify({
          amount: Number(paymentAmount),
          paymentMethod,
          reference,
        }),
      });
      setPaymentModalOpen(false);
      setSelectedInvoice(null);
      loadData();
      alert('Payment applied successfully!');
    } catch (err: any) {
      alert(`Error recording payment: ${err.message}`);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Receipt className="text-devflow-emerald" />
            Financial Management & Invoicing
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Precise decimal money calculations, itemized client billing, and project profitability margins
          </p>
        </div>

        <button
          onClick={() => setInvoiceModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-devflow-violet to-devflow-cyan text-white text-xs font-semibold shadow-lg shadow-devflow-violet/20 hover:brightness-110 transition-all"
        >
          <Plus size={16} />
          <span>Generate Itemized Invoice</span>
        </button>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-devflow-card border border-devflow-border">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Invoiced</span>
          <span className="text-2xl font-black text-white font-mono">
            ${(overview?.totalInvoiced || 76650).toLocaleString()}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Total revenue committed to billing</p>
        </div>
        <div className="p-5 rounded-2xl bg-devflow-card border border-devflow-border">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Collected Cash</span>
          <span className="text-2xl font-black text-devflow-emerald font-mono">
            ${(overview?.totalCollected || 47250).toLocaleString()}
          </span>
          <p className="text-[11px] text-devflow-emerald mt-1">Cleared through ACH & Stripe</p>
        </div>
        <div className="p-5 rounded-2xl bg-devflow-card border border-devflow-border">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Outstanding Receivables</span>
          <span className="text-2xl font-black text-devflow-amber font-mono">
            ${(overview?.totalOutstanding || 29400).toLocaleString()}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Due within current billing cycle</p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl bg-devflow-card border border-devflow-border overflow-hidden mb-8">
        <div className="p-4 border-b border-devflow-border bg-devflow-secondaryBg flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-white">Client Invoices Ledger</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase tracking-wider font-semibold border-b border-devflow-border">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Paid</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-devflow-border">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-devflow-secondaryBg/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                  <td className="py-3.5 px-4 text-slate-200">{inv.clientName}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{inv.issueDate}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{inv.dueDate}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">${inv.totalAmount?.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-mono text-devflow-emerald">${inv.paidAmount?.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        inv.status === 'PAID'
                          ? 'bg-devflow-emerald/15 text-devflow-emerald border border-devflow-emerald/30'
                          : 'bg-devflow-amber/15 text-devflow-amber border border-devflow-amber/30'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {inv.status !== 'PAID' ? (
                      <button
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setPaymentAmount(inv.totalAmount - inv.paidAmount);
                          setPaymentModalOpen(true);
                        }}
                        className="text-xs font-semibold text-devflow-cyan hover:underline"
                      >
                        Record Payment
                      </button>
                    ) : (
                      <span className="text-slate-500 font-mono text-[11px]">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Profitability Margins */}
      <div className="rounded-2xl bg-devflow-card border border-devflow-border p-5">
        <h3 className="font-bold text-xs uppercase tracking-wider text-white mb-4">
          Software Project Profitability Margins (Budget vs Incurred Cost)
        </h3>

        <div className="space-y-3">
          {(overview?.projectMargins || []).map((pm: any, idx: number) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-devflow-secondaryBg border border-devflow-border flex items-center justify-between text-xs"
            >
              <div>
                <h4 className="font-bold text-white">{pm.name}</h4>
                <p className="text-[11px] text-slate-400">{pm.client}</p>
              </div>

              <div className="flex items-center gap-6 text-right font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">Budget</span>
                  <span className="text-white">${pm.budget?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Labor Cost</span>
                  <span className="text-devflow-amber">${pm.cost?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Gross Margin</span>
                  <span className="text-devflow-emerald font-bold">+{pm.marginPercent}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Invoice Modal */}
      {invoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-devflow-card border border-devflow-border rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-4">Generate Itemized Invoice</h3>
            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Invoice Number</label>
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white font-mono focus:outline-none focus:border-devflow-violet"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Client *</label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-devflow-secondaryBg border border-devflow-border space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Line Item Deliverable</span>
                <input
                  type="text"
                  required
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  placeholder="Deliverable description"
                  className="w-full px-3 py-1.5 bg-devflow-card border border-devflow-border rounded-lg text-white"
                />
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">Qty</label>
                    <input
                      type="number"
                      value={itemQty}
                      onChange={(e) => setItemQty(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-devflow-card border border-devflow-border rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Unit Price ($)</label>
                    <input
                      type="number"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-devflow-card border border-devflow-border rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-devflow-card border border-devflow-border rounded text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-devflow-border">
                <button
                  type="button"
                  onClick={() => setInvoiceModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-devflow-secondaryBg text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-devflow-emerald text-white font-semibold hover:brightness-110 transition-all shadow-md shadow-devflow-emerald/20"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-devflow-card border border-devflow-border rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-2">Record Client Payment</h3>
            <p className="text-xs text-slate-400 mb-4">
              Applying payment against <span className="font-mono text-white">{selectedInvoice?.invoiceNumber}</span>
            </p>
            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Amount ($ USD) *</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white font-mono focus:outline-none focus:border-devflow-violet"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white focus:outline-none focus:border-devflow-violet"
                >
                  <option value="STRIPE">Stripe Credit Card / ACH</option>
                  <option value="BANK_TRANSFER">Direct Wire / SWIFT</option>
                  <option value="PAYPAL">PayPal Business</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Transaction Reference #</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. wire_ref_9824021"
                  className="w-full px-3 py-2 bg-devflow-secondaryBg border border-devflow-border rounded-lg text-white font-mono focus:outline-none focus:border-devflow-violet"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-devflow-border">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-devflow-secondaryBg text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-devflow-cyan text-black font-bold hover:brightness-110 transition-all"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
