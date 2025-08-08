import React, {useState} from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
  Typography
} from '@mui/material';
import {SectionData} from '../types/api';
import {CloudUpload, Code, DataArray, Delete, Info, TableChart, UploadFile, Visibility, VisibilityOff} from '@mui/icons-material';
import FileUpload from './FileUpload';
import DividendsTable from './DividendsTable';
import TransactionsTable from './TransactionsTable';
import CodesHelp from './CodesHelp';
import {getCodeDescription, translateAssetCategory, translateTransactionCode} from '../utils/codeMapping';
import {useReportData} from '../hooks/useReportData';
import {useFileUpload} from '../hooks/useFileUpload';
import {getSectionType, isFinancialSection} from '../utils/sectionUtils';
import {APP_CONFIG, SECTION_TYPES} from '../config/constants';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: Readonly<TabPanelProps>) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`section-tabpanel-${index}`}
      aria-labelledby={`section-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `section-tab-${index}`,
    'aria-controls': `section-tabpanel-${index}`,
  };
}

const Dashboard: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [showCodesHelp, setShowCodesHelp] = useState(false);

  const { summary, sections, loading, error, hasUploadedFile, refetch } = useReportData();
  const { clearUploadedFile } = useFileUpload();

  const handleUploadSuccess = () => {
    setShowUpload(false);
    refetch();
  };

  const handleClearUploadedFile = async () => {
    await clearUploadedFile();
    await refetch();
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleSectionToggle = (sectionName: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionName)) {
      newOpenSections.delete(sectionName);
    } else {
      newOpenSections.add(sectionName);
    }
    setOpenSections(newOpenSections);
  };

  const renderSectionContent = (sectionName: string, sectionData: SectionData) => {
    const sectionType = getSectionType(sectionName);

    // Special handling based on section type
    if (sectionType === SECTION_TYPES.DIVIDENDS) {
      return <DividendsTable sectionData={sectionData} />;
    }

    if (sectionType === SECTION_TYPES.TRADES) {
      return <TransactionsTable sectionData={sectionData} />;
    }

    // Default table for other sections
    return (
      <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: APP_CONFIG.UI.MAX_TABLE_HEIGHT }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {sectionData.headers.map((header) => (
                <TableCell key={header} sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sectionData.dataRows.map((row, index) => (
              <TableRow key={index} hover>
                {sectionData.headers.map((header) => {
                  let cellValue = row[header] || '-';

                  // Apply translations for specific columns in financial sections
                  if (isFinancialSection(sectionName)) {
                    if (header.toLowerCase() === 'code' && cellValue !== '-') {
                      const translatedCode = translateTransactionCode(cellValue);
                      const description = getCodeDescription(cellValue);

                      return (
                        <TableCell key={header}>
                          <Tooltip
                            title={`Original: ${cellValue} | Bedeutung: ${description}`}
                            arrow
                            placement="top"
                          >
                            <Chip
                              label={translatedCode}
                              size="small"
                              variant="outlined"
                              color="primary"
                              sx={{ cursor: 'help' }}
                            />
                          </Tooltip>
                        </TableCell>
                      );
                    }

                    if ((header.toLowerCase() === 'asset category' ||
                         header.toLowerCase() === 'assetklasse') && cellValue !== '-') {
                      const translatedCategory = translateAssetCategory(cellValue);

                      return (
                        <TableCell key={header}>
                          <Tooltip
                            title={`Original: ${cellValue}`}
                            arrow
                            placement="top"
                          >
                            <Chip
                              label={translatedCategory}
                              size="small"
                              variant="outlined"
                              color="secondary"
                              sx={{ cursor: 'help' }}
                            />
                          </Tooltip>
                        </TableCell>
                      );
                    }
                  }

                  return (
                    <TableCell key={header}>
                      {cellValue}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderInfoCard = (title: string, sectionData: SectionData, sectionKey: string) => {
    // Handle special case for Statement and Kontoinformation sections with Feldname/Feldwert structure
    const groupedData: { [key: string]: any } = {};

    // Check if this section uses Feldname/Feldwert structure
    const hasFeldnameStructure = sectionData.headers.includes('Feldname') && sectionData.headers.includes('Feldwert');

    if (hasFeldnameStructure) {
      // For Statement and Kontoinformation sections with Feldname/Feldwert structure
      sectionData.dataRows.forEach((row) => {
        const fieldName = row['Feldname'];
        const fieldValue = row['Feldwert'];
        if (fieldName && fieldValue && fieldValue.trim() !== '' && fieldValue !== '-') {
          groupedData[fieldName] = fieldValue;
        }
      });
    } else {
      // For regular sections
      sectionData.dataRows.forEach((row) => {
        sectionData.headers.forEach((header) => {
          const value = row[header];
          if (value && value !== '-' && value.trim() !== '') {
            groupedData[header] = value;
          }
        });
      });
    }

    // Define important fields that should be highlighted
    const importantFields = [
      'Name', 'Account', 'Kontotyp', 'Kundentyp', 'Basiswährung', 'Kontoberechtigungen',
      'BrokerName', 'Title', 'Period', 'WhenGenerated'
    ];

    const importantData: { [key: string]: any } = {};
    const otherData: { [key: string]: any } = {};

    Object.entries(groupedData).forEach(([key, value]) => {
      if (importantFields.includes(key)) {
        importantData[key] = value;
      } else {
        otherData[key] = value;
      }
    });

    const isOpen = openSections.has(sectionKey);

    return (
      <Card sx={{ mb: 2, border: '1px solid', borderColor: 'primary.light' }}>
        <CardContent sx={{ pb: '16px !important' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main'
              }}
            >
              {title}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label={`${Object.keys(groupedData).length} Felder`}
                size="small"
                variant="outlined"
                color="primary"
              />
              <IconButton
                size="small"
                onClick={() => handleSectionToggle(sectionKey)}
                color="primary"
                sx={{
                  transition: 'transform 0.2s',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                {isOpen ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>
          </Box>

          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box sx={{ borderTop: '2px solid', borderColor: 'primary.light', pt: 2 }}>
              {/* Important Information - Highlighted */}
              {Object.keys(importantData).length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={1}>
                    {Object.entries(importantData).map(([key, value]) => (
                      <Grid item xs={12} sm={6} md={4} key={key}>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                            border: '1px solid',
                            borderColor: 'rgba(25, 118, 210, 0.3)',
                            minHeight: '60px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 'medium',
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                              color: 'primary.dark',
                              fontSize: '0.7rem'
                            }}
                          >
                            {key}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 'bold',
                              color: 'text.primary',
                              mt: 0.5,
                              wordBreak: 'break-word'
                            }}
                          >
                            {value}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Additional Information - Compact */}
              {Object.keys(otherData).length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: 'medium', fontSize: '0.8rem' }}
                  >
                    Weitere Details:
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    backgroundColor: 'grey.50',
                    p: 1.5,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'grey.200'
                  }}>
                    {Object.entries(otherData).map(([key, value]) => (
                      <Box
                        key={key}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 0.5,
                          border: '1px solid',
                          borderColor: 'grey.300',
                          minWidth: 'fit-content'
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontWeight: 'medium',
                            mr: 0.5,
                            fontSize: '0.7rem'
                          }}
                        >
                          {key}:
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 'bold',
                            fontSize: '0.7rem'
                          }}
                        >
                          {value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Show all raw data for debugging if no structured data found */}
              {Object.keys(groupedData).length === 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Debug - Rohdaten:
                  </Typography>
                  <Box sx={{ backgroundColor: 'grey.100', p: 2, borderRadius: 1 }}>
                    <Typography variant="caption" component="pre" sx={{ fontSize: '0.7rem' }}>
                      Headers: {JSON.stringify(sectionData.headers, null, 2)}
                      {'\n'}
                      Data: {JSON.stringify(sectionData.dataRows, null, 2)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const sectionEntries = sections ? Object.entries(sections) : [];

  // Extract Statement and Kontoinformation sections
  const statementSection = sections?.['Statement'] || sections?.['statement'];
  const kontoinformationSection = sections?.['Kontoinformation'] || sections?.['kontoinformation'] || sections?.['Account Information'] || sections?.['account_information'];

  // Filter out Statement and Kontoinformation from tab sections
  const tabSectionEntries = sectionEntries.filter(([sectionName]) =>
    !['Statement', 'statement', 'Kontoinformation', 'kontoinformation', 'Account Information', 'account_information'].includes(sectionName)
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Report Dashboard
        </Typography>
        <Box display="flex" gap={2}>
          {hasUploadedFile && (
            <>
              <Button
                variant={showCodesHelp ? 'contained' : 'outlined'}
                color="info"
                startIcon={<Code />}
                onClick={() => setShowCodesHelp(!showCodesHelp)}
              >
                {showCodesHelp ? 'Codes ausblenden' : 'Codes & Hilfe'}
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleClearUploadedFile}
              >
                Datei entfernen
              </Button>
            </>
          )}
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => setShowUpload(!showUpload)}
          >
            CSV hochladen
          </Button>
        </Box>
      </Box>

      {/* File Upload Section */}
      {showUpload && (
        <Box mb={4}>
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </Box>
      )}

      {/* No Data State */}
      {!hasUploadedFile && (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', mb: 4 }}>
          <UploadFile sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="text.secondary">
            Keine CSV-Datei hochgeladen
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Laden Sie eine CSV-Datei hoch, um mit der Analyse Ihrer Broker-Daten zu beginnen.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<CloudUpload />}
            onClick={() => setShowUpload(true)}
          >
            CSV-Datei hochladen
          </Button>
        </Paper>
      )}

      {/* Data Display - Only shown when file is uploaded */}
      {hasUploadedFile && (
        <>
          {/* Current File Info */}
          {summary?.currentFileName && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Aktuell geladene Datei: <strong>{summary.currentFileName}</strong>
            </Alert>
          )}

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <TableChart color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Sektionen</Typography>
                  </Box>
                  <Typography variant="h3" color="primary">
                    {summary?.sectionCount || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <DataArray color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Datensätze</Typography>
                  </Box>
                  <Typography variant="h3" color="secondary">
                    {summary?.totalDataRows || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Info color="info" sx={{ mr: 1 }} />
                    <Typography variant="h6">Status</Typography>
                  </Box>
                  <Chip
                    label="Aktiv"
                    color="success"
                    variant="outlined"
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Fixed Statement and Kontoinformation Cards */}
          {statementSection && renderInfoCard('Statement - Bericht Information', statementSection, 'statement-section')}
          {kontoinformationSection && renderInfoCard('Kontoinformation', kontoinformationSection, 'kontoinformation-section')}

          {/* Codes Help Section */}
          {showCodesHelp && (
            <Box sx={{ mb: 4 }}>
              <CodesHelp />
            </Box>
          )}

          {/* Sections Tabs */}
          {tabSectionEntries.length > 0 && (
            <Card>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ px: 2 }}
                  >
                    {tabSectionEntries.map(([sectionName, sectionData], index) => (
                      <Tab
                        key={sectionName}
                        label={
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {sectionName}
                            </Typography>
                            <Box display="flex" gap={1} mt={0.5}>
                              <Chip
                                label={`${sectionData.dataRows.length} Zeilen`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: '20px' }}
                              />
                              <Chip
                                label={`${sectionData.headers.length} Spalten`}
                                size="small"
                                variant="outlined"
                                color="secondary"
                                sx={{ fontSize: '0.7rem', height: '20px' }}
                              />
                            </Box>
                          </Box>
                        }
                        {...a11yProps(index)}
                        sx={{ textTransform: 'none', minHeight: '80px' }}
                      />
                    ))}
                  </Tabs>
                </Box>

                {tabSectionEntries.map(([sectionName, sectionData], index) => (
                  <TabPanel key={sectionName} value={selectedTab} index={index}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {sectionName} - Datenübersicht
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {sectionData.dataRows.length} Datensätze mit {sectionData.headers.length} Spalten
                      </Typography>

                      {renderSectionContent(sectionName, sectionData)}
                    </Box>
                  </TabPanel>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
};

export default Dashboard;
