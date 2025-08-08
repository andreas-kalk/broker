import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Chip,
  useTheme,
  alpha,
  Stack,
  Divider
} from '@mui/material';
import {
  PieChart,
  BarChart,
  TrendingUp,
  Assessment
} from '@mui/icons-material';

interface PortfolioOverviewProps {
  sections: Record<string, any> | null;
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ sections }) => {
  const theme = useTheme();

  if (!sections) {
    return null;
  }

  // Analyze portfolio data
  const portfolioStats = analyzePortfolioData(sections);

  return (
    <Stack spacing={3}>
      {/* Portfolio Summary Card */}
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <PieChart sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Portfolio Übersicht
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {portfolioStats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: alpha(stat.color, 0.1),
                    border: `1px solid ${alpha(stat.color, 0.2)}`,
                    textAlign: 'center'
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      color: stat.color,
                      mb: 1
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                  {stat.trend && (
                    <Chip
                      label={stat.trend}
                      size="small"
                      sx={{
                        mt: 1,
                        bgcolor: alpha(stat.color, 0.1),
                        color: stat.color,
                        fontSize: '0.7rem'
                      }}
                    />
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Data Distribution Card */}
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <BarChart sx={{ color: theme.palette.secondary.main, fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Datenverteilung
            </Typography>
          </Box>

          <Stack spacing={2}>
            {Object.entries(sections).slice(0, 8).map(([sectionName, sectionData]) => {
              const dataCount = sectionData.dataRows?.length || 0;
              const maxCount = Math.max(...Object.values(sections).map((s: any) => s.dataRows?.length || 0));
              const percentage = maxCount > 0 ? (dataCount / maxCount) * 100 : 0;
              const color = getSectionColor(sectionName, theme);

              return (
                <Box key={sectionName}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {sectionName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dataCount} Einträge
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: alpha(color, 0.1),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: color,
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

// Helper function to analyze portfolio data
const analyzePortfolioData = (sections: Record<string, any>) => {
  const totalEntries = Object.values(sections).reduce((sum, section: any) =>
    sum + (section.dataRows?.length || 0), 0
  );

  const sectionCount = Object.keys(sections).length;

  const tradesSections = Object.entries(sections).filter(([name]) =>
    name.toLowerCase().includes('trade') || name.toLowerCase().includes('transak')
  );

  const dividendsSections = Object.entries(sections).filter(([name]) =>
    name.toLowerCase().includes('dividend')
  );

  return [
    {
      value: totalEntries.toLocaleString(),
      label: 'Gesamte Einträge',
      color: '#1976d2',
      trend: 'Vollständig'
    },
    {
      value: sectionCount,
      label: 'Datensektionen',
      color: '#2e7d32',
      trend: 'Strukturiert'
    },
    {
      value: tradesSections.length,
      label: 'Handel-Sektionen',
      color: '#ed6c02',
      trend: 'Analysiert'
    },
    {
      value: dividendsSections.length,
      label: 'Dividenden-Sektionen',
      color: '#9c27b0',
      trend: 'Steuerrelevant'
    }
  ];
};

const getSectionColor = (sectionName: string, theme: any) => {
  const name = sectionName.toLowerCase();
  if (name.includes('dividend')) return theme.palette.success.main;
  if (name.includes('trade') || name.includes('transak')) return theme.palette.primary.main;
  if (name.includes('performance')) return theme.palette.warning.main;
  if (name.includes('cash') || name.includes('konto')) return theme.palette.info.main;
  return theme.palette.secondary.main;
};

export default PortfolioOverview;
