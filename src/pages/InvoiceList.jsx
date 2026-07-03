import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateInvoiceStatus, deleteInvoice } from '../store/slices/invoiceSlice';
import {
  Eye,
  Trash2,
  Plus,
  Search,
  TrendingUp,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  Send
} from 'lucide-react';

const InvoiceList = () => {
  const invoices = useSelector((state) => state.invoices.list);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalPaid = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalOutstanding = invoices
    .filter(inv => inv.status !== 'Paid')
    .reduce((sum, inv) => sum + inv.grandTotal, 0);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'All' || inv.type === filterType;
    const matchesStatus = filterStatus === 'All' || inv.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateInvoiceStatus({ id, status: newStatus }));
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete ${id}?`)) {
      dispatch(deleteInvoice(id));
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Paid': return 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-status-paid-bg text-status-paid-text';
      case 'Sent': return 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-status-sent-bg text-status-sent-text';
      default: return 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-status-draft-bg text-status-draft-text';
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Billing Dashboard</h1>
          <p className="text-text-muted text-sm mt-1">Manage your invoices, quotations, and financial documents.</p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-md shadow-sm transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          onClick={() => navigate('/new')}
        >
          <Plus size={18} />
          Create New Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-bg-secondary border border-border-color rounded-xl p-6 shadow-sm flex items-center gap-4 transition-colors duration-250">
          <div className="p-3.5 rounded-lg bg-accent-light/10 text-accent">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-text-muted text-xs font-medium uppercase tracking-wider">Total Documented</p>
            <h3 className="text-2xl font-bold text-text-primary mt-1">{formatCurrency(totalInvoiced)}</h3>
          </div>
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-xl p-6 shadow-sm flex items-center gap-4 transition-colors duration-250">
          <div className="p-3.5 rounded-lg bg-status-paid-bg text-status-paid-text">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-text-muted text-xs font-medium uppercase tracking-wider">Total Paid Recieved</p>
            <h3 className="text-2xl font-bold text-status-paid-text mt-1">{formatCurrency(totalPaid)}</h3>
          </div>
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-xl p-6 shadow-sm flex items-center gap-4 transition-colors duration-250">
          <div className="p-3.5 rounded-lg bg-status-sent-bg text-status-sent-text">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-text-muted text-xs font-medium uppercase tracking-wider">Outstanding Balance</p>
            <h3 className="text-2xl font-bold text-status-sent-text mt-1">{formatCurrency(totalOutstanding)}</h3>
          </div>
        </div>
      </div>

      <div className="bg-bg-secondary border border-border-color rounded-xl p-6 shadow-sm mb-6 transition-colors duration-250">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-text-secondary mb-1.5">Search Client or ID</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-border-color bg-bg-secondary text-text-primary focus:outline-none focus:border-border-focus focus:ring-3 focus:ring-accent/15 transition-all duration-150"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={16} className="text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-text-secondary mb-1.5">Type</label>
            <select
              className="w-full px-3.5 py-2.5 rounded-md border border-border-color bg-bg-secondary text-text-primary focus:outline-none focus:border-border-focus focus:ring-3 focus:ring-accent/15 transition-all duration-150 cursor-pointer"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Invoice">Invoices</option>
              <option value="Quotation">Quotations</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-text-secondary mb-1.5">Status</label>
            <select
              className="w-full px-3.5 py-2.5 rounded-md border border-border-color bg-bg-secondary text-text-primary focus:outline-none focus:border-border-focus focus:ring-3 focus:ring-accent/15 transition-all duration-150 cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="bg-bg-secondary border border-border-color rounded-xl p-12 text-center text-text-muted transition-colors duration-250">
          <FileText size={48} className="mx-auto mb-4 opacity-50 text-text-muted" />
          <h3 className="text-lg font-bold text-text-primary">No Documents Found</h3>
          <p className="text-sm mt-1">Try adjusting your filters or search query, or create a new invoice/quotation.</p>
        </div>
      ) : (
        <div className="bg-bg-secondary border border-border-color rounded-xl shadow-sm overflow-x-auto mb-6 transition-colors duration-250">
          <table className="w-full border-collapse text-left min-w-[900px]">
            <thead>
              <tr className="bg-bg-tertiary/50 border-b border-border-color">
                <th className="px-6 py-4 font-semibold text-text-secondary text-xs uppercase tracking-wider">Document ID</th>
                <th className="px-6 py-4 font-semibold text-text-secondary text-xs uppercase tracking-wider">Client Name</th>
                <th className="px-6 py-4 font-semibold text-text-secondary text-xs uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 font-semibold text-text-secondary text-xs uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 font-semibold text-text-secondary text-xs uppercase tracking-wider">Grand Total</th>
                <th className="px-6 py-4 font-semibold text-text-secondary text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold text-text-secondary text-xs uppercase tracking-wider">Quick Update</th>
                <th className="px-6 py-4 font-semibold text-text-secondary text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-border-color hover:bg-bg-tertiary/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-text-primary text-sm">{invoice.id}</td>
                  <td className="px-6 py-4 text-text-primary text-sm font-medium">{invoice.clientName}</td>
                  <td className="px-6 py-4 text-text-secondary text-sm">{invoice.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`font-semibold ${invoice.type === 'Invoice' ? 'text-accent' : 'text-text-secondary'}`}>
                      {invoice.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-text-primary text-sm">{formatCurrency(invoice.grandTotal)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={getStatusBadgeClass(invoice.status)}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      className="px-2 py-1 rounded border border-border-color bg-bg-secondary text-text-primary focus:outline-none focus:border-border-focus text-xs font-semibold cursor-pointer"
                      value={invoice.status}
                      onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        className="p-2 rounded-full border border-border-color bg-bg-tertiary hover:bg-border-color text-text-primary transition-colors flex items-center justify-center cursor-pointer"
                        onClick={() => navigate(`/preview/${invoice.id}`)}
                        title="View Preview"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        className="p-2 rounded-full border border-border-color bg-bg-tertiary hover:border-color text-red-500 hover:bg-red-500/10 transition-colors flex items-center justify-center cursor-pointer"
                        onClick={() => handleDelete(invoice.id)}
                        title="Delete Document"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
