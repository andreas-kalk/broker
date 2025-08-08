import axios, { AxiosResponse } from 'axios';
import { SectionData, ReportSummary } from '../types/api';
import { TaxRelevantData, CapitalGain, Dividend, ForeignTax, TaxSummary } from '../types/tax';
import { APP_CONFIG } from '../config/constants';

const api = axios.create({
  baseURL: APP_CONFIG.API.BASE_URL,
  timeout: APP_CONFIG.API.TIMEOUT,
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
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

  async getSectionData(sectionName: string): Promise<Array<Record<string, string>>> {
    return api.get(`/reports/sections/${sectionName}/data`).then(extractData);
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

  async getCurrentFileName(): Promise<string> {
    return api.get('/reports/current-file').then(extractData);
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

  async getCapitalGains(taxYear: number = APP_CONFIG.TAX.DEFAULT_YEAR): Promise<CapitalGain[]> {
    return api.get(`/reports/tax-data/capital-gains?taxYear=${taxYear}`).then(extractData);
  },

  async getDividends(taxYear: number = APP_CONFIG.TAX.DEFAULT_YEAR): Promise<Dividend[]> {
    return api.get(`/reports/tax-data/dividends?taxYear=${taxYear}`).then(extractData);
  },

  async getTaxSummary(taxYear: number = APP_CONFIG.TAX.DEFAULT_YEAR): Promise<TaxSummary> {
    return api.get(`/reports/tax-data/summary?taxYear=${taxYear}`).then(extractData);
  },

  async getForeignTaxes(taxYear: number = APP_CONFIG.TAX.DEFAULT_YEAR): Promise<ForeignTax[]> {
    return api.get(`/reports/tax-data/foreign-taxes?taxYear=${taxYear}`).then(extractData);
  },
} as const;

export interface UploadResponse {
  success: boolean;
  message: string;
  sectionCount?: number;
  sectionNames?: string[];
  fileName?: string;
}

export default api;
