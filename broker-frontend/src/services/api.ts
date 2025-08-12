import axios, {AxiosResponse} from 'axios';
import {ReportSummary, SectionData, Portfolio, PortfolioSummary, Position, Transaction, Dividend} from '../types/api';
import {TaxRelevantData} from '../types/tax';
import {APP_CONFIG} from '../config/constants';

const api = axios.create({
    baseURL: APP_CONFIG.API.BASE_URL,
    timeout: APP_CONFIG.API.TIMEOUT,
});

// Error handling interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(new Error(error));
    }
);

// Helper function to extract data from response
const extractData = <T>(response: AxiosResponse<T>): T => response.data;

export const reportService = {
    async getAllSections(): Promise<Record<string, SectionData>> {
        return api.get('/reports/sections').then(extractData);
    },

    async getSection(sectionName: string): Promise<SectionData> {
        return api.get(`/reports/sections/${sectionName}`).then(extractData);
    },

    async getReportSummary(): Promise<ReportSummary> {
        return api.get('/reports/summary').then(extractData);
    },

    async uploadFile(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append('file', file);

        return api.post('/reports/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(extractData);
    },

    async hasUploadedFile(): Promise<boolean> {
        return api.get('/reports/has-uploaded-file').then(extractData);
    },

    async clearUploadedFile(): Promise<void> {
        await api.delete('/reports/uploaded-file');
    },
} as const;

export const taxService = {
    async getTaxRelevantData(taxYear: number = APP_CONFIG.TAX.DEFAULT_YEAR): Promise<TaxRelevantData> {
        return api.get(`/reports/tax-data?taxYear=${taxYear}`).then(extractData);
    },
} as const;

export const portfolioService = {
    async getPortfolio(): Promise<Portfolio> {
        return api.get('/reports/portfolio').then(extractData);
    },

    async getPortfolioSummary(): Promise<PortfolioSummary> {
        return api.get('/reports/portfolio/summary').then(extractData);
    },

    async getPositions(): Promise<Position[]> {
        return api.get('/reports/portfolio/positions').then(extractData);
    },

    async getPosition(symbol: string): Promise<Position> {
        return api.get(`/reports/portfolio/positions/${symbol}`).then(extractData);
    },

    async getPositionTransactions(symbol: string): Promise<Transaction[]> {
        return api.get(`/reports/portfolio/positions/${symbol}/transactions`).then(extractData);
    },

    async getPositionDividends(symbol: string): Promise<Dividend[]> {
        return api.get(`/reports/portfolio/positions/${symbol}/dividends`).then(extractData);
    },
} as const;

export const transactionService = {
    async getAllTransactions(): Promise<SymbolTransactions[]> {
        return api.get('/reports/transactions').then(extractData);
    },

    async getTransactionsByAssetKey(): Promise<Record<string, SymbolTransactions>> {
        return api.get('/reports/transactions/by-asset-key').then(extractData);
    },

    async getTransactionsBySymbol(): Promise<Record<string, SymbolTransactions>> {
        return api.get('/reports/transactions/by-symbol').then(extractData);
    },

    async getAllIndividualTransactions(): Promise<Transaction[]> {
        return api.get('/reports/transactions/all').then(extractData);
    },

    async getTransactionSummary(): Promise<TransactionSummary> {
        return api.get('/reports/transactions/summary').then(extractData);
    },

    async getTransactionsByYear(taxYear: number): Promise<Transaction[]> {
        return api.get(`/reports/transactions/year/${taxYear}`).then(extractData);
    },

    async getTransaction(transactionId: string): Promise<Transaction> {
        return api.get(`/reports/transactions/${transactionId}`).then(extractData);
    },
} as const;

// Export transaction types
export type { SymbolTransactions, TransactionSummary };

export interface UploadResponse {
    success: boolean;
    message: string;
    sectionCount?: number;
    sectionNames?: string[];
    fileName?: string;
}
