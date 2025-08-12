import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Collapse
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  TrendingUp,
  TrendingDown,
  Assessment,
  AccountBalance
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { transactionService, type SymbolTransactions, type TransactionSummary } from '../services/api';
import { Transaction } from '../types/api';

const TransactionsPage: React.FC = () => {
  const { t } = useTranslation();
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

  const renderSummaryCards = () => {
    if (!transactionSummary) return null;

    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Assessment sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Symbole
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {transactionSummary.totalSymbols}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {transactionSummary.totalTransactions} Transaktionen
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6" color="success.main">
                  Erlöse
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" color="success.main">
                {formatCurrency(transactionSummary.totalProceeds)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingDown sx={{ color: 'error.main', mr: 1 }} />
                <Typography variant="h6" color="error.main">
                  Gebühren
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" color="error.main">
                {formatCurrency(transactionSummary.totalFees)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AccountBalance sx={{
                  color: transactionSummary.totalRealizedPnL >= 0 ? 'success.main' : 'error.main',
                  mr: 1
                }} />
                <Typography variant="h6" color={transactionSummary.totalRealizedPnL >= 0 ? 'success.main' : 'error.main'}>
                  Realisiert P&L
                </Typography>
              </Box>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={transactionSummary.totalRealizedPnL >= 0 ? 'success.main' : 'error.main'}
              >
                {formatCurrency(transactionSummary.totalRealizedPnL)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderTransactionTable = (symbolTransactions: SymbolTransactions[]) => (
    <TableContainer component={Paper}>
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
                  <Typography variant="body2" fontWeight="bold">
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
                />
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight="bold">
                  {st.transactions?.length || 0}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="success.main">
                  {formatCurrency(st.sumProceeds || 0, st.currency)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="error.main">
                  {formatCurrency(st.sumFees || 0, st.currency)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography
                  color={(st.sumRealizedPnL || 0) >= 0 ? 'success.main' : 'error.main'}
                  fontWeight="bold"
                >
                  {formatCurrency(st.sumRealizedPnL || 0, st.currency)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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
          <Typography variant="body2" color="text.secondary">
            {Object.keys(data).length} Gruppen gefunden
          </Typography>
        </Box>

        {Object.entries(data).map(([key, symbolTransactions]) => {
          const isExpanded = expandedCards.has(key);

          return (
            <Card key={key} sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {key}
                    </Typography>
                    <Box display="flex" gap={2} alignItems="center">
                      <Chip
                        label={getAssetTypeLabel(symbolTransactions.asset?.category || '')}
                        color={getAssetTypeColor(symbolTransactions.asset?.category || '')}
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {symbolTransactions.transactions?.length || 0} Transaktionen
                      </Typography>
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
                  <Box mt={3}>
                    <TableContainer>
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
                            <TableRow key={index}>
                              <TableCell>
                                {formatDate(transaction.dateTime)}
                              </TableCell>
                              <TableCell align="right">
                                {transaction.quantity?.toFixed(2)}
                              </TableCell>
                              <TableCell align="right">
                                {formatCurrency(transaction.price, transaction.currency)}
                              </TableCell>
                              <TableCell align="right">
                                <Typography color="success.main">
                                  {formatCurrency(transaction.proceeds, transaction.currency)}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography color="error.main">
                                  {formatCurrency(transaction.fees, transaction.currency)}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography
                                  color={transaction.realizedPnL >= 0 ? 'success.main' : 'error.main'}
                                  fontWeight="bold"
                                >
                                  {formatCurrency(transaction.realizedPnL, transaction.currency)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip label={transaction.code} size="small" variant="outlined" />
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
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
        <Button onClick={loadTransactionData} sx={{ ml: 2 }}>
          Wiederholen
        </Button>
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Transaktionen
      </Typography>

      {renderSummaryCards()}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Übersicht" />
          <Tab label="Detailliert" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
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
