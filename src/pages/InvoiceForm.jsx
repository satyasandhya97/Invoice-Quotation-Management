import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addInvoice, calculateTotals } from '../store/slices/invoiceSlice';
import { Plus, Trash, Save, ArrowLeft } from 'lucide-react';

const InvoiceForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [type, setType] = useState('Invoice');
  const [clientName, setClientName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [taxPercent, setTaxPercent] = useState(18);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [items, setItems] = useState([
    { id: '1', description: '', qty: 1, unitPrice: 0 }
  ]);

  // Real-time calculation using useMemo
  const totals = useMemo(() => {
    return calculateTotals(items, taxPercent, discountPercent);
  }, [items, taxPercent, discountPercent]);

  // Item management actions
  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Math.random().toString(), description: '', qty: 1, unitPrice: 0 }
    ]);
  };

  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        let parsedValue = value;
        if (field === 'qty') {
          parsedValue = parseInt(value, 10) || 0;
        } else if (field === 'unitPrice') {
          parsedValue = parseFloat(value) || 0;
        }
        return { ...item, [field]: parsedValue };
      }
      return item;
    }));
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!clientName.trim()) {
      alert('Please enter a Client Name.');
      return;
    }

    const validItems = items.filter(item => item.description.trim() !== '');
    if (validItems.length === 0) {
      alert('Please add at least one item with a description.');
      return;
    }

    dispatch(addInvoice({
      type,
      clientName,
      date,
      items: validItems,
      taxPercent,
      discountPercent
    }));

    navigate('/');
  };

  // Currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="invoice-form-page">
      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn btn-secondary btn-icon-only" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>Create Document</h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>Generate a professional invoice or quotation.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.5fr', gap: '2rem' }}>
          
          {/* Main Form Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* General Info Card */}
            <div className="card" style={{ marginBottom: 0 }}>
              <h2 className="card-title">Document Settings</h2>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Document Type</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                      <input 
                        type="radio" 
                        name="docType" 
                        value="Invoice" 
                        checked={type === 'Invoice'} 
                        onChange={() => setType('Invoice')} 
                        style={{ accentColor: 'var(--accent)' }}
                      />
                      Invoice
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                      <input 
                        type="radio" 
                        name="docType" 
                        value="Quotation" 
                        checked={type === 'Quotation'} 
                        onChange={() => setType('Quotation')}
                        style={{ accentColor: 'var(--accent)' }}
                      />
                      Quotation
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="doc-date">Issue Date</label>
                  <input 
                    type="date" 
                    id="doc-date"
                    className="form-control" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="client-name">Client Name</label>
                <input 
                  type="text" 
                  id="client-name"
                  placeholder="Enter client or company name" 
                  className="form-control"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Line Items Card */}
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h2 className="card-title" style={{ margin: 0 }}>Line Items</h2>
                <button type="button" className="btn btn-secondary" onClick={handleAddItem} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  <Plus size={16} />
                  Add Line Item
                </button>
              </div>

              <div className="table-container" style={{ margin: 0, border: 'none', boxShadow: 'none' }}>
                <table className="table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '50%' }}>Description</th>
                      <th style={{ width: '15%' }}>Qty</th>
                      <th style={{ width: '20%' }}>Unit Price ($)</th>
                      <th style={{ width: '15%' }}>Total ($)</th>
                      <th style={{ width: '10%', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="text"
                            placeholder="Describe the product or service"
                            className="form-control"
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            className="form-control text-right"
                            value={item.qty}
                            onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="form-control text-right"
                            value={item.unitPrice || ''}
                            onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                            required
                          />
                        </td>
                        <td style={{ fontWeight: 600, paddingRight: '1rem' }} className="text-right">
                          {formatCurrency(item.qty * item.unitPrice)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="btn btn-danger btn-icon-only"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={items.length <= 1}
                            style={{ opacity: items.length <= 1 ? 0.35 : 1, cursor: items.length <= 1 ? 'not-allowed' : 'pointer' }}
                            title="Remove Line Item"
                          >
                            <Trash size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculations Card */}
            <div className="card" style={{ marginBottom: 0 }}>
              <h2 className="card-title">Taxes & Discounts</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="tax-rate">Tax Rate (%)</label>
                  <input
                    type="number"
                    id="tax-rate"
                    min="0"
                    max="100"
                    className="form-control"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="discount-rate">Discount Rate (%)</label>
                  <input
                    type="number"
                    id="discount-rate"
                    min="0"
                    max="100"
                    className="form-control"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Real-time Summary Card */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '100px' }}>
              <h2 className="card-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Summary Preview</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1.25rem' }}>
                <div className="flex-between">
                  <span className="text-muted">Document Type:</span>
                  <span style={{ fontWeight: 600 }}>{type}</span>
                </div>
                <div className="flex-between">
                  <span className="text-muted">Client Name:</span>
                  <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                    {clientName || 'Draft Client'}
                  </span>
                </div>
                <div className="flex-between">
                  <span className="text-muted">Date:</span>
                  <span style={{ fontWeight: 600 }}>{date}</span>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />

                <div className="flex-between">
                  <span className="text-muted">Subtotal:</span>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex-between">
                  <span className="text-muted">Discount ({discountPercent}%):</span>
                  <span style={{ fontWeight: 600, color: 'var(--status-draft-text)' }}>-{formatCurrency(totals.discountAmount)}</span>
                </div>
                <div className="flex-between">
                  <span className="text-muted">Tax ({taxPercent}%):</span>
                  <span style={{ fontWeight: 600 }}>+{formatCurrency(totals.taxAmount)}</span>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />

                <div className="flex-between" style={{ fontSize: '1.15rem' }}>
                  <span style={{ fontWeight: 700 }}>Grand Total:</span>
                  <span style={{ fontWeight: 800, color: 'var(--accent)' }}>{formatCurrency(totals.grandTotal)}</span>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Save size={18} />
                  Save {type}
                </button>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
