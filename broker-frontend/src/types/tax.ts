// Tax-relevant data types for KAP form compliance
export interface TaxRelevantData {
  taxpayerId: string;
  accountNumber: string;
  brokerName: string;
  taxYear: number;
  capitalGains: CapitalGain[];
  dividends: Dividend[];
  foreignTaxes: ForeignTax[];
  summary: TaxSummary;
}

export interface CapitalGain {
  isin?: string;
  symbol: string;
  description: string;
  assetCategory: string;
  purchaseDate: string;
  saleDate: string;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
  realizedGain: number;
  commission: number;
  currency: string;
  transactionDescription: string;
  shortTerm: boolean; // < 1 year
}

export interface Dividend {
  isin?: string;
  symbol: string;
  description: string;
  paymentDate: string;
  grossAmount: number;
  netAmount: number;
  withholdingTax: number;
  foreignTax: number;
  currency: string;
  country: string;
  transactionDescription: string;
}

export interface ForeignTax {
  country: string;
  currency: string;
  amount: number;
  date: string;
  reference: string;
}

export interface TaxSummary {
  totalCapitalGains: number;
  totalCapitalLosses: number;
  netCapitalGains: number;
  totalDividends: number;
  totalWithholdingTax: number;
  totalForeignTax: number;
  totalCommissions: number;
  numberOfTransactions: number;
}
