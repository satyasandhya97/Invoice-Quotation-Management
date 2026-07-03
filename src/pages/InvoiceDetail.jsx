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
      <div className="bg-bg-secondary border border-border-color rounded-xl p-12 text-center text-text-muted transition-colors duration-250 max-w-[500px] mx-auto mt-12">
        <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
        <h3 className="text-lg font-bold text-text-primary">Document Not Found</h3>
        <p className="text-sm mt-1">We couldn't find a document with the ID: {id}</p>
        <button
          className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-md shadow-sm transition-all duration-150 cursor-pointer"
          onClick={() => navigate('/')}
        >
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
      case 'Paid': return <CheckCircle2 size={14} />;
      case 'Sent': return <Send size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 print:hidden">
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-full border border-border-color bg-bg-tertiary hover:bg-border-color text-text-primary transition-colors flex items-center justify-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Document Preview</h1>
            <p className="text-text-muted text-sm mt-1">View details or export this document.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <button
              className={`px-3 py-1.5 rounded text-xs font-bold border transition-colors cursor-pointer ${invoice.status === 'Draft' ? 'bg-accent border-accent text-white' : 'bg-bg-tertiary border-border-color text-text-secondary hover:text-text-primary'}`}
              onClick={() => handleStatusChange('Draft')}
            >
              Draft
            </button>
            <button
              className={`px-3 py-1.5 rounded text-xs font-bold border transition-colors cursor-pointer ${invoice.status === 'Sent' ? 'bg-accent border-accent text-white' : 'bg-bg-tertiary border-border-color text-text-secondary hover:text-text-primary'}`}
              onClick={() => handleStatusChange('Sent')}
            >
              Sent
            </button>
            <button
              className={`px-3 py-1.5 rounded text-xs font-bold border transition-colors cursor-pointer ${invoice.status === 'Paid' ? 'bg-accent border-accent text-white' : 'bg-bg-tertiary border-border-color text-text-secondary hover:text-text-primary'}`}
              onClick={() => handleStatusChange('Paid')}
            >
              Paid
            </button>
          </div>

          <button
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-border-color bg-bg-secondary hover:bg-bg-tertiary text-text-primary font-semibold text-sm rounded shadow-sm transition-colors cursor-pointer"
            onClick={handlePrint}
          >
            <Printer size={16} />
            Print / PDF
          </button>
        </div>
      </div>

      <div className="bg-bg-secondary border border-border-color rounded-xl p-8 sm:p-12 max-w-[850px] mx-auto shadow-lg transition-colors duration-250 print:shadow-none print:border-none print:p-0">

        <div className="flex justify-between items-start mb-12">
          <div>
            <div className="text-2xl font-extrabold text-accent tracking-wider mb-1">
              TECHNOPIXAR
            </div>
            <div className="text-text-muted text-xs leading-relaxed">
              100 Tech Park, Suite 400<br />
              Silicon Valley, CA 94025<br />
              billing@technopixar.com
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-text-primary uppercase tracking-wide">
              {invoice.type}
            </div>
            <div className="font-bold text-text-secondary text-sm mt-1">
              #{invoice.id}
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-2.5 ${invoice.status === 'Paid' ? 'bg-status-paid-bg text-status-paid-text' :
                invoice.status === 'Sent' ? 'bg-status-sent-bg text-status-sent-text' :
                  'bg-status-draft-bg text-status-draft-text'
              }`}>
              {getStatusIcon(invoice.status)}
              {invoice.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <div className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1.5">
              Billed To
            </div>
            <div className="font-bold text-text-primary text-base">
              {invoice.clientName}
            </div>
            <div className="text-text-secondary text-xs mt-0.5">
              Client Accounts Department
            </div>
          </div>
          <div className="text-right">
            <div className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1.5">
              Document Date
            </div>
            <div className="font-bold text-text-primary text-base">
              {invoice.date}
            </div>
          </div>
        </div>

        <div className="border-b-2 border-border-color mb-6 overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-border-color">
                <th className="py-3 font-bold text-text-secondary text-xs uppercase tracking-wider">Description</th>
                <th className="py-3 font-bold text-text-secondary text-xs uppercase tracking-wider text-center w-[12%]">Qty</th>
                <th className="py-3 font-bold text-text-secondary text-xs uppercase tracking-wider text-right w-[20%]">Unit Price</th>
                <th className="py-3 font-bold text-text-secondary text-xs uppercase tracking-wider text-right w-[20%]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-border-color/40 last:border-0">
                  <td className="py-4 font-semibold text-text-primary text-sm">{item.description}</td>
                  <td className="py-4 text-center text-text-secondary text-sm">{item.qty}</td>
                  <td className="py-4 text-right text-text-secondary text-sm">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-4 text-right font-bold text-text-primary text-sm">{formatCurrency(item.qty * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <div className="w-full max-w-[300px] flex flex-col gap-2.5">

            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted">Subtotal:</span>
              <span className="font-semibold text-text-primary">{formatCurrency(invoice.subtotal)}</span>
            </div>

            {invoice.discountAmount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-muted">Discount ({invoice.discountPercent}%):</span>
                <span className="font-semibold text-status-draft-text">-{formatCurrency(invoice.discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted">Tax ({invoice.taxPercent}%):</span>
              <span className="font-semibold text-text-primary">+{formatCurrency(invoice.taxAmount)}</span>
            </div>

            <hr className="border-border-color my-1" />

            <div className="flex justify-between items-center font-extrabold text-base">
              <span className="text-text-primary">Total Due:</span>
              <span className="text-accent text-lg">{formatCurrency(invoice.grandTotal)}</span>
            </div>

          </div>
        </div>

        <div className="border-t border-border-color mt-16 pt-6">
          <div className="text-text-secondary text-xs font-bold uppercase tracking-widest mb-1.5">
            Terms & Notes
          </div>
          <div className="text-text-muted text-xs leading-relaxed">
            Please send payment within 30 days of receiving this invoice. If you have any questions, feel free to email accounts@technopixar.com. Thank you for your partnership!
          </div>
        </div>

      </div>
    </div>
  );
};

export default InvoiceDetail;
