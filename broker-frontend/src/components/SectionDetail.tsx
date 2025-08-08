import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { ArrowBack, Download } from '@mui/icons-material';
import { reportService } from '../services/api';
import { SectionData } from '../types/api';

const SectionDetail: React.FC = () => {
  const { sectionName } = useParams<{ sectionName: string }>();
  const navigate = useNavigate();
  const [sectionData, setSectionData] = useState<SectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSectionData = async () => {
      if (!sectionName) return;
      
      try {
        setLoading(true);
        const data = await reportService.getSection(decodeURIComponent(sectionName));
        setSectionData(data);
      } catch (err) {
        setError('Fehler beim Laden der Sektionsdaten: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSectionData();
  }, [sectionName]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Zurück zum Dashboard
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!sectionData) {
    return (
      <Box>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Zurück zum Dashboard
        </Button>
        <Alert severity="warning">Keine Daten für diese Sektion gefunden.</Alert>
      </Box>
    );
  }

  // Erstelle Spalten für DataGrid
  const columns: GridColDef[] = sectionData.headers.map((header) => ({
    field: header,
    headerName: header,
    width: 150,
    sortable: true,
    filterable: true,
  }));

  // Bereite Daten für DataGrid vor (mit eindeutigen IDs)
  const rows = sectionData.dataRows.map((row, index) => ({
    id: index,
    ...row,
  }));

  const handleExport = () => {
    // Einfacher CSV-Export
    const csvContent = [
      sectionData.headers.join(','),
      ...sectionData.dataRows.map(row => 
        sectionData.headers.map(header => `"${row[header] || ''}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${sectionName}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={() => navigate('/')}
            sx={{ mb: 1 }}
          >
            Zurück zum Dashboard
          </Button>
          <Typography variant="h4" component="h1">
            {decodeURIComponent(sectionName || '')}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleExport}
        >
          Exportieren
        </Button>
      </Box>

      {/* Statistics */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={3} alignItems="center">
            <Box>
              <Typography variant="body2" color="text.secondary">
                Spalten
              </Typography>
              <Chip label={sectionData.headers.length} color="primary" />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Datensätze
              </Typography>
              <Chip label={sectionData.dataRows.length} color="secondary" />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={25}
              rowsPerPageOptions={[10, 25, 50, 100]}
              checkboxSelection
              disableSelectionOnClick
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              sx={{
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #e0e0e0',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f5f5f5',
                  fontWeight: 'bold',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SectionDetail;
