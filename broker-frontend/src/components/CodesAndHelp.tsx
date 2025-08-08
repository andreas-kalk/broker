import React, {useState} from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  alpha,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import {AccountBalance, Assessment, Code, Euro, ExpandMore, Help, Search, ShowChart} from '@mui/icons-material';

const CodesAndHelp: React.FC = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);

  // Transaction codes data
  const transactionCodes = [
    { code: 'A', description: 'Auftrag (Assignment)', category: 'Handel' },
    { code: 'O', description: 'Eröffnung (Opening)', category: 'Handel' },
    { code: 'C', description: 'Schließung (Closing)', category: 'Handel' },
    { code: 'L', description: 'Liquidation', category: 'Handel' },
    { code: 'T', description: 'Transfer', category: 'Handel' },
    { code: 'D', description: 'Dividende', category: 'Einkommen' },
    { code: 'DIV', description: 'Dividende', category: 'Einkommen' },
    { code: 'INT', description: 'Zinsen (Interest)', category: 'Einkommen' },
    { code: 'F', description: 'Gebühr (Fee)', category: 'Kosten' },
    { code: 'FEE', description: 'Gebühr (Fee)', category: 'Kosten' },
    { code: 'TAX', description: 'Steuer (Tax)', category: 'Kosten' },
    { code: 'ADJ', description: 'Anpassung (Adjustment)', category: 'Sonstige' },
    { code: 'CORP', description: 'Corporate Action', category: 'Sonstige' }
  ];

  // Asset categories
  const assetCategories = [
    { code: 'STK', description: 'Aktie (Stock)', details: 'Einzelaktien von Unternehmen' },
    { code: 'OPT', description: 'Option', details: 'Optionskontrakte auf Basiswerte' },
    { code: 'FUT', description: 'Future', details: 'Terminkontrakte' },
    { code: 'BOND', description: 'Anleihe (Bond)', details: 'Staatsanleihen und Unternehmensanleihen' },
    { code: 'ETF', description: 'ETF', details: 'Exchange Traded Funds' },
    { code: 'FUND', description: 'Fonds', details: 'Investmentfonds' },
    { code: 'CASH', description: 'Bargeld (Cash)', details: 'Liquidität und Geldmarktinstrumente' },
    { code: 'FOREX', description: 'Devisen', details: 'Fremdwährungsgeschäfte' }
  ];

  // Help sections
  const helpSections = [
    {
      title: 'CSV-Datei Upload',
      icon: <Assessment />,
      content: [
        'Unterstützte Formate: CSV-Dateien von Interactive Brokers, Comdirect und anderen Brokern',
        'Maximale Dateigröße: 50 MB',
        'Die Datei wird automatisch analysiert und in Sektionen unterteilt',
        'Alle Daten werden lokal verarbeitet und nicht dauerhaft gespeichert'
      ]
    },
    {
      title: 'Steueranalyse (KAP-Formular)',
      icon: <Euro />,
      content: [
        'Automatische Berechnung von Kapitalerträgen und -verlusten',
        'FIFO-Methode für die Zuordnung von Käufen und Verkäufen',
        'Erfassung von Dividenden und ausländischen Quellensteuern',
        'Export-ready Daten für die Steuererklärung',
        'Unterscheidung zwischen kurz- und langfristigen Kapitalerträgen'
      ]
    },
    {
      title: 'Datenverarbeitung',
      icon: <ShowChart />,
      content: [
        'Flexible CSV-Parser für verschiedene Broker-Formate',
        'Automatische Erkennung von Transaktionstypen',
        'Währungsumrechnung und Kostenberechnung',
        'Gruppierung von zusammengehörigen Transaktionen',
        'Validierung und Bereinigung der Eingabedaten'
      ]
    },
    {
      title: 'Datenexplorer',
      icon: <AccountBalance />,
      content: [
        'Strukturierte Ansicht aller verfügbaren Datensektionen',
        'Such- und Filterfunktionen für spezifische Daten',
        'Export-Möglichkeiten für einzelne Sektionen',
        'Detailansichten für Trades, Dividenden und andere Transaktionen',
        'Übersichtliche Kategorisierung nach Datentypen'
      ]
    }
  ];

  const filteredCodes = transactionCodes.filter(item =>
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssets = assetCategories.filter(item =>
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Codes & Hilfe
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Nachschlagewerk für Transaktionscodes und Anwendungshilfe
        </Typography>
      </Box>

      {/* Search */}
      <Card elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Suche nach Codes oder Beschreibungen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={(_, value) => setSelectedTab(value)}>
            <Tab icon={<Code />} label="Transaktionscodes" />
            <Tab icon={<Assessment />} label="Asset-Kategorien" />
            <Tab icon={<Help />} label="Anwendungshilfe" />
          </Tabs>
        </Box>

        {/* Transaction Codes Tab */}
        <TabPanel value={selectedTab} index={0}>
          <CardContent>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              Diese Codes werden von Brokern zur Kennzeichnung verschiedener Transaktionstypen verwendet.
            </Alert>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Beschreibung</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Kategorie</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCodes.map((item, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Chip
                          label={item.code}
                          size="small"
                          color="primary"
                          sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.category}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </TabPanel>

        {/* Asset Categories Tab */}
        <TabPanel value={selectedTab} index={1}>
          <CardContent>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              Asset-Kategorien klassifizieren die verschiedenen Arten von Finanzinstrumenten.
            </Alert>

            <Grid container spacing={2}>
              {filteredAssets.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05)
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        <Chip
                          label={item.code}
                          size="small"
                          color="secondary"
                          sx={{ mr: 1, fontFamily: 'monospace' }}
                        />
                        {item.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.details}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </TabPanel>

        {/* Help Tab */}
        <TabPanel value={selectedTab} index={2}>
          <CardContent>
            <Stack spacing={3}>
              {helpSections.map((section, index) => (
                <Accordion
                  key={index}
                  elevation={0}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    '&:before': { display: 'none' }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: '8px 8px 0 0'
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      {section.icon}
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {section.title}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      {section.content.map((item, itemIndex) => (
                        <Box key={itemIndex} display="flex" alignItems="flex-start" gap={2}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: theme.palette.primary.main,
                              mt: 1,
                              flexShrink: 0
                            }}
                          />
                          <Typography variant="body2">{item}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </CardContent>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default CodesAndHelp;
