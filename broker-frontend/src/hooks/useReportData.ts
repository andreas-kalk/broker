import { useState, useEffect, useCallback } from 'react';
import { reportService } from '../services/api';
import { ReportSummary, SectionData } from '../types/api';

interface UseReportDataReturn {
  summary: ReportSummary | null;
  sections: Record<string, SectionData> | null;
  loading: boolean;
  error: string | null;
  hasUploadedFile: boolean;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useReportData = (): UseReportDataReturn => {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [sections, setSections] = useState<Record<string, SectionData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if file was uploaded first
      const hasFile = await reportService.hasUploadedFile();
      setHasUploadedFile(hasFile);

      if (hasFile) {
        const [summaryData, sectionsData] = await Promise.all([
          reportService.getReportSummary(),
          reportService.getAllSections()
        ]);
        setSummary(summaryData);
        setSections(sectionsData);
      } else {
        // Clear data if no file uploaded
        setSummary(null);
        setSections(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setError(`Fehler beim Laden der Daten: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    summary,
    sections,
    loading,
    error,
    hasUploadedFile,
    refetch: fetchData,
    clearError,
  };
};
