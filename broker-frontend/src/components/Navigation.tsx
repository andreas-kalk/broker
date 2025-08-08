import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Assessment, Home, AccountBalance } from '@mui/icons-material';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Assessment sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Broker Report Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            variant={location.pathname === '/' ? 'outlined' : 'text'}
            startIcon={<Home />}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/tax-analysis')}
            variant={location.pathname === '/tax-analysis' ? 'outlined' : 'text'}
            startIcon={<AccountBalance />}
          >
            Steueranalyse
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
