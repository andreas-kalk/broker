import React, {useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    Grid,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import {Category, Code, ExpandMore, Info, Search} from '@mui/icons-material';
import {assetCategories, getCodeDescription, transactionCodes} from '../utils/codeMapping';

const CodesHelp: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter codes based on search term
    const filteredTransactionCodes = Object.entries(transactionCodes).filter(([code, description]) =>
        code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredAssetCategories = Object.entries(assetCategories).filter(([code, description]) =>
        code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Common code combinations examples
    const commonCombinations = [
        {code: 'A;O', meaning: 'Auftrag Eröffnung', description: 'Eine neue Position wird eröffnet'},
        {code: 'C;IM;P', meaning: 'Schließung durch interne Bewegung (teilweise)', description: 'Teilweise Schließung einer Position'},
        {code: 'A;C', meaning: 'Auftrag Schließung', description: 'Eine bestehende Position wird geschlossen'},
        {code: 'E', meaning: 'Ausübung', description: 'Option oder Warrant wird ausgeübt'},
        {code: 'Ex', meaning: 'Verfallen', description: 'Option oder Derivat verfällt wertlos'},
        {code: 'DIV', meaning: 'Dividende', description: 'Dividendenzahlung erhalten'},
        {code: 'SPLIT', meaning: 'Aktiensplit', description: 'Aktien wurden geteilt (z.B. 2:1)'}
    ];

    return (
        <Box>
            <Box display="flex" alignItems="center" mb={3}>
                <Code sx={{mr: 2, color: 'primary.main'}}/>
                <Typography variant="h5" sx={{fontWeight: 'bold', color: 'primary.main'}}>
                    Codes & Kategorien Referenz
                </Typography>
            </Box>

            {/* Search Bar */}
            <Box mb={3}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Suchen Sie nach Codes oder Beschreibungen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize="small"/>
                            </InputAdornment>
                        ),
                    }}
                    sx={{maxWidth: '500px'}}
                />
            </Box>

            {/* Overview Alert */}
            <Alert severity="info" sx={{mb: 3}}>
                <Typography variant="body2">
                    Diese Referenz erklärt alle Transaktionscodes und Vermögenswertkategorien, die in Ihren Broker-Daten erscheinen können.
                    Codes können einzeln oder in Kombinationen (getrennt durch Semikolons) auftreten.
                </Typography>
            </Alert>

            {/* Common Code Combinations */}
            <Accordion defaultExpanded sx={{mb: 3}}>
                <AccordionSummary expandIcon={<ExpandMore/>}>
                    <Box display="flex" alignItems="center">
                        <Info sx={{mr: 1, color: 'primary.main'}}/>
                        <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                            Häufige Code-Kombinationen
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        {commonCombinations.map((combo, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        height: '100%',
                                        backgroundColor: 'rgba(25, 118, 210, 0.05)',
                                        border: '1px solid',
                                        borderColor: 'rgba(25, 118, 210, 0.2)'
                                    }}
                                >
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Chip
                                            label={combo.code}
                                            size="small"
                                            color="primary"
                                            variant="filled"
                                            sx={{fontFamily: 'monospace', fontWeight: 'bold'}}
                                        />
                                    </Box>
                                    <Typography variant="subtitle2" sx={{fontWeight: 'bold', mb: 0.5}}>
                                        {combo.meaning}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {combo.description}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </AccordionDetails>
            </Accordion>

            {/* Transaction Codes */}
            <Accordion defaultExpanded sx={{mb: 3}}>
                <AccordionSummary expandIcon={<ExpandMore/>}>
                    <Box display="flex" alignItems="center">
                        <Code sx={{mr: 1, color: 'secondary.main'}}/>
                        <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                            Transaktionscodes ({filteredTransactionCodes.length} von {Object.keys(transactionCodes).length})
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{fontWeight: 'bold', backgroundColor: 'secondary.light', color: 'white'}}>
                                        Code
                                    </TableCell>
                                    <TableCell sx={{fontWeight: 'bold', backgroundColor: 'secondary.light', color: 'white'}}>
                                        Bedeutung
                                    </TableCell>
                                    <TableCell sx={{fontWeight: 'bold', backgroundColor: 'secondary.light', color: 'white'}}>
                                        Beispiel
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredTransactionCodes.map(([code, description]) => (
                                    <TableRow key={code} hover>
                                        <TableCell>
                                            <Chip
                                                label={code}
                                                size="small"
                                                variant="outlined"
                                                color="secondary"
                                                sx={{fontFamily: 'monospace', fontWeight: 'bold'}}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{fontWeight: 'medium'}}>
                                                {description}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {getCodeDescription(code)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {filteredTransactionCodes.length === 0 && searchTerm && (
                        <Box textAlign="center" py={3}>
                            <Typography variant="body2" color="text.secondary">
                                Keine Transaktionscodes gefunden für "{searchTerm}"
                            </Typography>
                        </Box>
                    )}
                </AccordionDetails>
            </Accordion>

            {/* Asset Categories */}
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore/>}>
                    <Box display="flex" alignItems="center">
                        <Category sx={{mr: 1, color: 'info.main'}}/>
                        <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                            Vermögenswertkategorien ({filteredAssetCategories.length} von {Object.keys(assetCategories).length})
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{fontWeight: 'bold', backgroundColor: 'info.light', color: 'white'}}>
                                        Originalkategorie (EN)
                                    </TableCell>
                                    <TableCell sx={{fontWeight: 'bold', backgroundColor: 'info.light', color: 'white'}}>
                                        Deutsche Übersetzung
                                    </TableCell>
                                    <TableCell sx={{fontWeight: 'bold', backgroundColor: 'info.light', color: 'white'}}>
                                        Beschreibung
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredAssetCategories.map(([originalCategory, germanTranslation]) => (
                                    <TableRow key={originalCategory} hover>
                                        <TableCell>
                                            <Chip
                                                label={originalCategory}
                                                size="small"
                                                variant="outlined"
                                                color="info"
                                                sx={{fontWeight: 'medium'}}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                                                {germanTranslation}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {getAssetCategoryDescription(originalCategory)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {filteredAssetCategories.length === 0 && searchTerm && (
                        <Box textAlign="center" py={3}>
                            <Typography variant="body2" color="text.secondary">
                                Keine Vermögenswertkategorien gefunden für "{searchTerm}"
                            </Typography>
                        </Box>
                    )}
                </AccordionDetails>
            </Accordion>

            {/* Usage Examples */}
            <Card sx={{mt: 3, backgroundColor: 'grey.50'}}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{fontWeight: 'bold'}}>
                        Verwendungshinweise
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" sx={{fontWeight: 'bold', mb: 1}}>
                                Code-Kombinationen verstehen:
                            </Typography>
                            <Typography variant="body2" paragraph>
                                • Codes werden durch Semikolons (;) getrennt<br/>
                                • Beispiel: "A;O" = Auftrag + Eröffnung<br/>
                                • "C;IM;P" = Schließung + Interne Bewegung + Teilweise
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" sx={{fontWeight: 'bold', mb: 1}}>
                                In den Transaktionen:
                            </Typography>
                            <Typography variant="body2" paragraph>
                                • Codes erscheinen in der "Code" Spalte<br/>
                                • Kategorien in der "Asset Category" Spalte<br/>
                                • Hover über Chips zeigt Details an
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

// Helper function to get asset category descriptions
const getAssetCategoryDescription = (category: string): string => {
    const descriptions: { [key: string]: string } = {
        'Stocks': 'Unternehmensanteile und Aktien',
        'Equity and Index Options': 'Optionen auf Aktien und Marktindizes',
        'Options': 'Derivate mit Optionscharakter',
        'Forex': 'Währungspaare und Devisenhandel',
        'Futures': 'Terminkontrakte auf verschiedene Basiswerte',
        'Bonds': 'Festverzinsliche Wertpapiere',
        'Cash': 'Bargeld und Geldmarktinstrumente',
        'Commodities': 'Rohstoffe wie Gold, Öl, Weizen',
        'ETF': 'Exchange Traded Funds (börsengehandelte Fonds)',
        'Mutual Fund': 'Aktiv gemanagte Investmentfonds',
        'Cryptocurrency': 'Digitale Währungen wie Bitcoin, Ethereum'
    };
    return descriptions[category] || 'Keine weitere Beschreibung verfügbar';
};

export default CodesHelp;
