import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    IconButton,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Stack,
    Divider,
    LinearProgress,
    Tooltip,
    useTheme,
    alpha
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    ExpandMore,
    ExpandLess,
    AccountBalance,
    ShowChart,
    Euro,
    Assessment,
    Paid,
    Timeline,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { portfolioService } from '../services/api';
import { Portfolio, Position, PortfolioSummary } from '../types/api';

const PortfolioPage: React.FC = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [summary, setSummary] = useState<PortfolioSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedPosition, setExpandedPosition] = useState<string | null>(null);

    useEffect(() => {
        loadPortfolioData();
    }, []);

    const loadPortfolioData = async () => {
        try {
            setLoading(true);
            const [portfolioData, summaryData] = await Promise.all([
                portfolioService.getPortfolio(),
                portfolioService.getPortfolioSummary()
            ]);
            setPortfolio(portfolioData);
            setSummary(summaryData);
            setError(null);
        } catch (err) {
            setError('Failed to load portfolio data');
            console.error('Portfolio loading error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number, currency = 'EUR') => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    const formatPercent = (value: number) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);
    };

    const getPnLColor = (value: number) => {
        if (value > 0) return theme.palette.success.main;
        if (value < 0) return theme.palette.error.main;
        return theme.palette.text.secondary;
    };

    const getPnLIcon = (value: number) => {
        return value >= 0 ? <TrendingUp /> : <TrendingDown />;
    };

    if (loading) {
        return (
            <Box sx={{ p: 4 }}>
                <LinearProgress sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                    {t('common.loading')}...
                </Typography>
            </Box>
        );
    }

    if (error || !portfolio || !summary) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h6" color="error">
                    {error || 'No portfolio data available'}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                    Portfolio Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Complete view of your investment portfolio
                </Typography>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)` }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar sx={{ bgcolor: alpha(theme.palette.common.white, 0.2) }}>
                                    <AccountBalance />
                                </Avatar>
                                <Box sx={{ color: 'white' }}>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {formatCurrency(summary.totalMarketValue)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Total Market Value
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar sx={{ bgcolor: alpha(getPnLColor(summary.totalUnrealizedPnL), 0.1) }}>
                                    {getPnLIcon(summary.totalUnrealizedPnL)}
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: getPnLColor(summary.totalUnrealizedPnL) }}>
                                        {formatCurrency(summary.totalUnrealizedPnL)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Unrealized P&L
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar sx={{ bgcolor: alpha(getPnLColor(summary.totalRealizedPnL), 0.1) }}>
                                    <Assessment sx={{ color: getPnLColor(summary.totalRealizedPnL) }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: getPnLColor(summary.totalRealizedPnL) }}>
                                        {formatCurrency(summary.totalRealizedPnL)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Realized P&L
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                                    <Paid sx={{ color: theme.palette.success.main }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                                        {formatCurrency(summary.totalDividends)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Dividends
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Portfolio Stats */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Portfolio Statistics
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Stack spacing={1}>
                                <Typography variant="body2" color="text.secondary">
                                    Total Positions
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                                    {summary.totalPositions}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack spacing={1}>
                                <Typography variant="body2" color="text.secondary">
                                    Base Currency
                                </Typography>
                                <Chip 
                                    label={summary.baseCurrency} 
                                    variant="outlined" 
                                    size="medium"
                                    sx={{ width: 'fit-content' }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack spacing={1}>
                                <Typography variant="body2" color="text.secondary">
                                    Report Date
                                </Typography>
                                <Typography variant="body1">
                                    {new Date(summary.reportDate).toLocaleDateString('de-DE')}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Positions Table */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Holdings
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Position</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Market Price</TableCell>
                                    <TableCell align="right">Market Value</TableCell>
                                    <TableCell align="right">Unrealized P&L</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {portfolio.positions.map((position) => (
                                    <React.Fragment key={position.symbol}>
                                        <TableRow hover>
                                            <TableCell>
                                                <Stack spacing={1}>
                                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                        {position.symbol}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {position.description}
                                                    </Typography>
                                                    <Chip 
                                                        label={position.assetCategory} 
                                                        size="small" 
                                                        variant="outlined"
                                                    />
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body1">
                                                    {position.quantity.toLocaleString('de-DE')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body1">
                                                    {formatCurrency(position.marketPrice, position.currency)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                    {formatCurrency(position.marketValue, position.currency)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
                                                    {getPnLIcon(position.unrealizedPnL)}
                                                    <Typography 
                                                        variant="body1" 
                                                        sx={{ 
                                                            fontWeight: 600,
                                                            color: getPnLColor(position.unrealizedPnL)
                                                        }}
                                                    >
                                                        {formatCurrency(position.unrealizedPnL, position.currency)}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setExpandedPosition(
                                                        expandedPosition === position.symbol ? null : position.symbol
                                                    )}
                                                >
                                                    {expandedPosition === position.symbol ? <ExpandLess /> : <ExpandMore />}
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                        
                                        {/* Expanded row with transaction and dividend details */}
                                        <TableRow>
                                            <TableCell colSpan={6} sx={{ p: 0 }}>
                                                <Collapse in={expandedPosition === position.symbol}>
                                                    <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                                                    Recent Transactions ({position.transactions.length})
                                                                </Typography>
                                                                {position.transactions.slice(0, 3).map((transaction, idx) => (
                                                                    <Box key={idx} sx={{ mb: 1 }}>
                                                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                                <Chip 
                                                                                    label={transaction.action} 
                                                                                    size="small"
                                                                                    color={transaction.action === 'BOT' ? 'success' : 'error'}
                                                                                />
                                                                                <Typography variant="body2">
                                                                                    {transaction.quantity} @ {formatCurrency(transaction.price)}
                                                                                </Typography>
                                                                            </Stack>
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                {new Date(transaction.dateTime).toLocaleDateString('de-DE')}
                                                                            </Typography>
                                                                        </Stack>
                                                                    </Box>
                                                                ))}
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                                                    Dividends ({position.dividends.length})
                                                                </Typography>
                                                                {position.dividends.slice(0, 3).map((dividend, idx) => (
                                                                    <Box key={idx} sx={{ mb: 1 }}>
                                                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                                            <Typography variant="body2" sx={{ color: theme.palette.success.main }}>
                                                                                {formatCurrency(dividend.netAmount, dividend.currency)}
                                                                            </Typography>
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                {new Date(dividend.payDate).toLocaleDateString('de-DE')}
                                                                            </Typography>
                                                                        </Stack>
                                                                    </Box>
                                                                ))}
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
};

export default PortfolioPage;
