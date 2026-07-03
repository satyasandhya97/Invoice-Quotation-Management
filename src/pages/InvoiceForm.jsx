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

  const totals = useMemo(() => {
    return calculateTotals(items, taxPercent, discountPercent);
  }, [items, taxPercent, discountPercent]);

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <button
          className="p-2 rounded-full border border-border-color bg-bg-tertiary hover:bg-border-color text-text-primary transition-colors flex items-center justify-center cursor-pointer"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Create Document</h1>
          <p className="text-text-muted text-sm mt-1">Generate a professional invoice or quotation.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1.5fr] gap-8">
          <div className="flex flex-col gap-6">
            <div className="bg-bg-secondary border border-border-color rounded-xl p-6 shadow-sm transition-colors duration-250">
              <h2 className="text-lg font-bold text-text-primary mb-5">Document Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-text-secondary mb-1.5">Document Type</label>
                  <div className="flex gap-6 mt-1.5">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-text-primary">
                      <input
                        type="radio"
                        name="docType"
                        value="Invoice"
                        checked={type === 'Invoice'}
                        onChange={() => setType('Invoice')}
                        className="w-4 h-4 accent-accent cursor-pointer"
                      />
                      Invoice
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-text-primary">
                      <input
                        type="radio"
                        name="docType"
                        value="Quotation"
                        checked={type === 'Quotation'}
                        onChange={() => setType('Quotation')}
                        className="w-4 h-4 accent-accent cursor-pointer"
                      />
                      Quotation
                    </label>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-text-secondary mb-1.5" htmlFor="doc-date">Issue Date</label>
                  <input
                    type="date"
                    id="doc-date"
                    className="w-full px-3.5 py-2 rounded-md border border-border-color bg-bg-secondary text-text-primary focus:outline-none focus:border-border-focus focus:ring-3 focus:ring-accent/15 transition-all duration-150"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-text-secondary mb-1.5" htmlFor="client-name">Client Name</label>
                <input
                  type="text"
                  id="client-name"
                  placeholder="Enter client or company name"
                  className="w-full px-3.5 py-2.5 rounded-md border border-border-color bg-bg-secondary text-text-primary focus:outline-none focus:border-border-focus focus:ring-3 focus:ring-accent/15 transition-all duration-150"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="bg-bg-secondary border border-border-color rounded-xl p-6 shadow-sm transition-colors duration-250">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-text-primary">Line Items</h2>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-border-color bg-bg-tertiary hover:bg-border-color text-text-primary text-xs font-semibold rounded transition-all duration-150 cursor-pointer"
                  onClick={handleAddItem}
                >
                  <Plus size={14} />
                  Add Line Item
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left min-w-[700px]">
                  <thead>
                    <tr className="border-b border-border-color">
                      <th className="py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider w-[45%]">Description</th>
                      <th className="py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider text-right w-[15%]">Qty</th>
                      <th className="py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider text-right w-[20%]">Unit Price ($)</th>
                      <th className="py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider text-right w-[15%]">Total ($)</th>
                      <th className="py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider text-right w-[5%]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-border-color last:border-0">
                        <td className="py-3 pr-2">
                          <input
                            type="text"
                            placeholder="Describe the product or service"
                            className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-secondary text-text-primary focus:outline-none focus:border-border-focus transition-all text-sm"
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                            required
                          />
                        </td>
                        <td className="py-3 px-2">
                          <input
                            type="number"
                            min="1"
                            className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-secondary text-text-primary focus:outline-none focus:border-border-focus text-right text-sm"
                            value={item.qty}
                            onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                            required
                          />
                        </td>
                        <td className="py-3 px-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-secondary text-text-primary focus:outline-none focus:border-border-focus text-right text-sm"
                            value={item.unitPrice || ''}
                            onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                            required
                          />
                        </td>
                        <td className="py-3 pl-2 text-right font-semibold text-text-primary text-sm">
                          {formatCurrency(item.qty * item.unitPrice)}
                        </td>
                        <td className="py-3 text-right pl-2">
                          <button
                            type="button"
                            className="p-1.5 rounded text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={items.length <= 1}
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
            <div className="bg-bg-secondary border border-border-color rounded-xl p-6 shadow-sm transition-colors duration-250">
              <h2 className="text-lg font-bold text-text-primary mb-5">Taxes & Discounts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-text-secondary mb-1.5" htmlFor="tax-rate">Tax Rate (%)</label>
                  <input
                    type="number"
                    id="tax-rate"
                    min="0"
                    max="100"
                    className="w-full px-3.5 py-2 rounded-md border border-border-color bg-bg-secondary text-text-primary focus:outline-none focus:border-border-focus focus:ring-3 focus:ring-accent/15 transition-all duration-150"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-text-secondary mb-1.5" htmlFor="discount-rate">Discount Rate (%)</label>
                  <input
                    type="number"
                    id="discount-rate"
                    min="0"
                    max="100"
                    className="w-full px-3.5 py-2 rounded-md border border-border-color bg-bg-secondary text-text-primary focus:outline-none focus:border-border-focus focus:ring-3 focus:ring-accent/15 transition-all duration-150"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-bg-secondary border border-border-color rounded-xl p-6 shadow-md sticky top-24 transition-colors duration-250">
              <h2 className="text-lg font-bold text-text-primary pb-3 border-b border-border-color">Summary Preview</h2>
              <div className="flex flex-col gap-3.5 mt-5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">Document Type:</span>
                  <span className="font-semibold text-text-primary">{type}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">Client Name:</span>
                  <span className="font-semibold text-text-primary truncate max-w-[150px]" title={clientName || 'Draft Client'}>
                    {clientName || 'Draft Client'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">Date:</span>
                  <span className="font-semibold text-text-primary">{date}</span>
                </div>
                <hr className="border-border-color my-1" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">Subtotal:</span>
                  <span className="font-semibold text-text-primary">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">Discount ({discountPercent}%):</span>
                  <span className="font-semibold text-status-draft-text">-{formatCurrency(totals.discountAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">Tax ({taxPercent}%):</span>
                  <span className="font-semibold text-text-primary">+{formatCurrency(totals.taxAmount)}</span>
                </div>
                <hr className="border-border-color my-1" />
                <div className="flex justify-between items-center text-base font-bold">
                  <span className="text-text-primary">Grand Total:</span>
                  <span className="text-accent text-lg">{formatCurrency(totals.grandTotal)}</span>
                </div>
              </div>
              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg shadow-sm transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
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
