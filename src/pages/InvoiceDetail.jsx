import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateInvoiceStatus } from '../store/slices/invoiceSlice';
import { ArrowLeft, Printer, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const invoice = useSelector((state) => 
    state.invoices.list.find(inv => inv.id === id)
  );

  if (!invoice) {
    return (
      <div className="card text-muted" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <AlertCircle size={48} style={{ margin: '0 auto 1rem', display: 'block', color: 'hsl(0, 84%, 60%)' }} />
        <h3>Document Not Found</h3>
        <p style={{ marginTop: '0.5rem' }}>We couldn't find a document with the ID: {id}</p>
        <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '1.5rem' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleStatusChange = (newStatus) => {
    dispatch(updateInvoiceStatus({ id: invoice.id, status: newStatus }));
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid': return <CheckCircle2 size={16} />;
      case 'Sent': return <Send size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  return (
    <div className="invoice-detail-page">
      {/* Detail Action Toolbar */}
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-secondary btn-icon-only" onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Document Preview</h1>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>View details or export this document.</p>
          </div>
        </div>

        <div className="flex gap-2" style={{ alignItems: 'center' }}>
          <div className="flex gap-2" style={{ marginRight: '1rem' }}>
            <button 
              className={`btn btn-secondary ${invoice.status === 'Draft' ? 'btn-primary' : ''}`}
              onClick={() => handleStatusChange('Draft')}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            >
              Draft
            </button>
            <button 
              className={`btn btn-secondary ${invoice.status === 'Sent' ? 'btn-primary' : ''}`}
              onClick={() => handleStatusChange('Sent')}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            >
              Sent
            </button>
            <button 
              className={`btn btn-secondary ${invoice.status === 'Paid' ? 'btn-primary' : ''}`}
              onClick={() => handleStatusChange('Paid')}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            >
              Paid
            </button>
          </div>

          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Styled Printable Invoice Paper */}
      <div className="card" style={{ padding: '3rem', maxWidth: '850px', margin: '0 auto', boxShadow: 'var(--shadow-lg)' }}>
        
        {/* Document Header */}
        <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '3rem' }}>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '0.25rem' }}>
              TECHNOPIXAR
            </div>
            <div className="text-muted" style={{ fontSize: '0.85rem' }}>
              100 Tech Park, Suite 400<br />
              Silicon Valley, CA 94025<br />
              billing@technopixar.com
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {invoice.type}
            </div>
            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: '0.25rem' }}>
              #{invoice.id}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', backgroundColor: invoice.status === 'Paid' ? 'var(--status-paid-bg)' : invoice.status === 'Sent' ? 'var(--status-sent-bg)' : 'var(--status-draft-bg)', color: invoice.status === 'Paid' ? 'var(--status-paid-text)' : invoice.status === 'Sent' ? 'var(--status-sent-text)' : 'var(--status-draft-text)' }}>
              {getStatusIcon(invoice.status)}
              {invoice.status}
            </div>
          </div>
        </div>

        {/* Billing Information Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          <div>
            <div className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Billed To
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
              {invoice.clientName}
            </div>
            <div className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Client Accounts Department
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Document Date
            </div>
            <div style={{ fontWeight: 600 }}>
              {invoice.date}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="table-container" style={{ borderRadius: 'var(--radius-sm)', border: 'none', boxShadow: 'none', borderBottom: '2px solid var(--border-color)' }}>
          <table className="table">
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ backgroundColor: 'transparent', padding: '0.75rem 0' }}>Description</th>
                <th style={{ backgroundColor: 'transparent', padding: '0.75rem 0', textAlign: 'center', width: '10%' }}>Qty</th>
                <th style={{ backgroundColor: 'transparent', padding: '0.75rem 0', textAlign: 'right', width: '20%' }}>Unit Price</th>
                <th style={{ backgroundColor: 'transparent', padding: '0.75rem 0', textAlign: 'right', width: '20%' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td style={{ padding: '1rem 0', fontWeight: 500 }}>{item.description}</td>
                  <td style={{ padding: '1rem 0', textAlign: 'center' }} className="text-muted">{item.qty}</td>
                  <td style={{ padding: '1rem 0', textAlign: 'right' }} className="text-muted">{formatCurrency(item.unitPrice)}</td>
                  <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.qty * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Calculations Breakdown */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            
            <div className="flex-between" style={{ fontSize: '0.9rem' }}>
              <span className="text-muted">Subtotal:</span>
              <span style={{ fontWeight: 500 }}>{formatCurrency(invoice.subtotal)}</span>
            </div>

            {invoice.discountAmount > 0 && (
              <div className="flex-between" style={{ fontSize: '0.9rem' }}>
                <span className="text-muted">Discount ({invoice.discountPercent}%):</span>
                <span style={{ fontWeight: 500, color: 'var(--status-draft-text)' }}>-{formatCurrency(invoice.discountAmount)}</span>
              </div>
            )}

            <div className="flex-between" style={{ fontSize: '0.9rem' }}>
              <span className="text-muted">Tax ({invoice.taxPercent}%):</span>
              <span style={{ fontWeight: 500 }}>+{formatCurrency(invoice.taxAmount)}</span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.25rem 0' }} />

            <div className="flex-between" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              <span>Total Due:</span>
              <span style={{ color: 'var(--accent)' }}>{formatCurrency(invoice.grandTotal)}</span>
            </div>
            
          </div>
        </div>

        {/* Terms Footer */}
        <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '4rem', paddingTop: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Terms & Notes
          </div>
          <div className="text-muted" style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
            Please send payment within 30 days of receiving this invoice. If you have any questions, feel free to email accounts@technopixar.com. Thank you for your partnership!
          </div>
        </div>

      </div>
    </div>
  );
};

export default InvoiceDetail;
