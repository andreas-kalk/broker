import React from 'react';
import {alpha, Avatar, Box, Button, Card, CardContent, Chip, Grid, IconButton, LinearProgress, Typography, useTheme} from '@mui/material';
import {AccountBalance, Analytics, Assessment, CloudUpload, Euro, Refresh, TableChart, TrendingUp} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useReportData} from '../hooks/useReportData';
import FileUploadSection from './FileUploadSection';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const {t} = useTranslation();
    const {summary, loading, hasUploadedFile, refetch} = useReportData();

    if (loading) {
        return (
            <Box sx={{p: 4}}>
                <Box sx={{mb: 3}}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {t('dashboard.title')}
                    </Typography>
                    <LinearProgress sx={{borderRadius: 1, height: 6}}/>
                </Box>
                <Typography variant="body1" color="text.secondary">
                    {t('common.loading')}...
                </Typography>
            </Box>
        );
    }

    if (!hasUploadedFile) {
        return <FileUploadSection onUploadSuccess={refetch}/>;
    }

    const quickActions = [
        {
            title: t('nav.portfolio'),
            description: 'Portfolio-Analyse und Positionen',
            icon: <AccountBalance/>,
            color: theme.palette.secondary.main,
            path: '/portfolio',
            stats: 'Vollständig'
        },
        {
            title: t('nav.transactions'),
            description: 'Transaktionsanalyse und P&L',
            icon: <TrendingUp/>,
            color: theme.palette.success.main,
            path: '/transactions',
            stats: 'Verfügbar'
        },
        {
            title: t('nav.tax'),
            description: 'Steuerrelevante Daten für KAP',
            icon: <Assessment/>,
            color: theme.palette.info.main,
            path: '/tax',
            stats: 'Bereit'
        },
        {
            title: t('nav.data'),
            description: 'Datenexplorer und Sektionen',
            icon: <TableChart/>,
            color: theme.palette.warning.main,
            path: '/data',
            stats: `${summary?.sectionCount || 0} Sektionen`
        }
    ];

    const renderHeader = () => (
        <Box sx={{mb: 4}}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {t('dashboard.title')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Aktuell geladen: <strong>{summary?.currentFileName || 'Unbekannt'}</strong>
                    </Typography>
                </Box>
                <Box display="flex" gap={1}>
                    <IconButton
                        onClick={refetch}
                        sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': {bgcolor: alpha(theme.palette.primary.main, 0.2)}
                        }}
                    >
                        <Refresh/>
                    </IconButton>
                    <Button
                        variant="outlined"
                        startIcon={<CloudUpload/>}
                        onClick={() => navigate('/')}
                        sx={{borderRadius: 2}}
                    >
                        Neue Datei
                    </Button>
                </Box>
            </Box>
        </Box>
    );

    const renderStatsCards = () => (
        <Grid container spacing={3} sx={{mb: 4}}>
            <Grid item xs={12} sm={6} md={3}>
                <Card sx={{height: '100%'}}>
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                            <Avatar sx={{bgcolor: theme.palette.primary.main, mr: 2, width: 48, height: 48}}>
                                <Analytics/>
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    {summary?.sectionCount || 0}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Sektionen
                                </Typography>
                            </Box>
                        </Box>
                        <Chip
                            label="Analysiert"
                            color="primary"
                            size="small"
                            sx={{fontSize: '0.7rem'}}
                        />
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <Card sx={{height: '100%'}}>
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                            <Avatar sx={{bgcolor: theme.palette.success.main, mr: 2, width: 48, height: 48}}>
                                <TrendingUp/>
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    {summary?.totalDataRows || 0}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Datensätze
                                </Typography>
                            </Box>
                        </Box>
                        <Chip
                            label="Verarbeitet"
                            color="success"
                            size="small"
                            sx={{fontSize: '0.7rem'}}
                        />
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <Card sx={{height: '100%'}}>
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                            <Avatar sx={{bgcolor: theme.palette.warning.main, mr: 2, width: 48, height: 48}}>
                                <Euro/>
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    KAP
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Steueranalyse
                                </Typography>
                            </Box>
                        </Box>
                        <Chip
                            label="Bereit"
                            color="warning"
                            size="small"
                            sx={{fontSize: '0.7rem'}}
                        />
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <Card sx={{height: '100%'}}>
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                            <Avatar sx={{bgcolor: theme.palette.info.main, mr: 2, width: 48, height: 48}}>
                                <AccountBalance/>
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    Portfolio
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Positionen
                                </Typography>
                            </Box>
                        </Box>
                        <Chip
                            label="Aktiv"
                            color="info"
                            size="small"
                            sx={{fontSize: '0.7rem'}}
                        />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );

    const renderQuickActions = () => (
        <Box sx={{mb: 4}}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Schnellzugriff
            </Typography>
            <Grid container spacing={3}>
                {quickActions.map((action) => (
                    <Grid item xs={12} sm={6} md={3} key={action.title}>
                        <Card
                            sx={{
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: theme.shadows[4],
                                }
                            }}
                            onClick={() => navigate(action.path)}
                        >
                            <CardContent sx={{p: 3}}>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Avatar
                                        sx={{
                                            bgcolor: alpha(action.color, 0.1),
                                            color: action.color,
                                            mr: 2,
                                            width: 48,
                                            height: 48
                                        }}
                                    >
                                        {action.icon}
                                    </Avatar>
                                    <Chip
                                        label={action.stats}
                                        size="small"
                                        sx={{
                                            bgcolor: alpha(action.color, 0.1),
                                            color: action.color,
                                            fontSize: '0.7rem'
                                        }}
                                    />
                                </Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {action.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {action.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

    const renderDataSections = () => (
        <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Verfügbare Daten
            </Typography>
            <Grid container spacing={3}>
                {summary?.sectionNames?.slice(0, 6).map((sectionName) => (
                    <Grid item xs={12} sm={6} md={4} key={sectionName}>
                        <Card
                            sx={{
                                cursor: 'pointer',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                                    borderColor: theme.palette.primary.main,
                                }
                            }}
                            onClick={() => navigate(`/section/${encodeURIComponent(sectionName)}`)}
                        >
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="body1" fontWeight="500" gutterBottom>
                                            {sectionName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Sektion verfügbar
                                        </Typography>
                                    </Box>
                                    <Avatar
                                        sx={{
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: theme.palette.primary.main,
                                            width: 32,
                                            height: 32
                                        }}
                                    >
                                        <TableChart fontSize="small"/>
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                {(summary?.sectionNames?.length || 0) > 6 && (
                    <Grid item xs={12} sm={6} md={4}>
                        <Card
                            sx={{
                                cursor: 'pointer',
                                border: `2px dashed ${theme.palette.divider}`,
                                '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                                }
                            }}
                            onClick={() => navigate('/data')}
                        >
                            <CardContent sx={{textAlign: 'center', py: 4}}>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    +{(summary?.sectionNames?.length || 0) - 6}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Weitere Sektionen
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );

    return (
        <Box sx={{p: 3}}>
            {renderHeader()}
            {renderStatsCards()}
            {renderQuickActions()}
            {renderDataSections()}
        </Box>
    );
};

export default Dashboard;
