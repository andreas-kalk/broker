import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tooltip,
  IconButton,
  Collapse,
  Grid,
  Divider,
  Alert
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  TrendingUp,
  TrendingDown,
  SwapHoriz
} from '@mui/icons-material';
import { SectionData } from '../types/api';
import { translateTransactionCode, getCodeDescription, translateAssetCategory } from '../utils/codeMapping';

interface TradesTableProps {
  sectionData: SectionData;
}

interface GroupedTrade {
  symbol: string;
  assetCategory: string;
  currency: string;
  trades: any[];
  totalQuantity: number;
  totalProceeds: number;
  totalFees: number;
  totalRealizedPL: number;
}

const TradesTable: React.FC<TradesTableProps> = ({ sectionData }) => {
  const [expandedSymbols, setExpandedSymbols] = useState<Set<string>>(new Set());

  // Add error boundary to prevent crashes
  try {
    if (!sectionData || !sectionData.dataRows || !Array.isArray(sectionData.dataRows)) {
      return (
        <Alert severity="warning">
          Keine gültigen Transaktionsdaten verfügbar.
        </Alert>
      );
    }

    const handleToggleSymbol = (symbol: string) => {
      const newExpanded = new Set(expandedSymbols);
      if (newExpanded.has(symbol)) {
        newExpanded.delete(symbol);
      } else {
        newExpanded.add(symbol);
      }
      setExpandedSymbols(newExpanded);
    };

    // Filter out SubTotal and Total rows, keep only actual trade data
    const tradeRows = sectionData.dataRows.filter(row => {
      try {
        return row &&
               typeof row === 'object' &&
               row['DataDiscriminator'] === 'Order' &&
               row['Symbol'] &&
               row['Symbol'].toString().trim() !== '';
      } catch (error) {
        console.warn('Error filtering trade row:', error, row);
        return false;
      }
    });

    if (tradeRows.length === 0) {
      return (
        <Alert severity="info">
          Keine Transaktionsdaten gefunden. Möglicherweise enthält diese Sektion keine handelsbaren Instrumente.
        </Alert>
      );
    }

    // Group trades by symbol
    const groupedTrades = tradeRows.reduce((acc: { [key: string]: GroupedTrade }, row) => {
      try {
        const symbol = row['Symbol']?.toString() || 'Unknown';
        const assetCategory = row['Asset Category']?.toString() || row['Assetklasse']?.toString() || '';
        const currency = row['Currency']?.toString() || 'EUR';

        if (!acc[symbol]) {
          acc[symbol] = {
            symbol,
            assetCategory,
            currency,
            trades: [],
            totalQuantity: 0,
            totalProceeds: 0,
            totalFees: 0,
            totalRealizedPL: 0
          };
        }

        acc[symbol].trades.push(row);

        // Debug: Log all available fields for the first row to see actual field names
        if (Object.keys(acc).length === 1 && acc[symbol].trades.length === 1) {
          console.log('Available fields in trade data:', Object.keys(row));
          console.log('Full row data:', row);

          // Log each field value to see the actual data structure
          Object.keys(row).forEach(key => {
            console.log(`Field "${key}":`, row[key]);
          });
        }

        // Calculate totals with error handling and debug logging
        const quantityStr = row['Quantity']?.toString() || '0';
        const proceedsStr = row['Proceeds']?.toString() || '0';
        const feesStr = row['Comm/Fee']?.toString() || '0';
        const realizedPLStr = row['Realized P/L']?.toString() || '0';

        // Try alternative field names that might exist in the data
        const altQuantityStr = row['Menge']?.toString() || row['Anzahl']?.toString() || quantityStr;
        const altProceedsStr = row['Erlös']?.toString() || row['Umsatz']?.toString() || proceedsStr;
        const altFeesStr = row['Gebühren']?.toString() || row['Provision']?.toString() || feesStr;
        const altRealizedPLStr = row['Realisierter G/V']?.toString() || row['Gewinn/Verlust']?.toString() || realizedPLStr;

        // Parse numbers more carefully - handle both comma and dot decimal separators
        const parseNumber = (str: string): number => {
          if (!str || str.trim() === '' || str === '-') return 0;

          // Handle German number format (1.234,56) and US format (1,234.56)
          let cleanStr = str.replace(/[^\d.,-]/g, ''); // Keep digits, dots, commas, minus

          // If there are both comma and dot, determine which is decimal separator
          if (cleanStr.includes(',') && cleanStr.includes('.')) {
            // If comma comes after dot, comma is decimal separator (1.234,56)
            if (cleanStr.lastIndexOf(',') > cleanStr.lastIndexOf('.')) {
              cleanStr = cleanStr.replace(/\./g, '').replace(',', '.');
            } else {
              // Otherwise dot is decimal separator (1,234.56)
              cleanStr = cleanStr.replace(/,/g, '');
            }
          } else if (cleanStr.includes(',')) {
            // Only comma - could be thousands separator or decimal
            // If comma is followed by exactly 3 digits, it's thousands separator
            if (/,\d{3}$/.test(cleanStr)) {
              cleanStr = cleanStr.replace(',', '');
            } else {
              // Otherwise it's decimal separator
              cleanStr = cleanStr.replace(',', '.');
            }
          }

          const result = parseFloat(cleanStr) || 0;
          return result;
        };

        const quantity = parseNumber(altQuantityStr);
        const proceeds = parseNumber(altProceedsStr);
        const fees = parseNumber(altFeesStr);
        const realizedPL = parseNumber(altRealizedPLStr);

        // Debug logging for first few rows
        if (Object.keys(acc).length <= 2) {
          console.log('Parsing trade data:', {
            symbol,
            fields: {
              'Quantity': quantityStr, 'Alt Quantity': altQuantityStr, parsed: quantity,
              'Proceeds': proceedsStr, 'Alt Proceeds': altProceedsStr, parsed: proceeds,
              'Comm/Fee': feesStr, 'Alt Fees': altFeesStr, parsed: fees,
              'Realized P/L': realizedPLStr, 'Alt P/L': altRealizedPLStr, parsed: realizedPL
            }
          });
        }

        acc[symbol].totalQuantity += quantity;
        acc[symbol].totalProceeds += proceeds;
        acc[symbol].totalFees += fees;
        acc[symbol].totalRealizedPL += realizedPL;

        return acc;
      } catch (error) {
        console.warn('Error processing trade row:', error, row);
        return acc;
      }
    }, {});

    const formatCurrency = (value: number, currency: string = 'EUR'): string => {
      try {
        return new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: currency
        }).format(value);
      } catch (error) {
        return `${value.toFixed(2)} ${currency}`;
      }
    };

    const formatDateTime = (dateTimeStr: string) => {
      if (!dateTimeStr || dateTimeStr.toString().trim() === '') return '-';
      try {
        const dateTimeString = dateTimeStr.toString();
        const [datePart, timePart] = dateTimeString.split(', ');
        return (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {datePart || dateTimeString}
            </Typography>
            {timePart && (
              <Typography variant="caption" color="text.secondary">
                {timePart}
              </Typography>
            )}
          </Box>
        );
      } catch (error) {
        return dateTimeStr.toString();
      }
    };

    const getQuantityIcon = (quantity: number) => {
      if (quantity > 0) return <TrendingUp color="success" fontSize="small" />;
      if (quantity < 0) return <TrendingDown color="error" fontSize="small" />;
      return <SwapHoriz color="action" fontSize="small" />;
    };

    const getPLColor = (value: number) => {
      if (value > 0) return 'success.main';
      if (value < 0) return 'error.main';
      return 'text.primary';
    };

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Handelsübersicht nach Symbolen
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {Object.keys(groupedTrades).length} verschiedene Symbole, {tradeRows.length} Transaktionen
        </Typography>

        {Object.entries(groupedTrades).map(([symbol, group]) => {
          const isExpanded = expandedSymbols.has(symbol);

          return (
            <Card key={symbol} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ pb: '16px !important' }}>
                {/* Symbol Header */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleToggleSymbol(symbol)}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {symbol}
                    </Typography>
                    <Chip
                      label={translateAssetCategory(group.assetCategory)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={group.currency}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`${group.trades.length} Trades`}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                  </Box>

                  <Box display="flex" alignItems="center" gap={2}>
                    <Box textAlign="right">
                      <Typography variant="body2" color="text.secondary">
                        Gesamt P&L
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: getPLColor(group.totalRealizedPL),
                          fontWeight: 'bold'
                        }}
                      >
                        {formatCurrency(group.totalRealizedPL, group.currency)}
                      </Typography>
                    </Box>

                    <IconButton size="small">
                      {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>
                </Box>

                {/* Summary Row */}
                <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
                  <Grid item xs={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Gesamtmenge
                      </Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        {getQuantityIcon(group.totalQuantity)}
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {group.totalQuantity.toLocaleString('de-DE')}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Gesamtumsatz
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {formatCurrency(Math.abs(group.totalProceeds), group.currency)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Gebühren
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {formatCurrency(Math.abs(group.totalFees), group.currency)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Realisiert P&L
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 'bold',
                          color: getPLColor(group.totalRealizedPL)
                        }}
                      >
                        {formatCurrency(group.totalRealizedPL, group.currency)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Detailed Trades */}
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Einzelne Transaktionen
                  </Typography>

                  <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
                            Datum/Zeit
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
                            Menge
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
                            Preis
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
                            Umsatz
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
                            Gebühren
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
                            P&L
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
                            Code
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {group.trades.map((trade, index) => {
                          try {
                            const quantity = parseFloat(trade['Quantity']?.toString() || '0') || 0;
                            const price = parseFloat(trade['T. Price']?.toString() || '0') || 0;
                            const proceeds = parseFloat(trade['Proceeds']?.toString() || '0') || 0;
                            const fees = parseFloat(trade['Comm/Fee']?.toString() || '0') || 0;
                            const realizedPL = parseFloat(trade['Realized P/L']?.toString() || '0') || 0;
                            const code = trade['Code']?.toString() || '';

                            return (
                              <TableRow key={index} hover>
                                <TableCell>
                                  {formatDateTime(trade['Date/Time']?.toString() || '')}
                                </TableCell>
                                <TableCell>
                                  <Box display="flex" alignItems="center" gap={0.5}>
                                    {getQuantityIcon(quantity)}
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 'medium',
                                        color: quantity >= 0 ? 'success.main' : 'error.main'
                                      }}
                                    >
                                      {quantity.toLocaleString('de-DE')}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {formatCurrency(price, group.currency)}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {formatCurrency(Math.abs(proceeds), group.currency)}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {formatCurrency(Math.abs(fees), group.currency)}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 'medium',
                                      color: getPLColor(realizedPL)
                                    }}
                                  >
                                    {formatCurrency(realizedPL, group.currency)}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  {code ? (
                                    <Tooltip
                                      title={`${code} | ${getCodeDescription(code)}`}
                                      arrow
                                      placement="top"
                                    >
                                      <Chip
                                        label={translateTransactionCode(code)}
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        sx={{ cursor: 'help', fontSize: '0.7rem' }}
                                      />
                                    </Tooltip>
                                  ) : '-'}
                                </TableCell>
                              </TableRow>
                            );
                          } catch (error) {
                            console.warn('Error rendering trade row:', error, trade);
                            return (
                              <TableRow key={index}>
                                <TableCell colSpan={7}>
                                  <Typography variant="caption" color="error">
                                    Fehler beim Anzeigen dieser Transaktion
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            );
                          }
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Collapse>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    );

  } catch (error) {
    console.error('Error in TradesTable:', error);
    return (
      <Alert severity="error">
        <Typography variant="h6">Fehler beim Laden der Transaktionsdaten</Typography>
        <Typography variant="body2">
          Es ist ein Fehler beim Verarbeiten der Transaktionsdaten aufgetreten.
          Bitte überprüfen Sie die Konsole für weitere Details.
        </Typography>
        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
          Fehler: {error instanceof Error ? error.message : 'Unbekannter Fehler'}
        </Typography>
      </Alert>
    );
  }
};

export default TradesTable;
