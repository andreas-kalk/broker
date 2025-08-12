import React, {useEffect, useState} from 'react';
import {
  Alert,
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  useTheme
} from '@mui/material';
import {AccountBalance, Analytics, Assessment, Euro, ExpandMore as ExpandMoreIcon, TrendingDown, TrendingUp} from '@mui/icons-material';
import {useTranslation} from 'react-i18next';
import {type SymbolTransactions, transactionService, type TransactionSummary} from '../services/api';
import {Transaction} from '../types/api';

const TransactionsPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [transactions, setTransactions] = useState<SymbolTransactions[]>([]);
  const [transactionsByAssetKey, setTransactionsByAssetKey] = useState<Record<string, SymbolTransactions>>({});
  const [transactionsBySymbol, setTransactionsBySymbol] = useState<Record<string, SymbolTransactions>>({});
  const [transactionSummary, setTransactionSummary] = useState<TransactionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [groupingMode, setGroupingMode] = useState<'symbol' | 'assetKey'>('symbol');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadTransactionData();
  }, []);

  const loadTransactionData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        allTransactions,
        byAssetKey,
        bySymbol,
        summary
      ] = await Promise.all([
        transactionService.getAllTransactions(),
        transactionService.getTransactionsByAssetKey(),
        transactionService.getTransactionsBySymbol(),
        transactionService.getTransactionSummary()
      ]);

      setTransactions(allTransactions);
      setTransactionsByAssetKey(byAssetKey);
      setTransactionsBySymbol(bySymbol);
      setTransactionSummary(summary);
    } catch (err) {
      setError('Fehler beim Laden der Transaktionsdaten');
      console.error('Error loading transaction data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAssetTypeColor = (category: string): 'primary' | 'secondary' => {
    return category.toLowerCase().includes('option') ? 'secondary' : 'primary';
  };

  const getAssetTypeLabel = (category: string) => {
    return category.toLowerCase().includes('option') ? 'Optionen' : 'Aktien';
  };

  const toggleCardExpansion = (key: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedCards(newExpanded);
  };

  const renderHeader = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {t('nav.transactions')}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Transaktionsanalyse und Performance-Übersicht
      </Typography>
    </Box>
  );

  const renderSummaryCards = () => {
    if (!transactionSummary) return null;

    const summaryData = [
      {
        title: 'Symbole',
        value: transactionSummary.totalSymbols,
        subtitle: `${transactionSummary.totalTransactions} Transaktionen`,
        icon: <Assessment />,
        color: theme.palette.primary.main
      },
      {
        title: 'Erlöse',
        value: formatCurrency(transactionSummary.totalProceeds),
        subtitle: 'Gesamterlöse',
        icon: <TrendingUp />,
        color: theme.palette.success.main
      },
      {
        title: 'Gebühren',
        value: formatCurrency(transactionSummary.totalFees),
        subtitle: 'Gesamtgebühren',
        icon: <TrendingDown />,
        color: theme.palette.error.main
      },
      {
        title: 'Realisiert P&L',
        value: formatCurrency(transactionSummary.totalRealizedPnL),
        subtitle: 'Nettoergebnis',
        icon: <Euro />,
        color: transactionSummary.totalRealizedPnL >= 0 ? theme.palette.success.main : theme.palette.error.main
      }
    ];

    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(item.color, 0.1),
                      color: item.color,
                      mr: 2,
                      width: 48,
                      height: 48
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold" color={item.color}>
                      {item.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.title}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {item.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderTransactionTable = (symbolTransactions: SymbolTransactions[]) => (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell>Asset-Typ</TableCell>
                <TableCell align="right">Transaktionen</TableCell>
                <TableCell align="right">Erlöse</TableCell>
                <TableCell align="right">Gebühren</TableCell>
                <TableCell align="right">Realisiert P&L</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {symbolTransactions.map((st, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="600">
                        {st.asset?.symbol}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {st.asset?.key}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getAssetTypeLabel(st.asset?.category || '')}
                      color={getAssetTypeColor(st.asset?.category || '')}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="600">
                      {st.transactions?.length || 0}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="success.main" fontWeight="500">
                      {formatCurrency(st.sumProceeds || 0, st.currency)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="error.main" fontWeight="500">
                      {formatCurrency(st.sumFees || 0, st.currency)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      color={(st.sumRealizedPnL || 0) >= 0 ? 'success.main' : 'error.main'}
                      fontWeight="600"
                    >
                      {formatCurrency(st.sumRealizedPnL || 0, st.currency)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderGroupedTransactions = () => {
    const data = groupingMode === 'symbol' ? transactionsBySymbol : transactionsByAssetKey;

    return (
      <Box>
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Gruppierung</InputLabel>
            <Select
              value={groupingMode}
              label="Gruppierung"
              onChange={(e) => setGroupingMode(e.target.value as 'symbol' | 'assetKey')}
            >
              <MenuItem value="symbol">Nach Symbol</MenuItem>
              <MenuItem value="assetKey">Nach Asset-Key</MenuItem>
            </Select>
          </FormControl>
          <Chip
            label={`${Object.keys(data).length} Gruppen`}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Object.entries(data).map(([key, symbolTransactions]) => {
            const isExpanded = expandedCards.has(key);

            return (
              <Card key={key}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(getAssetTypeColor(symbolTransactions.asset?.category || '') === 'primary'
                            ? theme.palette.primary.main
                            : theme.palette.secondary.main, 0.1),
                          color: getAssetTypeColor(symbolTransactions.asset?.category || '') === 'primary'
                            ? theme.palette.primary.main
                            : theme.palette.secondary.main,
                          width: 40,
                          height: 40
                        }}
                      >
                        {getAssetTypeColor(symbolTransactions.asset?.category || '') === 'primary'
                          ? <AccountBalance />
                          : <Analytics />}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {key}
                        </Typography>
                        <Box display="flex" gap={1} alignItems="center">
                          <Chip
                            label={getAssetTypeLabel(symbolTransactions.asset?.category || '')}
                            color={getAssetTypeColor(symbolTransactions.asset?.category || '')}
                            size="small"
                            variant="outlined"
                          />
                          <Typography variant="caption" color="text.secondary">
                            {symbolTransactions.transactions?.length || 0} Transaktionen
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={2}>
                      <Box textAlign="right">
                        <Typography variant="body2" color="text.secondary">
                          Realisiert P&L
                        </Typography>
                        <Typography
                          variant="h6"
                          color={(symbolTransactions.sumRealizedPnL || 0) >= 0 ? 'success.main' : 'error.main'}
                          fontWeight="bold"
                        >
                          {formatCurrency(symbolTransactions.sumRealizedPnL || 0, symbolTransactions.currency)}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => toggleCardExpansion(key)}
                        sx={{
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s',
                        }}
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Collapse in={isExpanded}>
                    <Box mt={2}>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Datum</TableCell>
                              <TableCell align="right">Menge</TableCell>
                              <TableCell align="right">Preis</TableCell>
                              <TableCell align="right">Erlöse</TableCell>
                              <TableCell align="right">Gebühren</TableCell>
                              <TableCell align="right">Realisiert P&L</TableCell>
                              <TableCell>Code</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {symbolTransactions.transactions?.map((transaction: Transaction, index: number) => (
                              <TableRow key={index} hover>
                                <TableCell>
                                  <Typography variant="caption">
                                    {formatDate(transaction.dateTime)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography variant="body2">
                                    {transaction.quantity?.toFixed(2)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography variant="body2">
                                    {formatCurrency(transaction.price, transaction.currency)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography color="success.main" variant="body2">
                                    {formatCurrency(transaction.proceeds, transaction.currency)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography color="error.main" variant="body2">
                                    {formatCurrency(transaction.fees, transaction.currency)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography
                                    color={transaction.realizedPnL >= 0 ? 'success.main' : 'error.main'}
                                    fontWeight="500"
                                    variant="body2"
                                  >
                                    {formatCurrency(transaction.realizedPnL, transaction.currency)}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={transaction.code}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem' }}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Box>
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
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
        <Button onClick={loadTransactionData} sx={{ ml: 2 }}>
          Wiederholen
        </Button>
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {renderHeader()}
      {renderSummaryCards()}

      <Card sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ px: 2, pt: 1 }}>
          <Tab label="Übersicht" />
          <Tab label="Detailliert" />
        </Tabs>
      </Card>

      {tabValue === 0 && (
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
            Transaktionen nach Assets
          </Typography>
          {renderTransactionTable(transactions)}
        </Box>
      )}

      {tabValue === 1 && renderGroupedTransactions()}
    </Box>
  );
};

export default TransactionsPage;
