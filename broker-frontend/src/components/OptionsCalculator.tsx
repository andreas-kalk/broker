import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  useTheme,
  alpha,
  Stack,
  Divider,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Calculate,
  TrendingUp,
  TrendingDown,
  Timeline,
  Assessment,
  Functions,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface OptionInputs {
  stockPrice: number;
  strikePrice: number;
  premium: number;
  daysToExpiration: number;
  volatility: number;
  riskFreeRate: number;
  optionType: 'call' | 'put';
  strategy: 'buy' | 'sell';
}

interface OptionResults {
  profitLoss: number;
  breakeven: number;
  maxProfit: number | string;
  maxLoss: number;
  profitProbability: number;
  greeks: {
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    rho: number;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`options-tabpanel-${index}`}
      aria-labelledby={`options-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const OptionsCalculator: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [inputs, setInputs] = useState<OptionInputs>({
    stockPrice: 100,
    strikePrice: 105,
    premium: 3.50,
    daysToExpiration: 30,
    volatility: 25,
    riskFreeRate: 5,
    optionType: 'call',
    strategy: 'buy'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Black-Scholes calculation functions
  const normalCDF = (x: number): number => {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x) / Math.sqrt(2.0);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return 0.5 * (1.0 + sign * y);
  };

  const blackScholes = useCallback((
    S: number, K: number, T: number, r: number, sigma: number, type: 'call' | 'put'
  ): { price: number; delta: number; gamma: number; theta: number; vega: number; rho: number } => {
    const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    const Nd1 = normalCDF(d1);
    const Nd2 = normalCDF(d2);
    const nd1 = Math.exp(-0.5 * d1 * d1) / Math.sqrt(2 * Math.PI);

    let price, delta, rho;

    if (type === 'call') {
      price = S * Nd1 - K * Math.exp(-r * T) * Nd2;
      delta = Nd1;
      rho = K * T * Math.exp(-r * T) * Nd2 / 100;
    } else {
      price = K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
      delta = Nd1 - 1;
      rho = -K * T * Math.exp(-r * T) * normalCDF(-d2) / 100;
    }

    const gamma = nd1 / (S * sigma * Math.sqrt(T));
    const theta = (-S * nd1 * sigma / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * Nd2) / 365;
    const vega = S * nd1 * Math.sqrt(T) / 100;

    return { price, delta, gamma, theta, vega, rho };
  }, []);

  const calculateResults = useMemo((): OptionResults | null => {
    const { stockPrice, strikePrice, premium, daysToExpiration, volatility, riskFreeRate, optionType, strategy } = inputs;

    if (!stockPrice || !strikePrice || !premium || !daysToExpiration) {
      return null;
    }

    const T = daysToExpiration / 365;
    const r = riskFreeRate / 100;
    const sigma = volatility / 100;

    const bs = blackScholes(stockPrice, strikePrice, T, r, sigma, optionType);

    let profitLoss: number;
    let breakeven: number;
    let maxProfit: number | string;
    let maxLoss: number;

    if (strategy === 'buy') {
      if (optionType === 'call') {
        profitLoss = Math.max(stockPrice - strikePrice, 0) - premium;
        breakeven = strikePrice + premium;
        maxProfit = "Unlimited";
        maxLoss = premium;
      } else {
        profitLoss = Math.max(strikePrice - stockPrice, 0) - premium;
        breakeven = strikePrice - premium;
        maxProfit = strikePrice - premium;
        maxLoss = premium;
      }
    } else {
      if (optionType === 'call') {
        profitLoss = premium - Math.max(stockPrice - strikePrice, 0);
        breakeven = strikePrice + premium;
        maxProfit = premium;
        maxLoss = -1; // Unlimited loss indicator
      } else {
        profitLoss = premium - Math.max(strikePrice - stockPrice, 0);
        breakeven = strikePrice - premium;
        maxProfit = premium;
        maxLoss = -(strikePrice - premium);
      }
    }

    // Simple probability estimation
    const profitProbability = optionType === 'call' 
      ? (strategy === 'buy' ? normalCDF((Math.log(stockPrice / breakeven)) / (sigma * Math.sqrt(T))) : 1 - normalCDF((Math.log(stockPrice / breakeven)) / (sigma * Math.sqrt(T))))
      : (strategy === 'buy' ? normalCDF((Math.log(breakeven / stockPrice)) / (sigma * Math.sqrt(T))) : 1 - normalCDF((Math.log(breakeven / stockPrice)) / (sigma * Math.sqrt(T))));

    return {
      profitLoss,
      breakeven,
      maxProfit,
      maxLoss,
      profitProbability: profitProbability * 100,
      greeks: {
        delta: bs.delta,
        gamma: bs.gamma,
        theta: bs.theta,
        vega: bs.vega,
        rho: bs.rho
      }
    };
  }, [inputs, blackScholes]);

  const validateInputs = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!inputs.stockPrice || inputs.stockPrice <= 0) {
      newErrors.stockPrice = t('options.inputValidation.stockPriceRequired');
    }
    if (!inputs.strikePrice || inputs.strikePrice <= 0) {
      newErrors.strikePrice = t('options.inputValidation.strikePriceRequired');
    }
    if (!inputs.premium || inputs.premium <= 0) {
      newErrors.premium = t('options.inputValidation.premiumRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [inputs, t]);

  const handleInputChange = (field: keyof OptionInputs, value: string | number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getRecommendation = (): { text: string; color: string; icon: React.ReactNode } => {
    if (!calculateResults) return { text: 'Enter valid inputs', color: theme.palette.grey[500], icon: <Warning /> };

    const result = calculateResults;
    const profitLoss = result.profitLoss;

    if (profitLoss > 0) {
      return { 
        text: 'Profitable at current price', 
        color: theme.palette.success.main, 
        icon: <CheckCircle /> 
      };
    } else if (profitLoss > -result.maxLoss * 0.5) {
      return { 
        text: 'Moderate risk position', 
        color: theme.palette.warning.main, 
        icon: <Warning /> 
      };
    } else {
      return { 
        text: 'High risk position', 
        color: theme.palette.error.main, 
        icon: <Warning /> 
      };
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          {t('options.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('options.description')}
        </Typography>
      </Box>

      {/* Tabs */}
      <Card elevation={2} sx={{ borderRadius: 3, mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
            <Tab icon={<Calculate />} label={t('options.tabs.calculator')} />
            <Tab icon={<Timeline />} label={t('options.tabs.scenarios')} />
            <Tab icon={<Assessment />} label={t('options.tabs.analysis')} />
          </Tabs>
        </Box>

        {/* Calculator Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={4}>
            {/* Input Section */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Option Parameters
                </Typography>

                <Grid container spacing={3}>
                  {/* Option Type */}
                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">{t('options.optionType')}</FormLabel>
                      <RadioGroup
                        row
                        value={inputs.optionType}
                        onChange={(e) => handleInputChange('optionType', e.target.value)}
                      >
                        <FormControlLabel value="call" control={<Radio />} label={t('options.call')} />
                        <FormControlLabel value="put" control={<Radio />} label={t('options.put')} />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {/* Strategy */}
                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">{t('options.strategy')}</FormLabel>
                      <RadioGroup
                        row
                        value={inputs.strategy}
                        onChange={(e) => handleInputChange('strategy', e.target.value)}
                      >
                        <FormControlLabel value="buy" control={<Radio />} label={t('options.buy')} />
                        <FormControlLabel value="sell" control={<Radio />} label={t('options.sell')} />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {/* Input Fields */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('options.stockPrice')}
                      type="number"
                      value={inputs.stockPrice}
                      onChange={(e) => handleInputChange('stockPrice', parseFloat(e.target.value) || 0)}
                      error={!!errors.stockPrice}
                      helperText={errors.stockPrice}
                      InputProps={{ startAdornment: '$' }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('options.strikePrice')}
                      type="number"
                      value={inputs.strikePrice}
                      onChange={(e) => handleInputChange('strikePrice', parseFloat(e.target.value) || 0)}
                      error={!!errors.strikePrice}
                      helperText={errors.strikePrice}
                      InputProps={{ startAdornment: '$' }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('options.premium')}
                      type="number"
                      value={inputs.premium}
                      onChange={(e) => handleInputChange('premium', parseFloat(e.target.value) || 0)}
                      error={!!errors.premium}
                      helperText={errors.premium}
                      InputProps={{ startAdornment: '$' }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('options.expiration')}
                      type="number"
                      value={inputs.daysToExpiration}
                      onChange={(e) => handleInputChange('daysToExpiration', parseInt(e.target.value) || 0)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('options.volatility')}
                      type="number"
                      value={inputs.volatility}
                      onChange={(e) => handleInputChange('volatility', parseFloat(e.target.value) || 0)}
                      InputProps={{ endAdornment: '%' }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('options.riskFreeRate')}
                      type="number"
                      value={inputs.riskFreeRate}
                      onChange={(e) => handleInputChange('riskFreeRate', parseFloat(e.target.value) || 0)}
                      InputProps={{ endAdornment: '%' }}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Results Section */}
            <Grid item xs={12} md={6}>
              {calculateResults ? (
                <Stack spacing={3}>
                  {/* Main Results Card */}
                  <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                      {t('options.results')}
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                          <Typography variant="caption" color="text.secondary">
                            {t('options.profitLoss')}
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', color: calculateResults.profitLoss >= 0 ? theme.palette.success.main : theme.palette.error.main }}>
                            ${calculateResults.profitLoss.toFixed(2)}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.secondary.main, 0.1) }}>
                          <Typography variant="caption" color="text.secondary">
                            {t('options.breakeven')}
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            ${calculateResults.breakeven.toFixed(2)}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                          <Typography variant="caption" color="text.secondary">
                            {t('options.maxProfit')}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {typeof calculateResults.maxProfit === 'string'
                              ? calculateResults.maxProfit
                              : `$${calculateResults.maxProfit.toFixed(2)}`
                            }
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.error.main, 0.1) }}>
                          <Typography variant="caption" color="text.secondary">
                            {t('options.maxLoss')}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {calculateResults.maxLoss === -1
                              ? 'Unlimited'
                              : `$${Math.abs(calculateResults.maxLoss).toFixed(2)}`
                            }
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        {t('options.probability')}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={calculateResults.profitProbability}
                          sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {calculateResults.profitProbability.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Card>

                  {/* Recommendation */}
                  <Alert
                    severity={calculateResults.profitLoss >= 0 ? 'success' : 'warning'}
                    icon={getRecommendation().icon}
                    sx={{ borderRadius: 2 }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {getRecommendation().text}
                    </Typography>
                  </Alert>
                </Stack>
              ) : (
                <Card variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                  <Functions sx={{ fontSize: 48, color: theme.palette.grey[400], mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Enter option parameters to see results
                  </Typography>
                </Card>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        {/* Scenarios Tab */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Price Scenarios Analysis
          </Typography>
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Scenario analysis will be implemented to show profit/loss at different stock prices and time points.
          </Alert>
        </TabPanel>

        {/* Analysis Tab */}
        <TabPanel value={activeTab} index={2}>
          {calculateResults && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                {t('options.greeks')}
              </Typography>

              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Greek</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{t('options.delta')}</TableCell>
                      <TableCell>{calculateResults.greeks.delta.toFixed(4)}</TableCell>
                      <TableCell>Price sensitivity to underlying</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('options.gamma')}</TableCell>
                      <TableCell>{calculateResults.greeks.gamma.toFixed(4)}</TableCell>
                      <TableCell>Delta sensitivity to underlying</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('options.theta')}</TableCell>
                      <TableCell>{calculateResults.greeks.theta.toFixed(4)}</TableCell>
                      <TableCell>Time decay per day</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('options.vega')}</TableCell>
                      <TableCell>{calculateResults.greeks.vega.toFixed(4)}</TableCell>
                      <TableCell>Volatility sensitivity</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('options.rho')}</TableCell>
                      <TableCell>{calculateResults.greeks.rho.toFixed(4)}</TableCell>
                      <TableCell>Interest rate sensitivity</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </TabPanel>
      </Card>
    </Box>
  );
};

export default OptionsCalculator;
