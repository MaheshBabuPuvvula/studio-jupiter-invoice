'use client';

import { useState, useEffect } from 'react';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  date: string;
  baseAmount: number;
  cgst: number;
  sgst: number;
  total: number;
  client: {
    name: string;
    gstin?: string;
    address: string;
    state: string;
  };
  items: any[];
  createdAt: Date;
}

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/invoices');
      const data = await res.json();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setInvoices(data);
      } else {
        console.error('API did not return an array:', data);
        setInvoices([]);
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createInvoice = async (formData: any) => {
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newInvoice = await res.json();
      setInvoices([newInvoice, ...invoices]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">
              Studio Jupiter HandCraft Decors
            </h1>
            <p className="text-black mt-1">Invoice Management System</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-700 hover:to-orange-600 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Generate Invoice
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">All Invoices</h2>
          <InvoiceList invoices={invoices} isLoading={isLoading} />
        </div>
      </div>

      {showForm && <InvoiceForm onSubmit={createInvoice} onClose={() => setShowForm(false)} />}
    </main>
  );
}