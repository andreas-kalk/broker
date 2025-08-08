import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Stack,
  Alert,
  Divider
} from '@mui/material';
import {
  ExpandMore,
  Search,
  Code,
  Help,
  Info,
  Assessment,
  AccountBalance,
  Euro,
  ShowChart
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const CodesAndHelp: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);

  // Transaction codes data - using translations
  const getTransactionCodes = () => [
    { code: 'A', description: 'Auftrag (Assignment)', category: t('help.categories.trading') },
    { code: 'O', description: 'Eröffnung (Opening)', category: t('help.categories.trading') },
    { code: 'C', description: 'Schließung (Closing)', category: t('help.categories.trading') },
    { code: 'L', description: 'Liquidation', category: t('help.categories.trading') },
    { code: 'T', description: 'Transfer', category: t('help.categories.trading') },
    { code: 'D', description: 'Dividende', category: t('help.categories.income') },
    { code: 'DIV', description: 'Dividende', category: t('help.categories.income') },
    { code: 'INT', description: 'Zinsen (Interest)', category: t('help.categories.income') },
    { code: 'F', description: 'Gebühr (Fee)', category: t('help.categories.costs') },
    { code: 'FEE', description: 'Gebühr (Fee)', category: t('help.categories.costs') },
    { code: 'TAX', description: 'Steuer (Tax)', category: t('help.categories.costs') },
    { code: 'ADJ', description: 'Anpassung (Adjustment)', category: t('help.categories.other') },
    { code: 'CORP', description: 'Corporate Action', category: t('help.categories.other') }
  ];

  // Asset categories - using translations
  const getAssetCategories = () => [
    { code: 'STK', description: t('help.assetTypes.stock'), details: t('help.assetDetails.stock') },
    { code: 'OPT', description: t('help.assetTypes.option'), details: t('help.assetDetails.option') },
    { code: 'FUT', description: t('help.assetTypes.future'), details: t('help.assetDetails.future') },
    { code: 'BOND', description: t('help.assetTypes.bond'), details: t('help.assetDetails.bond') },
    { code: 'ETF', description: t('help.assetTypes.etf'), details: t('help.assetDetails.etf') },
    { code: 'FUND', description: t('help.assetTypes.fund'), details: t('help.assetDetails.fund') },
    { code: 'CASH', description: t('help.assetTypes.cash'), details: t('help.assetDetails.cash') },
    { code: 'FOREX', description: t('help.assetTypes.forex'), details: t('help.assetDetails.forex') }
  ];

  // Help sections - using translations
  const getHelpSections = () => [
    {
      title: t('help.sections.csvUpload.title'),
      icon: <Assessment />,
      content: t('help.sections.csvUpload.content', { returnObjects: true }) as string[]
    },
    {
      title: t('help.sections.taxAnalysis.title'),
      icon: <Euro />,
      content: t('help.sections.taxAnalysis.content', { returnObjects: true }) as string[]
    },
    {
      title: t('help.sections.dataProcessing.title'),
      icon: <ShowChart />,
      content: t('help.sections.dataProcessing.content', { returnObjects: true }) as string[]
    },
    {
      title: t('help.sections.dataExplorer.title'),
      icon: <AccountBalance />,
      content: t('help.sections.dataExplorer.content', { returnObjects: true }) as string[]
    }
  ];

  const transactionCodes = getTransactionCodes();
  const assetCategories = getAssetCategories();
  const helpSections = getHelpSections();

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
          {t('help.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('help.description')}
        </Typography>
      </Box>

      {/* Search */}
      <Card elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder={t('help.search')}
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
            <Tab icon={<Code />} label={t('help.tabs.transactionCodes')} />
            <Tab icon={<Assessment />} label={t('help.tabs.assetCategories')} />
            <Tab icon={<Help />} label={t('help.tabs.applicationHelp')} />
          </Tabs>
        </Box>

        {/* Transaction Codes Tab */}
        <TabPanel value={selectedTab} index={0}>
          <CardContent>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              {t('help.transactionCodesInfo')}
            </Alert>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('table.code')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('table.description')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('table.category')}</TableCell>
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
              {t('help.assetCategoriesInfo')}
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
