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

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Stats calculation
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalPaid = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalOutstanding = invoices
    .filter(inv => inv.status !== 'Paid')
    .reduce((sum, inv) => sum + inv.grandTotal, 0);

  // Filter invoices
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
      case 'Paid': return 'badge badge-paid';
      case 'Sent': return 'badge badge-sent';
      default: return 'badge badge-draft';
    }
  };

  return (
    <div className="invoice-list-page">
      {/* Premium Dashboard Metrics */}
      <div className="dashboard-header flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>Billing Dashboard</h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>Manage your invoices, quotations, and financial documents.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/new')}>
          <Plus size={18} />
          Create New Document
        </button>
      </div>

      <div className="form-grid" style={{ marginBottom: '2.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card flex" style={{ gap: '1rem', alignItems: 'center', marginBottom: 0 }}>
          <div style={{ backgroundColor: 'var(--accent-light)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <TrendingUp size={24} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Total Documented</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatCurrency(totalInvoiced)}</h3>
          </div>
        </div>

        <div className="card flex" style={{ gap: '1rem', alignItems: 'center', marginBottom: 0 }}>
          <div style={{ backgroundColor: 'hsl(150, 100%, 95%)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <DollarSign size={24} style={{ color: 'hsl(150, 80%, 25%)' }} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Total Paid Recieved</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--status-paid-text)' }}>{formatCurrency(totalPaid)}</h3>
          </div>
        </div>

        <div className="card flex" style={{ gap: '1rem', alignItems: 'center', marginBottom: 0 }}>
          <div style={{ backgroundColor: 'hsl(35, 100%, 95%)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
            <Clock size={24} style={{ color: 'hsl(35, 90%, 35%)' }} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Outstanding Balance</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--status-sent-text)' }}>{formatCurrency(totalOutstanding)}</h3>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="form-grid" style={{ gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Search Client or ID</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search..."
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search size={16} className="text-muted" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Type</label>
            <select className="form-control" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Invoice">Invoices</option>
              <option value="Quotation">Quotations</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Status</label>
            <select className="form-control" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listing Content */}
      {filteredInvoices.length === 0 ? (
        <div className="card text-muted" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <FileText size={48} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.5 }} />
          <h3>No Documents Found</h3>
          <p style={{ marginTop: '0.5rem' }}>Try adjusting your filters or search query, or create a new invoice/quotation.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Document ID</th>
                <th>Client Name</th>
                <th>Date</th>
                <th>Type</th>
                <th>Grand Total</th>
                <th>Status</th>
                <th>Quick Status Update</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{invoice.id}</td>
                  <td>{invoice.clientName}</td>
                  <td className="text-muted">{invoice.date}</td>
                  <td>
                    <span style={{ fontWeight: 500, color: invoice.type === 'Invoice' ? 'var(--accent)' : 'var(--text-secondary)' }}>
                      {invoice.type}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{formatCurrency(invoice.grandTotal)}</td>
                  <td>
                    <span className={getStatusBadgeClass(invoice.status)}>
                      {invoice.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-control"
                      value={invoice.status}
                      onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                      style={{ padding: '0.25rem 0.5rem', width: 'auto', fontSize: '0.85rem' }}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </td>
                  <td className="text-right">
                    <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
                      <button 
                        className="btn btn-secondary btn-icon-only" 
                        onClick={() => navigate(`/preview/${invoice.id}`)}
                        title="View Preview"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="btn btn-danger btn-icon-only" 
                        onClick={() => handleDelete(invoice.id)}
                        title="Delete Document"
                      >
                        <Trash2 size={16} />
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
