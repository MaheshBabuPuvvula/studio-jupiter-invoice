'use client';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface InvoiceListProps {
  invoices: any[];
  isLoading: boolean;
}

export default function InvoiceList({ invoices, isLoading }: InvoiceListProps) {
  const downloadPDF = async (invoice: any) => {
    // Create single-page invoice with pure black text
    const element = document.createElement('div');
    element.style.width = '210mm';
    element.style.minHeight = '297mm';
    element.style.padding = '0mm';
    element.style.backgroundColor = 'white';
    element.style.fontFamily = "'Segoe UI', Arial, sans-serif";
    
    element.innerHTML = `
      <div style="width: 100%; height: 100%;">
        <!-- Orange Gradient Header -->
        <div style="background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 50%, #FFA500 100%); padding: 20px 25px; color: white;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 20px;">
              <img src="/logo.png" alt="Studio Jupiter" style="height: 70px; width: auto; background: white; border-radius: 10px; padding: 5px;" onerror="this.style.display='none'">
              <div>
                <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px; color: white;">STUDIO JUPITER</h1>
                <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.9; color: white;">HandCraft Decors</p>
              </div>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-size: 11px; color: white;">GSTIN: 27AAAAA1234A1Z</p>
              <p style="margin: 5px 0 0 0; font-size: 11px; color: white;">CIN: U12345MH2020PTC123456</p>
            </div>
          </div>
        </div>

        <!-- Company Info Bar - Pure Black -->
        <div style="background: #000000; color: white; padding: 8px 25px; display: flex; justify-content: space-between; font-size: 9px;">
          <span style="color: white;">📍 123 Craft Lane, Art District, Mumbai - 400001</span>
          <span style="color: white;">📞 +91 98765 43210</span>
          <span style="color: white;">✉️ studio@jupiter.com</span>
        </div>

        <!-- Invoice Title -->
        <div style="text-align: center; margin: 25px 0 20px 0;">
          <div style="display: inline-block; background: linear-gradient(135deg, #FF6B00, #FF8C00); color: white; padding: 8px 40px; font-size: 20px; font-weight: bold; border-radius: 30px;">
            TAX INVOICE
          </div>
        </div>

        <!-- Invoice Details Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 0 25px; margin-bottom: 20px;">
          <div>
            <div style="background: #FFF3E0; padding: 12px; border-left: 4px solid #FF6B00;">
              <p style="margin: 4px 0; color: #000000;"><strong style="color: #FF6B00;">Invoice No:</strong> ${invoice.invoiceNumber}</p>
              <p style="margin: 4px 0; color: #000000;"><strong style="color: #FF6B00;">Date:</strong> ${invoice.date}</p>
              <p style="margin: 4px 0; color: #000000;"><strong style="color: #FF6B00;">Place of Supply:</strong> ${invoice.client.state}</p>
            </div>
          </div>
          <div>
            <div style="background: #FFF3E0; padding: 12px; border-left: 4px solid #FF6B00;">
              <p style="margin: 4px 0; color: #000000;"><strong style="color: #FF6B00;">Order No:</strong> ${invoice.invoiceNumber.slice(-6)}</p>
              <p style="margin: 4px 0; color: #000000;"><strong style="color: #FF6B00;">Payment Terms:</strong> Advance</p>
              <p style="margin: 4px 0; color: #000000;"><strong style="color: #FF6B00;">Due Date:</strong> ${invoice.date}</p>
            </div>
          </div>
        </div>

        <!-- Bill To Section -->
        <div style="padding: 0 25px; margin-bottom: 20px;">
          <div style="background: #FAFAFA; padding: 15px; border-radius: 8px; border: 1px solid #FFE0B3;">
            <h3 style="color: #FF6B00; margin: 0 0 10px 0; font-size: 14px;">📦 BILL TO:</h3>
            <p style="margin: 5px 0; font-size: 12px; color: #000000;"><strong style="color: #000000;">${invoice.client.name}</strong></p>
            <p style="margin: 5px 0; font-size: 11px; color: #000000;">${invoice.client.address}</p>
            ${invoice.client.gstin ? `<p style="margin: 5px 0; font-size: 11px; color: #000000;"><strong style="color: #000000;">GSTIN:</strong> ${invoice.client.gstin}</p>` : ''}
            <p style="margin: 5px 0; font-size: 11px; color: #000000;"><strong style="color: #000000;">State:</strong> ${invoice.client.state}</p>
          </div>
        </div>

        <!-- Items Table -->
        <div style="padding: 0 25px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: linear-gradient(135deg, #FF6B00, #FF8C00); color: white;">
                <th style="padding: 10px; text-align: center; border: none; font-size: 11px; color: white;">SL</th>
                <th style="padding: 10px; text-align: left; border: none; font-size: 11px; color: white;">DESCRIPTION</th>
                <th style="padding: 10px; text-align: center; border: none; font-size: 11px; color: white;">QTY</th>
                <th style="padding: 10px; text-align: right; border: none; font-size: 11px; color: white;">RATE (₹)</th>
                <th style="padding: 10px; text-align: right; border: none; font-size: 11px; color: white;">AMOUNT (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #FFE0B3;">
                <td style="padding: 10px; text-align: center; font-size: 11px; color: #000000;">1</td>
                <td style="padding: 10px; text-align: left; font-size: 11px; color: #000000;">Handcrafted Decorative Products</td>
                <td style="padding: 10px; text-align: center; font-size: 11px; color: #000000;">1</td>
                <td style="padding: 10px; text-align: right; font-size: 11px; color: #000000;">${invoice.baseAmount.toFixed(2)}</td>
                <td style="padding: 10px; text-align: right; font-size: 11px; color: #000000;">${invoice.baseAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tax Summary -->
        <div style="display: flex; justify-content: flex-end; padding: 0 25px; margin-bottom: 20px;">
          <div style="width: 280px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #FFE0B3;">
                <td style="padding: 8px; font-size: 11px; color: #000000;">Subtotal</td>
                <td style="padding: 8px; text-align: right; font-size: 11px; color: #000000;">₹${invoice.baseAmount.toFixed(2)}</td>
               </tr>
              <tr style="border-bottom: 1px solid #FFE0B3;">
                <td style="padding: 8px; font-size: 11px; color: #000000;">CGST (9%)</td>
                <td style="padding: 8px; text-align: right; font-size: 11px; color: #000000;">₹${invoice.cgst.toFixed(2)}</td>
               </tr>
              <tr style="border-bottom: 1px solid #FFE0B3;">
                <td style="padding: 8px; font-size: 11px; color: #000000;">SGST (9%)</td>
                <td style="padding: 8px; text-align: right; font-size: 11px; color: #000000;">₹${invoice.sgst.toFixed(2)}</td>
               </tr>
              <tr style="background: #FFF3E0;">
                <td style="padding: 12px; font-size: 14px; font-weight: bold; color: #FF6B00;">TOTAL</td>
                <td style="padding: 12px; text-align: right; font-size: 16px; font-weight: bold; color: #FF6B00;">₹${invoice.total.toFixed(2)}</td>
               </tr>
            </table>
          </div>
        </div>

        <!-- Amount in Words -->
        <div style="padding: 0 25px; margin-bottom: 20px;">
          <div style="background: #FFF3E0; padding: 10px 15px; border-radius: 6px;">
            <p style="margin: 0; font-size: 11px; color: #000000;"><strong style="color: #FF6B00;">Amount in Words:</strong> ${numberToWords(invoice.total)} Rupees Only</p>
          </div>
        </div>

        <!-- Bank Details -->
        <div style="padding: 0 25px; margin-bottom: 15px;">
          <div style="background: #000000; color: white; padding: 12px; border-radius: 6px;">
            <p style="margin: 0 0 5px 0; font-size: 11px; color: white;"><strong>🏦 BANK DETAILS:</strong></p>
            <p style="margin: 3px 0; font-size: 9px; color: white;">Account: STUDIO JUPITER HANDCRAFT DECORS | Bank: HDFC Bank, Mumbai</p>
            <p style="margin: 3px 0; font-size: 9px; color: white;">A/c No: 12345678901234 | IFSC: HDFC0001234 | UPI: studio@hdfcbank</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding: 0 25px; margin-top: 15px;">
          <div style="display: flex; justify-content: space-between; border-top: 2px solid #FF6B00; padding-top: 15px;">
            <div>
              <p style="margin: 0; font-size: 10px; color: #000000;">Authorized Signatory</p>
              <div style="margin-top: 20px;">
                <p style="margin: 0; font-size: 9px; color: #000000;">(For Studio Jupiter HandCraft Decors)</p>
              </div>
            </div>
            <div style="text-align: center;">
              <p style="margin: 0; font-size: 9px; color: #FF6B00;">✨ Thank you for choosing Studio Jupiter! ✨</p>
              <p style="margin: 5px 0 0 0; font-size: 8px; color: #000000;">This is a computer generated invoice - no signature required</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-size: 10px; color: #000000;">Customer Signature</p>
              <div style="margin-top: 20px;">
                <p style="margin: 0; font-size: 9px; color: #000000;">(Received in good condition)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(element);
    
    // Generate PDF
    const canvas = await html2canvas(element, { 
      scale: 3,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    });
    
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`Invoice_${invoice.invoiceNumber}.pdf`);
    document.body.removeChild(element);
  };

  // Number to words conversion
  const numberToWords = (num: number): string => {
    if (num === 0) return 'Zero';
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const convert = (n: number): string => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
      return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    };
    
    const rupees = Math.floor(num);
    let result = convert(rupees) + ' Rupees';
    return result;
  };

  // Safety check
  if (!Array.isArray(invoices)) {
    return <div className="text-center py-8 text-red-500">Error loading invoices</div>;
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading invoices...</div>;
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No invoices generated yet. Click "Generate Invoice" to create one.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <div key={invoice._id} className="border rounded-lg p-4 hover:shadow-lg transition">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
              <p className="text-sm text-gray-600">{invoice.date}</p>
              <p className="text-sm mt-1">{invoice.client?.name || 'Unknown Client'}</p>
              <p className="text-sm text-gray-500">{invoice.client?.state || 'Unknown State'}</p>
              <div className="mt-2 text-sm">
                <span>Total: ₹{invoice.total?.toFixed(2) || '0.00'} | </span>
                <span>CGST: ₹{invoice.cgst?.toFixed(2) || '0.00'} | </span>
                <span>SGST: ₹{invoice.sgst?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl">₹{invoice.total?.toFixed(2) || '0.00'}</p>
              <button
                onClick={() => downloadPDF(invoice)}
                className="mt-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg text-sm hover:from-orange-700 hover:to-orange-600"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}