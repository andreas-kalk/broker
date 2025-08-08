import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import {
  TableChart,
  DataArray,
  TrendingUp,
  AccountBalance
} from '@mui/icons-material';

interface QuickStatsCardsProps {
  summary: any;
}

const QuickStatsCards: React.FC<QuickStatsCardsProps> = ({ summary }) => {
  const theme = useTheme();

  const stats = [
    {
      title: 'Datensektionen',
      value: summary?.sectionCount || 0,
      icon: <TableChart />,
      color: theme.palette.primary.main,
      trend: '+100%'
    },
    {
      title: 'Gesamte Datensätze',
      value: summary?.totalDataRows || 0,
      icon: <DataArray />,
      color: theme.palette.success.main,
      trend: 'Vollständig'
    },
    {
      title: 'Steuerrelevant',
      value: 'Bereit',
      icon: <TrendingUp />,
      color: theme.palette.warning.main,
      trend: 'KAP-Export'
    },
    {
      title: 'Status',
      value: 'Aktiv',
      icon: <AccountBalance />,
      color: theme.palette.info.main,
      trend: 'Analysiert'
    }
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              height: '100%',
              background: `linear-gradient(135deg, ${alpha(stat.color, 0.05)} 0%, ${alpha(stat.color, 0.1)} 100%)`,
              border: `1px solid ${alpha(stat.color, 0.2)}`,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 40px ${alpha(stat.color, 0.2)}`
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: alpha(stat.color, 0.1),
                    color: stat.color,
                    width: 48,
                    height: 48
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography
                  variant="caption"
                  sx={{
                    color: stat.color,
                    fontWeight: 'bold',
                    bgcolor: alpha(stat.color, 0.1),
                    px: 1,
                    py: 0.5,
                    borderRadius: 1
                  }}
                >
                  {stat.trend}
                </Typography>
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {stat.value}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default QuickStatsCards;
