import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    InputAdornment,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import {Assessment, DateRange, Download, Public, Receipt, Search, TrendingDown, TrendingUp} from '@mui/icons-material';
import {taxService} from '../services/api';
import {CapitalGain, Dividend, ForeignTax, TaxRelevantData, TaxSummary} from '../types/tax';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: Readonly<TabPanelProps>) {
    const {children, value, index, ...other} = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tax-tabpanel-${index}`}
            aria-labelledby={`tax-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{p: 3}}>{children}</Box>}
        </div>
    );
}

const TaxAnalysis: React.FC = () => {
    const [taxData, setTaxData] = useState<TaxRelevantData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [taxYear, setTaxYear] = useState(2024);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTaxData();
    }, [taxYear]);

    const fetchTaxData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await taxService.getTaxRelevantData(taxYear);
            setTaxData(data);
        } catch (err) {
            setError('Fehler beim Laden der Steuerdaten: ' + (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
        // Fallback für null/undefined currency
        const safeCurrency = currency && currency.trim() ? currency : 'EUR';

        // Validiere, ob der Währungscode gültig ist
        const validCurrencies = ['EUR', 'USD', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SEK', 'NOK', 'DKK'];
        const currencyToUse = validCurrencies.includes(safeCurrency.toUpperCase()) ? safeCurrency.toUpperCase() : 'EUR';

        try {
            return new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: currencyToUse
            }).format(amount);
        } catch (error) {
            // Fallback ohne Währungsformatierung
            return `${amount.toLocaleString('de-DE', {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${currencyToUse}`;
        }
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('de-DE');
    };

    const getPLColor = (value: number) => {
        if (value > 0) return 'success.main';
        if (value < 0) return 'error.main';
        return 'text.primary';
    };

    const renderTaxSummary = (summary: TaxSummary) => (
        <Card sx={{mb: 3}}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{fontWeight: 'bold', mb: 3}}>
                    Steuerliche Zusammenfassung {taxYear}
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{p: 2, backgroundColor: 'rgba(46, 125, 50, 0.08)', border: '1px solid #2e7d32'}}>
                            <Box display="flex" alignItems="center" mb={1}>
                                <TrendingUp sx={{mr: 1, color: 'success.main'}}/>
                                <Typography variant="subtitle2" color="success.main" fontWeight="bold">
                                    Kapitalgewinne
                                </Typography>
                            </Box>
                            <Typography variant="h5" sx={{fontWeight: 'bold', color: 'success.main'}}>
                                {formatCurrency(summary.totalCapitalGains)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Realisierte Gewinne
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper sx={{p: 2, backgroundColor: 'rgba(211, 47, 47, 0.08)', border: '1px solid #d32f2f'}}>
                            <Box display="flex" alignItems="center" mb={1}>
                                <TrendingDown sx={{mr: 1, color: 'error.main'}}/>
                                <Typography variant="subtitle2" color="error.main" fontWeight="bold">
                                    Kapitalverluste
                                </Typography>
                            </Box>
                            <Typography variant="h5" sx={{fontWeight: 'bold', color: 'error.main'}}>
                                {formatCurrency(summary.totalCapitalLosses)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Realisierte Verluste
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{p: 2, backgroundColor: 'rgba(74, 20, 140, 0.08)', border: '1px solid #6a1b9a'}}>
                            <Box display="flex" alignItems="center" mb={1}>
                                <Assessment sx={{mr: 1, color: 'primary.main'}}/>
                                <Typography variant="subtitle2" color="primary.main" fontWeight="bold">
                                    Netto-Kapitalertrag
                                </Typography>
                            </Box>
                            <Typography variant="h6" sx={{fontWeight: 'bold', color: getPLColor(summary.netCapitalGains)}}>
                                {formatCurrency(summary.netCapitalGains)}
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{p: 2, backgroundColor: 'rgba(56, 142, 60, 0.08)', border: '1px solid #388e3c'}}>
                            <Box display="flex" alignItems="center" mb={1}>
                                <Receipt sx={{mr: 1, color: 'secondary.main'}}/>
                                <Typography variant="subtitle2" color="secondary.main" fontWeight="bold">
                                    Dividenden
                                </Typography>
                            </Box>
                            <Typography variant="h6" sx={{fontWeight: 'bold', color: 'secondary.main'}}>
                                {formatCurrency(summary.totalDividends)}
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{p: 2, backgroundColor: 'rgba(245, 124, 0, 0.08)', border: '1px solid #f57c00'}}>
                            <Box display="flex" alignItems="center" mb={1}>
                                <Public sx={{mr: 1, color: 'warning.main'}}/>
                                <Typography variant="subtitle2" color="warning.main" fontWeight="bold">
                                    Quellensteuer
                                </Typography>
                            </Box>
                            <Typography variant="h6" sx={{fontWeight: 'bold', color: 'warning.main'}}>
                                {formatCurrency(summary.totalWithholdingTax)}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Divider sx={{my: 3}}/>

                <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Gesamte Transaktionen:</Typography>
                        <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                            {summary.numberOfTransactions}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Gesamte Gebühren:</Typography>
                        <Typography variant="h6" sx={{fontWeight: 'bold', color: 'error.main'}}>
                            {formatCurrency(summary.totalCommissions)}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Ausländische Steuern:</Typography>
                        <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                            {formatCurrency(summary.totalForeignTax)}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Steuerjahr:</Typography>
                        <Typography variant="h6" sx={{fontWeight: 'bold', color: 'primary.main'}}>
                            {taxYear}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );

    const renderCapitalGainsTable = (capitalGains: CapitalGain[]) => {
        const filteredGains = capitalGains.filter(gain =>
            gain.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            gain.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                        Kapitalerträge ({filteredGains.length} von {capitalGains.length})
                    </Typography>
                    <TextField
                        size="small"
                        placeholder="Symbol oder Beschreibung suchen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="small"/>
                                </InputAdornment>
                            ),
                        }}
                        sx={{minWidth: '250px'}}
                    />
                </Box>

                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight: 'bold'}}>Symbol</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Kategorie</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Kauf</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Verkauf</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Menge</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Gewinn/Verlust</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Gebühren</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Haltedauer</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredGains.map((gain, index) => (
                                <TableRow key={index} hover>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                                                {gain.symbol}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {gain.description}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={gain.assetCategory}
                                            size="small"
                                            variant="outlined"
                                            color="secondary"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {formatDate(gain.purchaseDate)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatCurrency(gain.purchasePrice, gain.currency)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {formatDate(gain.saleDate)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatCurrency(gain.salePrice, gain.currency)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{fontWeight: 'medium'}}>
                                            {gain.quantity.toLocaleString('de-DE')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                            {gain.realizedGain > 0 ?
                                                <TrendingUp color="success" fontSize="small"/> :
                                                <TrendingDown color="error" fontSize="small"/>}

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: getPLColor(gain.realizedGain)
                                                }}
                                            >
                                                {formatCurrency(gain.realizedGain, gain.currency)}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="error.main">
                                            {formatCurrency(gain.commission, gain.currency)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={gain.shortTerm ? 'Kurzfristig' : 'Langfristig'}
                                            size="small"
                                            color={gain.shortTerm ? 'warning' : 'success'}
                                            variant="filled"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    };

    const renderDividendsTable = (dividends: Dividend[]) => (
        <Box>
            <Typography variant="h6" gutterBottom sx={{fontWeight: 'bold'}}>
                Dividenden ({dividends.length})
            </Typography>

            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{fontWeight: 'bold'}}>Symbol</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Zahldatum</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Bruttobetrag</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Quellensteuer</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Nettobetrag</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dividends.map((dividend, index) => (
                            <TableRow key={index} hover>
                                <TableCell>
                                    <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                                        {dividend.symbol}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {dividend.description}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {formatDate(dividend.paymentDate)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{fontWeight: 'medium'}}>
                                        {formatCurrency(dividend.grossAmount, dividend.currency)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="warning.main">
                                        {formatCurrency(dividend.withholdingTax, dividend.currency)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{fontWeight: 'bold', color: 'success.main'}}>
                                        {formatCurrency(dividend.netAmount, dividend.currency)}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const renderForeignTaxes = (foreignTaxes: ForeignTax[]) => (
        <Box>
            <Typography variant="h6" gutterBottom sx={{fontWeight: 'bold'}}>
                Ausländische Steuern ({foreignTaxes.length})
            </Typography>

            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{fontWeight: 'bold'}}>Land</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Datum</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Betrag</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Referenz</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {foreignTaxes.map((tax, index) => (
                            <TableRow key={index} hover>
                                <TableCell>
                                    <Chip
                                        label={tax.country}
                                        size="small"
                                        variant="outlined"
                                        color="info"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {formatDate(tax.date)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{fontWeight: 'medium'}}>
                                        {formatCurrency(tax.amount, tax.currency)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {tax.reference}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress/>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{m: 2}}>
                {error}
            </Alert>
        );
    }

    if (!taxData) {
        return (
            <Alert severity="info" sx={{m: 2}}>
                Keine Steuerdaten verfügbar. Bitte laden Sie zuerst eine CSV-Datei hoch.
            </Alert>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1" sx={{fontWeight: 'bold'}}>
                    Steueranalyse
                </Typography>
                <Box display="flex" gap={2} alignItems="center">
                    <TextField
                        size="small"
                        type="number"
                        label="Steuerjahr"
                        value={taxYear}
                        onChange={(e) => setTaxYear(parseInt(e.target.value))}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <DateRange fontSize="small"/>
                                </InputAdornment>
                            ),
                        }}
                        sx={{width: 120}}
                    />
                    <Button
                        variant="outlined"
                        startIcon={<Download/>}
                        onClick={() => {/* TODO: Implement export */
                        }}
                    >
                        Export
                    </Button>
                </Box>
            </Box>

            {/* Account Info */}
            <Card sx={{mb: 3}}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">Steuerpflichtiger:</Typography>
                            <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                                {taxData.taxpayerId || 'Nicht verfügbar'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">Kontonummer:</Typography>
                            <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                                {taxData.accountNumber || 'Nicht verfügbar'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">Broker:</Typography>
                            <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                                {taxData.brokerName || 'Nicht verfügbar'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">Steuerjahr:</Typography>
                            <Typography variant="body1" sx={{fontWeight: 'bold', color: 'primary.main'}}>
                                {taxData.taxYear}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Summary */}
            {renderTaxSummary(taxData.summary)}

            {/* Detailed Data Tabs */}
            <Card>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth">
                        <Tab
                            label={
                                <Box sx={{textAlign: 'center'}}>
                                    <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                                        Kapitalerträge
                                    </Typography>
                                    <Chip
                                        label={taxData.capitalGains.length}
                                        size="small"
                                        variant="outlined"
                                        sx={{mt: 0.5}}
                                    />
                                </Box>
                            }
                            icon={<TrendingUp/>}
                        />
                        <Tab
                            label={
                                <Box sx={{textAlign: 'center'}}>
                                    <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                                        Dividenden
                                    </Typography>
                                    <Chip
                                        label={taxData.dividends.length}
                                        size="small"
                                        variant="outlined"
                                        sx={{mt: 0.5}}
                                    />
                                </Box>
                            }
                            icon={<Receipt/>}
                        />
                        <Tab
                            label={
                                <Box sx={{textAlign: 'center'}}>
                                    <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                                        Ausländische Steuern
                                    </Typography>
                                    <Chip
                                        label={taxData.foreignTaxes.length}
                                        size="small"
                                        variant="outlined"
                                        sx={{mt: 0.5}}
                                    />
                                </Box>
                            }
                            icon={<Public/>}
                        />
                    </Tabs>
                </Box>

                <TabPanel value={selectedTab} index={0}>
                    {renderCapitalGainsTable(taxData.capitalGains)}
                </TabPanel>

                <TabPanel value={selectedTab} index={1}>
                    {renderDividendsTable(taxData.dividends)}
                </TabPanel>

                <TabPanel value={selectedTab} index={2}>
                    {renderForeignTaxes(taxData.foreignTaxes)}
                </TabPanel>
            </Card>
        </Box>
    );
};

export default TaxAnalysis;
