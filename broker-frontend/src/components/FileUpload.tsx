import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { CloudUpload, CheckCircle, Error, Description } from '@mui/icons-material';
import { reportService, UploadResponse } from '../services/api';

interface FileUploadProps {
  onUploadSuccess: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const result = await reportService.uploadFile(selectedFile);
      setUploadResult(result);
      setShowResultDialog(true);
      
      if (result.success) {
        onUploadSuccess();
      }
    } catch (error) {
      setUploadResult({
        success: false,
        message: 'Fehler beim Upload: ' + (error as Error).message
      });
      setShowResultDialog(true);
    } finally {
      setUploading(false);
    }
  };

  const handleCloseDialog = () => {
    setShowResultDialog(false);
    setSelectedFile(null);
    // Reset file input
    const fileInput = document.getElementById('file-upload-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <CloudUpload sx={{ mr: 1 }} color="primary" />
            <Typography variant="h6">CSV-Datei hochladen</Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Laden Sie eine CSV-Datei hoch, um neue Broker-Daten zu analysieren.
          </Typography>

          <Box mt={3}>
            <input
              id="file-upload-input"
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <label htmlFor="file-upload-input">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<Description />}
                  disabled={uploading}
                >
                  Datei auswählen
                </Button>
              </label>
              
              {selectedFile && (
                <Chip 
                  label={selectedFile.name}
                  color="primary"
                  variant="outlined"
                />
              )}
              
              {selectedFile && (
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={uploading}
                  startIcon={<CloudUpload />}
                >
                  Hochladen
                </Button>
              )}
            </Box>

            {uploading && (
              <Box mt={2}>
                <Typography variant="body2" gutterBottom>
                  Datei wird hochgeladen...
                </Typography>
                <LinearProgress />
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Result Dialog */}
      <Dialog 
        open={showResultDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            {uploadResult?.success ? (
              <CheckCircle color="success" sx={{ mr: 1 }} />
            ) : (
              <Error color="error" sx={{ mr: 1 }} />
            )}
            Upload {uploadResult?.success ? 'erfolgreich' : 'fehlgeschlagen'}
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Alert 
            severity={uploadResult?.success ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            {uploadResult?.message}
          </Alert>

          {uploadResult?.success && uploadResult.sectionNames && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Gefundene Sektionen ({uploadResult.sectionCount}):
              </Typography>
              <List dense>
                {uploadResult.sectionNames.map((sectionName) => (
                  <ListItem key={sectionName}>
                    <ListItemIcon>
                      <Description fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={sectionName} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Schließen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileUpload;
