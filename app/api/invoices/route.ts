import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}-${random}`;
}

// Calculate GST when user enters TOTAL amount (including GST)
// Example: User enters 1000 (total with GST)
// Then: Base = 847.46, CGST = 76.27, SGST = 76.27, Total = 1000
function calculateGSTFromTotal(totalAmountWithGST: number) {
  const baseAmount = totalAmountWithGST / 1.18;  // Remove 18% GST
  const cgst = baseAmount * 0.09;
  const sgst = baseAmount * 0.09;
  const total = totalAmountWithGST;
  
  return { 
    baseAmount, 
    cgst, 
    sgst, 
    total 
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, clientGstin, clientAddress, clientState, baseAmount, items } = body;
    
    // IMPORTANT: baseAmount from form is actually the TOTAL amount (with GST)
    const { baseAmount: calculatedBase, cgst, sgst, total } = calculateGSTFromTotal(baseAmount);
    
    const invoiceNumber = generateInvoiceNumber();
    
    const invoice = {
      invoiceNumber,
      date: new Date().toISOString().split('T')[0],
      baseAmount: calculatedBase,
      cgst,
      sgst,
      total,
      client: {
        name: clientName,
        gstin: clientGstin || '',
        address: clientAddress,
        state: clientState,
      },
      items: items || [],
      createdAt: new Date(),
    };
    
    // Save to MongoDB
    const client = await clientPromise;
    const db = client.db('studiojupiter');
    const result = await db.collection('invoices').insertOne(invoice);
    
    return NextResponse.json({ ...invoice, _id: result.insertedId }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('studiojupiter');
    const invoices = await db
      .collection('invoices')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(invoices);
    
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}