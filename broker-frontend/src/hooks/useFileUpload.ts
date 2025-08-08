import { useState, useCallback } from 'react';
import { reportService } from '../services/api';

interface UseFileUploadReturn {
  uploading: boolean;
  uploadError: string | null;
  uploadFile: (file: File) => Promise<boolean>;
  clearUploadedFile: () => Promise<void>;
  clearError: () => void;
}

export const useFileUpload = (onUploadSuccess?: () => void): UseFileUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File): Promise<boolean> => {
    try {
      setUploading(true);
      setUploadError(null);

      await reportService.uploadFile(file);
      onUploadSuccess?.();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload fehlgeschlagen';
      setUploadError(`Fehler beim Upload: ${errorMessage}`);
      return false;
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);

  const clearUploadedFile = useCallback(async () => {
    try {
      setUploadError(null);
      await reportService.clearUploadedFile();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Löschen fehlgeschlagen';
      setUploadError(`Fehler beim Löschen: ${errorMessage}`);
    }
  }, []);

  const clearError = useCallback(() => {
    setUploadError(null);
  }, []);

  return {
    uploading,
    uploadError,
    uploadFile,
    clearUploadedFile,
    clearError,
  };
};
