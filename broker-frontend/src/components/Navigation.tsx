import React, {useState} from 'react';
import {
    alpha,
    AppBar,
    Avatar,
    Box,
    Button,
    Chip,
    Container,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    AccountBalance as PortfolioIcon,
    Assessment as TaxIcon,
    Close as CloseIcon,
    Dashboard as DashboardIcon,
    Help as HelpIcon,
    Menu as MenuIcon,
    TableChart as DataIcon,
    TrendingUp as TransactionsIcon
} from '@mui/icons-material';
import {useLocation, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Navigation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const {t} = useTranslation();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        {
            label: t('nav.dashboard'),
            path: '/',
            icon: <DashboardIcon/>,
            color: theme.palette.primary.main
        },
        {
            label: t('nav.portfolio'),
            path: '/portfolio',
            icon: <PortfolioIcon/>,
            color: theme.palette.secondary.main
        },
        {
            label: t('nav.transactions'),
            path: '/transactions',
            icon: <TransactionsIcon/>,
            color: theme.palette.success.main
        },
        {
            label: t('nav.tax'),
            path: '/tax-analysis',
            icon: <TaxIcon/>,
            color: theme.palette.info.main
        },
        {
            label: t('nav.data'),
            path: '/data-explorer',
            icon: <DataIcon/>,
            color: theme.palette.warning.main
        },
        {
            label: t('nav.help'),
            path: '/help',
            icon: <HelpIcon/>,
            color: theme.palette.grey[600]
        }
    ];

    const isActive = (path: string) => location.pathname === path;

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) setMobileOpen(false);
    };

    // Desktop Navigation
    const renderDesktopNav = () => (
        <Box display="flex" alignItems="center" gap={1}>
            {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                    <Button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        startIcon={item.icon}
                        sx={{
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: active ? 600 : 500,
                            color: active ? item.color : theme.palette.text.primary,
                            backgroundColor: active ? alpha(item.color, 0.1) : 'transparent',
                            border: active ? `1px solid ${alpha(item.color, 0.2)}` : '1px solid transparent',
                            '&:hover': {
                                backgroundColor: alpha(item.color, 0.08),
                                borderColor: alpha(item.color, 0.15),
                            },
                            transition: 'all 0.2s ease-in-out',
                        }}
                    >
                        {item.label}
                        {active && (
                            <Chip
                                size="small"
                                sx={{
                                    ml: 1,
                                    height: 16,
                                    fontSize: '0.6rem',
                                    backgroundColor: item.color,
                                    color: 'white',
                                    '& .MuiChip-label': {px: 0.5}
                                }}
                                label="●"
                            />
                        )}
                    </Button>
                );
            })}
        </Box>
    );

    // Mobile Drawer
    const renderMobileDrawer = () => (
        <Drawer
            variant="temporary"
            anchor="right"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{keepMounted: true}}
            sx={{
                display: {xs: 'block', md: 'none'},
                '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: 280,
                },
            }}
        >
            <Box sx={{p: 3}}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                    <Box display="flex" alignItems="center">
                        <Avatar
                            sx={{
                                bgcolor: theme.palette.primary.main,
                                mr: 2,
                                width: 40,
                                height: 40
                            }}
                        >
                            <TransactionsIcon/>
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold">
                            {t('nav.brandName')}
                        </Typography>
                    </Box>
                    <IconButton onClick={handleDrawerToggle}>
                        <CloseIcon/>
                    </IconButton>
                </Box>

                <List sx={{px: 0}}>
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <ListItem key={item.path} disablePadding sx={{mb: 1}}>
                                <ListItemButton
                                    onClick={() => handleNavigation(item.path)}
                                    sx={{
                                        borderRadius: 2,
                                        backgroundColor: active ? alpha(item.color, 0.1) : 'transparent',
                                        border: active ? `1px solid ${alpha(item.color, 0.2)}` : '1px solid transparent',
                                        '&:hover': {
                                            backgroundColor: alpha(item.color, 0.08),
                                            borderColor: alpha(item.color, 0.15),
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{color: active ? item.color : theme.palette.text.secondary}}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                fontWeight: active ? 600 : 500,
                                                color: active ? item.color : theme.palette.text.primary
                                            }
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>

                <Divider sx={{my: 2}}/>
                <LanguageSelector/>
            </Box>
        </Drawer>
    );

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(12px)',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.text.primary
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar sx={{px: {xs: 0}, minHeight: 64}}>
                        {/* Brand */}
                        <Box
                            display="flex"
                            alignItems="center"
                            sx={{mr: 4, cursor: 'pointer'}}
                            onClick={() => navigate('/')}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    mr: 1.5,
                                    width: 36,
                                    height: 36,
                                }}
                            >
                                <TransactionsIcon/>
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight="bold" sx={{lineHeight: 1.2}}>
                                    {t('nav.brandName')}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{display: {xs: 'none', sm: 'block'}}}
                                >
                                    Professional Analytics
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{flexGrow: 1}}/>

                        {/* Desktop Navigation */}
                        {!isMobile && (
                            <Box display="flex" alignItems="center" gap={2}>
                                {renderDesktopNav()}
                                <Divider orientation="vertical" flexItem sx={{mx: 1, height: 30}}/>
                                <LanguageSelector/>
                            </Box>
                        )}

                        {/* Mobile Menu Button */}
                        {isMobile && (
                            <IconButton
                                onClick={handleDrawerToggle}
                                sx={{
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                                    }
                                }}
                            >
                                <MenuIcon/>
                            </IconButton>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            {renderMobileDrawer()}
        </>
    );
};

export default Navigation;
