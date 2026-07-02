import { createSlice } from '@reduxjs/toolkit';

// Helper to calculate totals for an invoice
export const calculateTotals = (items, taxPercent = 0, discountPercent = 0) => {
  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (taxPercent / 100);
  const grandTotal = taxableAmount + taxAmount;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2))
  };
};

const initialMockInvoices = [
  {
    id: 'INV-2026-001',
    type: 'Invoice',
    clientName: 'Acme Corporation',
    date: '2026-06-15',
    items: [
      { id: '1', description: 'Enterprise Software License', qty: 1, unitPrice: 1200 },
      { id: '2', description: 'Premium Support (Annual)', qty: 1, unitPrice: 300 }
    ],
    taxPercent: 18,
    discountPercent: 10,
    status: 'Paid',
    subtotal: 1500,
    discountAmount: 150,
    taxAmount: 243,
    grandTotal: 1593
  },
  {
    id: 'QTN-2026-002',
    type: 'Quotation',
    clientName: 'Globex Industries',
    date: '2026-06-28',
    items: [
      { id: '1', description: 'Cloud Infrastructure Setup', qty: 1, unitPrice: 2500 },
      { id: '2', description: 'Consulting Hours', qty: 10, unitPrice: 120 }
    ],
    taxPercent: 15,
    discountPercent: 5,
    status: 'Sent',
    subtotal: 3700,
    discountAmount: 185,
    taxAmount: 527.25,
    grandTotal: 4042.25
  },
  {
    id: 'INV-2026-003',
    type: 'Invoice',
    clientName: 'Stark Industries',
    date: '2026-07-02',
    items: [
      { id: '1', description: 'Arc Reactor Core Assembly', qty: 2, unitPrice: 7500 }
    ],
    taxPercent: 20,
    discountPercent: 0,
    status: 'Draft',
    subtotal: 15000,
    discountAmount: 0,
    taxAmount: 3000,
    grandTotal: 18000
  }
];

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState: {
    list: initialMockInvoices
  },
  reducers: {
    addInvoice: (state, action) => {
      const { type, clientName, date, items, taxPercent, discountPercent } = action.payload;
      const calculated = calculateTotals(items, taxPercent, discountPercent);
      const prefix = type === 'Invoice' ? 'INV' : 'QTN';
      const year = new Date().getFullYear();
      const uniqueId = `${prefix}-${year}-${Math.floor(1000 + Math.random() * 9000)}`;

      state.list.unshift({
        id: uniqueId,
        type,
        clientName,
        date: date || new Date().toISOString().split('T')[0],
        items,
        taxPercent,
        discountPercent,
        status: 'Draft', // default status
        ...calculated
      });
    },
    updateInvoiceStatus: (state, action) => {
      const { id, status } = action.payload;
      const invoice = state.list.find(inv => inv.id === id);
      if (invoice) {
        invoice.status = status;
      }
    },
    deleteInvoice: (state, action) => {
      const id = action.payload;
      state.list = state.list.filter(inv => inv.id !== id);
    }
  }
});

export const { addInvoice, updateInvoiceStatus, deleteInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;
