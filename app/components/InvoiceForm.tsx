'use client';

import { useState } from 'react';

interface Props {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export default function InvoiceForm({ onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientGstin: '',
    clientAddress: '',
    clientState: '',
    baseAmount: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ ...formData, items: [] });
    onClose();
  };

  const cgst = formData.baseAmount * 0.09;
  const sgst = formData.baseAmount * 0.09;
  const total = formData.baseAmount + cgst + sgst;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-black">Generate New Invoice</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-black">Client Name *</label>
              <input
                type="text"
                required
                className="w-full border rounded-lg px-3 py-2 text-black"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-black">Client GSTIN (Optional)</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 text-black"
                value={formData.clientGstin}
                onChange={(e) => setFormData({ ...formData, clientGstin: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-black">Client Address *</label>
              <textarea
                required
                className="w-full border rounded-lg px-3 py-2 text-black"
                rows={2}
                value={formData.clientAddress}
                onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-black">State *</label>
              <input
                type="text"
                required
                className="w-full border rounded-lg px-3 py-2 text-black"
                value={formData.clientState}
                onChange={(e) => setFormData({ ...formData, clientState: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-black">Total Amount (including GST) *</label>
              <input
                type="number"
                required
                className="w-full border rounded-lg px-3 py-2 text-black"
                value={formData.baseAmount}
                onChange={(e) => setFormData({ ...formData, baseAmount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-black">GST Breakdown</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-black">Base Amount (without GST):</span>
                  <span className="text-black">₹{(formData.baseAmount / 1.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">CGST (9%):</span>
                  <span className="text-black">₹{((formData.baseAmount / 1.18) * 0.09).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">SGST (9%):</span>
                  <span className="text-black">₹{((formData.baseAmount / 1.18) * 0.09).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span className="text-black">Total Amount (with GST):</span>
                  <span className="text-black">₹{formData.baseAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-700 hover:to-orange-600"
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}