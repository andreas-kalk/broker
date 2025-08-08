import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  alpha,
  Avatar,
  Tooltip,
  Divider,
  Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment as TaxIcon,
  Help as HelpIcon,
  TableChart as DataIcon,
  TrendingUp as TrendingUpIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      label: t('nav.dashboard'),
      path: '/',
      icon: <DashboardIcon />,
      description: 'Overview',
      color: theme.palette.primary.main
    },
    {
      label: t('nav.taxAnalysis'),
      path: '/tax-analysis',
      icon: <TaxIcon />,
      description: 'KAP Form',
      color: theme.palette.success.main
    },
    {
      label: t('nav.dataExplorer'),
      path: '/data-explorer',
      icon: <DataIcon />,
      description: 'All Data',
      color: theme.palette.info.main
    },
    {
      label: t('nav.help'),
      path: '/help',
      icon: <HelpIcon />,
      description: 'Documentation',
      color: theme.palette.warning.main
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Mobile Drawer Content
  const drawer = (
    <Box sx={{ width: 280, height: '100%', bgcolor: 'background.paper' }}>
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  mr: 2,
                  width: 40,
                  height: 40
                }}
              >
                <TrendingUpIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {t('nav.brandName')}
              </Typography>
            </Box>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Professional Broker Data Analysis
          </Typography>
        </Box>
        
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: alpha('#fff', 0.1),
            zIndex: 0
          }}
        />
      </Box>

      <List sx={{ px: 2, py: 3 }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  px: 2,
                  backgroundColor: active ? alpha(item.color, 0.1) : 'transparent',
                  border: active ? `2px solid ${alpha(item.color, 0.3)}` : '2px solid transparent',
                  '&:hover': {
                    backgroundColor: alpha(item.color, 0.08),
                    border: `2px solid ${alpha(item.color, 0.2)}`,
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? item.color : theme.palette.text.secondary,
                    minWidth: 40
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  secondary={item.description}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: active ? 'bold' : 'medium',
                      color: active ? item.color : theme.palette.text.primary
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mx: 2 }} />

      <Box sx={{ p: 2 }}>
        <LanguageSelector />
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          color: theme.palette.text.primary
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0 }, minHeight: { xs: 64, md: 70 } }}>
            {/* Brand Logo */}
            <Box
              display="flex"
              alignItems="center"
              sx={{
                mr: { xs: 2, md: 4 },
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
              onClick={() => navigate('/')}
            >
              <Avatar
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  mr: 1.5,
                  width: { xs: 36, md: 40 },
                  height: { xs: 36, md: 40 },
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`
                }}
              >
                <TrendingUpIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
              </Avatar>

              <Box>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2
                  }}
                >
                  {t('nav.brandName')}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '0.7rem',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Professional Analytics
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box display="flex" alignItems="center" gap={1}>
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Tooltip key={item.path} title={item.description} arrow>
                      <Button
                        onClick={() => navigate(item.path)}
                        startIcon={item.icon}
                        sx={{
                          minWidth: 'auto',
                          px: 2.5,
                          py: 1,
                          borderRadius: 3,
                          textTransform: 'none',
                          fontWeight: active ? 'bold' : 'medium',
                          fontSize: '0.875rem',
                          color: active ? item.color : theme.palette.text.primary,
                          backgroundColor: active
                            ? alpha(item.color, 0.1)
                            : 'transparent',
                          border: active
                            ? `2px solid ${alpha(item.color, 0.2)}`
                            : '2px solid transparent',
                          '&:hover': {
                            backgroundColor: alpha(item.color, 0.08),
                            border: `2px solid ${alpha(item.color, 0.15)}`,
                            transform: 'translateY(-1px)',
                            boxShadow: `0 4px 12px ${alpha(item.color, 0.2)}`
                          },
                          transition: 'all 0.2s ease-in-out',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 2,
                            background: active
                              ? `linear-gradient(90deg, ${item.color}, ${alpha(item.color, 0.5)})`
                              : 'transparent',
                            borderRadius: '2px 2px 0 0'
                          }}
                        />
                        {item.label}
                        {active && (
                          <Chip
                            label="●"
                            size="small"
                            sx={{
                              ml: 1,
                              height: 16,
                              minWidth: 16,
                              '& .MuiChip-label': {
                                px: 0,
                                fontSize: '0.6rem',
                                color: item.color
                              },
                              bgcolor: 'transparent'
                            }}
                          />
                        )}
                      </Button>
                    </Tooltip>
                  );
                })}

                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    mx: 2,
                    bgcolor: alpha(theme.palette.divider, 0.3),
                    height: 30,
                    alignSelf: 'center'
                  }}
                />

                <LanguageSelector />
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  p: 1,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            boxShadow: theme.shadows[8]
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;
