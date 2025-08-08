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
  Alert,
  Button,
  ButtonGroup,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  Search,
  FilterList,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { SectionData } from '../types/api';
import { translateTransactionCode, getCodeDescription, translateAssetCategory } from '../utils/codeMapping';

interface TransactionsTableProps {
  sectionData: SectionData;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ sectionData }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['orders']));
  const [viewMode, setViewMode] = useState<'grouped' | 'detailed' | 'combined' | 'category'>('grouped');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('all');

  // Add error boundary to prevent crashes
  try {
    if (!sectionData?.dataRows || !Array.isArray(sectionData.dataRows)) {
      return (
        <Alert severity="warning" sx={{ m: 2 }}>
          <Typography variant="h6">Keine gültigen Transaktionsdaten verfügbar</Typography>
          <Typography>Bitte stellen Sie sicher, dass eine gültige CSV-Datei hochgeladen wurde.</Typography>
        </Alert>
      );
    }

    const handleToggleSection = (section: string) => {
      const newExpanded = new Set(expandedSections);
      if (newExpanded.has(section)) {
        newExpanded.delete(section);
      } else {
        newExpanded.add(section);
      }
      setExpandedSections(newExpanded);
    };

    // Debug logging to see what data we have
    console.log('=== Transactions Data Debug ===');
    console.log('Headers:', sectionData.headers);
    console.log('Total rows:', sectionData.dataRows.length);
    if (sectionData.dataRows.length > 0) {
      console.log('First row example:', sectionData.dataRows[0]);
    }

    // Separate different types of data
    const orderData = sectionData.dataRows.filter(row =>
      row && row['DataDiscriminator'] === 'Order'
    );

    const subTotalData = sectionData.dataRows.filter(row =>
      row && row['DataDiscriminator'] === 'SubTotal'
    );

    const totalData = sectionData.dataRows.filter(row =>
      row && row['DataDiscriminator'] === 'Total'
    );

    // Get unique symbols for filtering
    const uniqueSymbols = Array.from(new Set(
      orderData.map(row => row['Symbol']).filter(symbol => symbol && symbol !== '-')
    )).sort();

    // Filter data based on search and symbol selection
    const filteredOrderData = orderData.filter(row => {
      const matchesSearch = !searchTerm ||
        Object.values(row).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesSymbol = selectedSymbol === 'all' || row['Symbol'] === selectedSymbol;
      return matchesSearch && matchesSymbol;
    });

    console.log('Data breakdown:', {
      orders: orderData.length,
      filteredOrders: filteredOrderData.length,
      subTotals: subTotalData.length,
      totals: totalData.length,
      uniqueSymbols: uniqueSymbols.length
    });

    const formatCurrency = (value: any, currency: string = 'EUR'): string => {
      if (!value || value === '-' || value === '') return '-';

      try {
        let numStr = value.toString().replace(/[^\d.,-]/g, '');

        if (numStr.includes(',') && numStr.includes('.')) {
          if (numStr.lastIndexOf(',') > numStr.lastIndexOf('.')) {
            numStr = numStr.replace(/\./g, '').replace(',', '.');
          } else {
            numStr = numStr.replace(/,/g, '');
          }
        } else if (numStr.includes(',')) {
          if (/,\d{1,2}$/.test(numStr)) {
            numStr = numStr.replace(',', '.');
          } else {
            numStr = numStr.replace(',', '');
          }
        }

        const num = parseFloat(numStr);
        if (isNaN(num)) return value.toString();

        return new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: currency
        }).format(num);
      } catch (error) {
        return value.toString();
      }
    };

    const formatNumber = (value: any): string => {
      if (!value || value === '-' || value === '') return '-';

      try {
        const numStr = value.toString().replace(/[^\d.,-]/g, '');
        const num = parseFloat(numStr.replace(',', '.'));
        if (isNaN(num)) return value.toString();

        return num.toLocaleString('de-DE');
      } catch (error) {
        return value.toString();
      }
    };

    const formatDateTime = (dateTimeStr: any) => {
      if (!dateTimeStr || dateTimeStr === '-') return '-';

      try {
        const dateTimeString = dateTimeStr.toString();
        const [datePart, timePart] = dateTimeString.split(', ');
        return (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
              {datePart || dateTimeString}
            </Typography>
            {timePart && (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                {timePart}
              </Typography>
            )}
          </Box>
        );
      } catch (error) {
        return dateTimeStr.toString();
      }
    };

    const getQuantityIcon = (quantity: any) => {
      const num = parseFloat(quantity?.toString() || '0');
      if (num > 0) return <TrendingUp color="success" fontSize="small" />;
      if (num < 0) return <TrendingDown color="error" fontSize="small" />;
      return <SwapHoriz color="action" fontSize="small" />;
    };

    const getPLColor = (value: any) => {
      const num = parseFloat(value?.toString() || '0');
      if (num > 0) return 'success.main';
      if (num < 0) return 'error.main';
      return 'text.primary';
    };

    // Group orders by symbol for better overview
    const groupedOrders = filteredOrderData.reduce((acc: any, row) => {
      const symbol = row['Symbol'] || 'Unknown';
      if (!acc[symbol]) {
        acc[symbol] = [];
      }
      acc[symbol].push(row);
      return acc;
    }, {});

    // Group orders by symbol AND asset category for combined view
    const groupedBySymbolAndCategory = filteredOrderData.reduce((acc: any, row) => {
      const symbol = row['Symbol'] || 'Unknown';
      const category = row['Asset Category'] || 'Unknown';
      const key = `${symbol}|${category}`;

      if (!acc[key]) {
        acc[key] = {
          symbol,
          category,
          orders: [],
          totalQuantity: 0,
          totalProceeds: 0,
          totalPL: 0,
          totalCommission: 0,
          currency: row['Currency'] || 'EUR'
        };
      }

      acc[key].orders.push(row);
      acc[key].totalQuantity += parseFloat(row['Quantity']?.toString() || '0') || 0;
      acc[key].totalProceeds += Math.abs(parseFloat(row['Proceeds']?.toString() || '0') || 0);
      acc[key].totalPL += parseFloat(row['Realized P/L']?.toString() || '0') || 0;
      acc[key].totalCommission += Math.abs(parseFloat(row['Comm/Fee']?.toString() || '0') || 0);

      return acc;
    }, {});

    // Group by category only for category overview
    const groupedByCategory = filteredOrderData.reduce((acc: any, row) => {
      const category = row['Asset Category'] || 'Unknown';

      if (!acc[category]) {
        acc[category] = {
          orders: [],
          symbols: new Set(),
          totalQuantity: 0,
          totalProceeds: 0,
          totalPL: 0,
          totalCommission: 0,
          currencies: new Set()
        };
      }

      acc[category].orders.push(row);
      acc[category].symbols.add(row['Symbol']);
      acc[category].currencies.add(row['Currency'] || 'EUR');
      acc[category].totalQuantity += parseFloat(row['Quantity']?.toString() || '0') || 0;
      acc[category].totalProceeds += Math.abs(parseFloat(row['Proceeds']?.toString() || '0') || 0);
      acc[category].totalPL += parseFloat(row['Realized P/L']?.toString() || '0') || 0;
      acc[category].totalCommission += Math.abs(parseFloat(row['Comm/Fee']?.toString() || '0') || 0);

      return acc;
    }, {});

    const renderGroupedOrders = () => {
      return Object.entries(groupedOrders).map(([symbol, orders]: [string, any]) => {
        const isExpanded = expandedSections.has(`symbol-${symbol}`);

        // Calculate totals for this symbol
        const totalQuantity = orders.reduce((sum: number, order: any) =>
          sum + (parseFloat(order['Quantity']?.toString() || '0') || 0), 0
        );
        const totalProceeds = orders.reduce((sum: number, order: any) =>
          sum + Math.abs(parseFloat(order['Proceeds']?.toString() || '0') || 0), 0
        );
        const totalPL = orders.reduce((sum: number, order: any) =>
          sum + (parseFloat(order['Realized P/L']?.toString() || '0') || 0), 0
        );
        const currency = orders[0]?.['Currency'] || 'EUR';

        return (
          <Card key={symbol} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ pb: '8px !important' }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ cursor: 'pointer', p: 1 }}
                onClick={() => handleToggleSection(`symbol-${symbol}`)}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {symbol}
                  </Typography>
                  <Chip
                    label={translateAssetCategory(orders[0]?.['Asset Category'] || '')}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={`${orders.length} Transaktionen`}
                    size="small"
                    variant="outlined"
                    color="secondary"
                  />
                </Box>

                <Box display="flex" alignItems="center" gap={3}>
                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">Menge</Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      {getQuantityIcon(totalQuantity)}
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatNumber(totalQuantity)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">Umsatz</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(totalProceeds, currency)}
                    </Typography>
                  </Box>

                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">P&L</Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                        color: getPLColor(totalPL)
                      }}
                    >
                      {formatCurrency(totalPL, currency)}
                    </Typography>
                  </Box>

                  <IconButton size="small">
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
              </Box>

              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Divider sx={{ my: 1 }} />
                {renderDetailedTable(orders, `Transaktionen für ${symbol}`)}
              </Collapse>
            </CardContent>
          </Card>
        );
      });
    };

    const renderDetailedTable = (data: any[], title?: string) => {
      if (data.length === 0) return (
        <Alert severity="info" sx={{ m: 2 }}>
          Keine Daten entsprechen den aktuellen Filterkriterien.
        </Alert>
      );

      // Define important columns that should be shown prominently
      const priorityColumns = [
        'Date/Time', 'Symbol', 'Quantity', 'T. Price', 'Proceeds',
        'Comm/Fee', 'Realized P/L', 'Code', 'Asset Category', 'Currency'
      ];

      const availableColumns = sectionData.headers.filter(header =>
        data.some(row => row[header] && row[header] !== '-' && row[header] !== '')
      );

      const displayColumns = priorityColumns.filter(col => availableColumns.includes(col))
        .concat(availableColumns.filter(col => !priorityColumns.includes(col)));

      return (
        <Box sx={{ mt: title ? 2 : 0 }}>
          {title && (
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              {title}
            </Typography>
          )}

          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
              maxHeight: 500,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {displayColumns.map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                        minWidth: getColumnWidth(header),
                        fontSize: '0.8rem'
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow
                    key={index}
                    hover
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                      '&:hover': { backgroundColor: 'action.selected' }
                    }}
                  >
                    {displayColumns.map((header) => {
                      const cellValue = row[header];
                      let formattedValue = cellValue || '-';

                      // Special formatting based on field type
                      if (header.toLowerCase().includes('date') || header.toLowerCase().includes('time')) {
                        formattedValue = formatDateTime(cellValue);
                      } else if (header.toLowerCase().includes('price') ||
                               header.toLowerCase().includes('proceeds') ||
                               header.toLowerCase().includes('comm') ||
                               header.toLowerCase().includes('fee') ||
                               header.toLowerCase().includes('basis') ||
                               header.toLowerCase().includes('p/l') ||
                               header.toLowerCase().includes('realized')) {
                        const currency = row['Currency'] || 'EUR';
                        formattedValue = formatCurrency(cellValue, currency);
                      } else if (header.toLowerCase().includes('quantity') ||
                               header.toLowerCase().includes('menge')) {
                        const quantity = parseFloat(cellValue?.toString() || '0');
                        formattedValue = (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            {getQuantityIcon(quantity)}
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 'medium',
                                color: quantity >= 0 ? 'success.main' : 'error.main'
                              }}
                            >
                              {formatNumber(cellValue)}
                            </Typography>
                          </Box>
                        );
                      } else if (header.toLowerCase() === 'code' && cellValue && cellValue !== '-') {
                        formattedValue = (
                          <Tooltip
                            title={`${cellValue} | ${getCodeDescription(cellValue)}`}
                            arrow
                            placement="top"
                          >
                            <Chip
                              label={translateTransactionCode(cellValue)}
                              size="small"
                              variant="outlined"
                              color="primary"
                              sx={{ cursor: 'help', fontSize: '0.7rem' }}
                            />
                          </Tooltip>
                        );
                      } else if ((header.toLowerCase() === 'asset category' ||
                                 header.toLowerCase() === 'assetklasse') && cellValue && cellValue !== '-') {
                        formattedValue = (
                          <Chip
                            label={translateAssetCategory(cellValue)}
                            size="small"
                            variant="outlined"
                            color="secondary"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        );
                      }

                      return (
                        <TableCell
                          key={header}
                          sx={{
                            maxWidth: '200px',
                            wordBreak: 'break-word',
                            fontSize: '0.8rem',
                            py: 1
                          }}
                        >
                          {formattedValue}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      );
    };

    const getColumnWidth = (header: string): string => {
      if (header.includes('Date') || header.includes('Time')) return '140px';
      if (header.includes('Symbol')) return '100px';
      if (header.includes('Code')) return '120px';
      if (header.includes('Price') || header.includes('Proceeds') || header.includes('P/L')) return '110px';
      return '90px';
    };

    const renderDataSection = (data: any[], title: string, sectionKey: string, defaultExpanded: boolean = false) => {
      if (data.length === 0) return null;

      const isExpanded = expandedSections.has(sectionKey);

      return (
        <Card sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ cursor: 'pointer' }}
              onClick={() => handleToggleSection(sectionKey)}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {title}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  label={`${data.length} Einträge`}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
                <IconButton size="small">
                  {isExpanded ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Box>
            </Box>

            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              {renderDetailedTable(data)}
            </Collapse>
          </CardContent>
        </Card>
      );
    };

    const renderCombinedView = () => {
      return Object.entries(groupedBySymbolAndCategory).map(([key, data]: [string, any]) => {
        const isExpanded = expandedSections.has(`combined-${key}`);

        return (
          <Card key={key} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ pb: '8px !important' }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ cursor: 'pointer', p: 1 }}
                onClick={() => handleToggleSection(`combined-${key}`)}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {data.symbol}
                  </Typography>
                  <Chip
                    label={translateAssetCategory(data.category)}
                    size="small"
                    color="secondary"
                    variant="filled"
                  />
                  <Chip
                    label={`${data.orders.length} Transaktionen`}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </Box>

                <Box display="flex" alignItems="center" gap={3}>
                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">Menge</Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      {getQuantityIcon(data.totalQuantity)}
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatNumber(data.totalQuantity)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">Umsatz</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(data.totalProceeds, data.currency)}
                    </Typography>
                  </Box>

                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">Gebühren</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                      {formatCurrency(data.totalCommission, data.currency)}
                    </Typography>
                  </Box>

                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">P&L</Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                        color: getPLColor(data.totalPL)
                      }}
                    >
                      {formatCurrency(data.totalPL, data.currency)}
                    </Typography>
                  </Box>

                  <IconButton size="small">
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
              </Box>

              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Divider sx={{ my: 1 }} />
                {renderDetailedTable(data.orders, `${data.symbol} - ${translateAssetCategory(data.category)}`)}
              </Collapse>
            </CardContent>
          </Card>
        );
      });
    };

    const renderCategoryView = () => {
      return Object.entries(groupedByCategory).map(([category, data]: [string, any]) => {
        const isExpanded = expandedSections.has(`category-${category}`);
        const symbolCount = data.symbols.size;
        const primaryCurrency = Array.from(data.currencies)[0] || 'EUR';

        return (
          <Card key={category} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ pb: '8px !important' }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ cursor: 'pointer', p: 1 }}
                onClick={() => handleToggleSection(`category-${category}`)}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                    {translateAssetCategory(category)}
                  </Typography>
                  <Chip
                    label={`${symbolCount} ${symbolCount === 1 ? 'Symbol' : 'Symbole'}`}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                  <Chip
                    label={`${data.orders.length} Transaktionen`}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </Box>

                <Box display="flex" alignItems="center" gap={3}>
                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">Gesamt Menge</Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      {getQuantityIcon(data.totalQuantity)}
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatNumber(data.totalQuantity)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">Gesamt Umsatz</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(data.totalProceeds, primaryCurrency)}
                    </Typography>
                  </Box>

                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">Gesamt Gebühren</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                      {formatCurrency(data.totalCommission, primaryCurrency)}
                    </Typography>
                  </Box>

                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">Gesamt P&L</Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                        color: getPLColor(data.totalPL)
                      }}
                    >
                      {formatCurrency(data.totalPL, primaryCurrency)}
                    </Typography>
                  </Box>

                  <IconButton size="small">
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
              </Box>

              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Enthaltene Symbole: {Array.from(data.symbols).join(', ')}
                  </Typography>
                </Box>
                {renderDetailedTable(data.orders, `Alle Transaktionen in ${translateAssetCategory(category)}`)}
              </Collapse>
            </CardContent>
          </Card>
        );
      });
    };

    return (
      <Box>
        {/* Header with controls */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Transaktionsübersicht
          </Typography>

          {/* Controls */}
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} sx={{ mb: 2 }}>
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <ButtonGroup variant="outlined" size="small">
                <Button
                  variant={viewMode === 'grouped' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('grouped')}
                  startIcon={<FilterList />}
                >
                  Nach Symbol
                </Button>
                <Button
                  variant={viewMode === 'combined' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('combined')}
                  startIcon={<FilterList />}
                >
                  Symbol + Kategorie
                </Button>
                <Button
                  variant={viewMode === 'category' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('category')}
                  startIcon={<FilterList />}
                >
                  Nach Kategorie
                </Button>
                <Button
                  variant={viewMode === 'detailed' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('detailed')}
                  startIcon={<Visibility />}
                >
                  Detailansicht
                </Button>
              </ButtonGroup>

              <TextField
                size="small"
                placeholder="Suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: '200px' }}
              />
            </Box>

            <Box display="flex" gap={2} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {filteredOrderData.length} von {orderData.length} Transaktionen
              </Typography>

              {uniqueSymbols.length > 0 && (
                <TextField
                  select
                  size="small"
                  label="Symbol Filter"
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  SelectProps={{ native: true }}
                  sx={{ minWidth: '120px' }}
                >
                  <option value="all">Alle Symbole</option>
                  {uniqueSymbols.map(symbol => (
                    <option key={symbol} value={symbol}>{symbol}</option>
                  ))}
                </TextField>
              )}
            </Box>
          </Box>
        </Box>

        {/* Main content */}
        {viewMode === 'grouped' ? (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Transaktionen nach Symbolen ({Object.keys(groupedOrders).length} Symbole)
            </Typography>
            {renderGroupedOrders()}
          </Box>
        ) : viewMode === 'combined' ? (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Kombinierte Ansicht ({Object.keys(groupedBySymbolAndCategory).length} Gruppen)
            </Typography>
            {renderCombinedView()}
          </Box>
        ) : viewMode === 'category' ? (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Transaktionen nach Kategorien ({Object.keys(groupedByCategory).length} Kategorien)
            </Typography>
            {renderCategoryView()}
          </Box>
        ) : (
          <Box>
            {/* Render different data types */}
            {renderDataSection(
              filteredOrderData,
              `Alle Transaktionsaufträge (${filteredOrderData.length})`,
              'orders',
              true
            )}

            {renderDataSection(
              subTotalData,
              `Zwischensummen (${subTotalData.length})`,
              'subtotals'
            )}

            {renderDataSection(
              totalData,
              `Gesamtsummen (${totalData.length})`,
              'totals'
            )}
          </Box>
        )}

        {/* Show all data if no specific types found */}
        {orderData.length === 0 && subTotalData.length === 0 && totalData.length === 0 && (
          renderDataSection(
            sectionData.dataRows,
            `Alle Transaktionsdaten (${sectionData.dataRows.length})`,
            'all-data',
            true
          )
        )}

        {/* Summary statistics */}
        <Card sx={{ mt: 3, backgroundColor: 'grey.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Zusammenfassung
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">Verfügbare Spalten:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {sectionData.headers.length}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">Transaktionen:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {orderData.length}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">Verschiedene Symbole:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {uniqueSymbols.length}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">Gesamt Datensätze:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {sectionData.dataRows.length}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    );

  } catch (error) {
    console.error('Error in TransactionsTable:', error);
    return (
      <Alert severity="error" sx={{ m: 2 }}>
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

export default TransactionsTable;
