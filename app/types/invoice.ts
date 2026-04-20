export interface InvoiceFormData {
  clientName: string;
  clientGstin: string;
  clientAddress: string;
  clientState: string;
  baseAmount: number;
  items: any[];
}