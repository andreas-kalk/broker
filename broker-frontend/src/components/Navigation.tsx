import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment as TaxIcon,
  Help as HelpIcon,
  TableChart as DataIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const navItems = [
    {
      label: 'Dashboard',
      path: '/',
      icon: <DashboardIcon />,
      description: 'Übersicht'
    },
    {
      label: 'Steueranalyse',
      path: '/tax-analysis',
      icon: <TaxIcon />,
      description: 'KAP-Formular'
    },
    {
      label: 'Datenansicht',
      path: '/data-explorer',
      icon: <DataIcon />,
      description: 'Alle Sektionen'
    },
    {
      label: 'Codes & Hilfe',
      path: '/help',
      icon: <HelpIcon />,
      description: 'Dokumentation'
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ px: { xs: 0 } }}>
          <Box
            display="flex"
            alignItems="center"
            sx={{ mr: 4, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <TrendingUpIcon
              sx={{
                mr: 1,
                fontSize: 28,
                color: theme.palette.primary.main
              }}
            />
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 'bold',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Broker Analyzer
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box display="flex" gap={1}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                startIcon={item.icon}
                sx={{
                  minWidth: 'auto',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: isActive(item.path) ? 'bold' : 'medium',
                  color: isActive(item.path)
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                  backgroundColor: isActive(item.path)
                    ? alpha(theme.palette.primary.main, 0.1)
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                  flexDirection: 'column',
                  gap: 0.5,
                  minHeight: 60
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>
                  {item.label}
                </Typography>
                <Chip
                  label={item.description}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 16,
                    fontSize: '0.65rem',
                    '& .MuiChip-label': { px: 0.5 }
                  }}
                />
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
