import React from 'react';
import {alpha, Avatar, Box, Button, Card, CardContent, Chip, Grid, IconButton, LinearProgress, Stack, Tooltip, Typography, useTheme} from '@mui/material';
import {AccountBalance, Analytics, Assessment, CloudUpload, Euro, FilePresent, Refresh, ShowChart, TrendingUp} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useReportData} from '../hooks/useReportData';
import FileUploadSection from './FileUploadSection';
import QuickStatsCards from './QuickStatsCards';
import RecentActivityWidget from './RecentActivityWidget';
import PortfolioOverview from './PortfolioOverview';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const {t} = useTranslation();
    const {summary, sections, loading, hasUploadedFile, refetch} = useReportData();

    if (loading) {
        return (
            <Box sx={{p: 4}}>
                <LinearProgress sx={{mb: 2}}/>
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
            title: t('nav.taxAnalysis'),
            description: t('tax.description'),
            icon: <Assessment/>,
            color: theme.palette.success.main,
            path: '/tax-analysis',
            stats: t('dashboard.ready')
        },
        {
            title: t('nav.dataExplorer'),
            description: t('explorer.description'),
            icon: <ShowChart/>,
            color: theme.palette.info.main,
            path: '/data-explorer',
            stats: `${summary?.sectionCount || 0} ${t('dashboard.sections')}`
        },
        {
            title: t('nav.help'),
            description: t('help.description'),
            icon: <Analytics/>,
            color: theme.palette.warning.main,
            path: '/help',
            stats: t('help.title')
        }
    ];

    return (
        <Box sx={{p: {xs: 2, md: 4}, minHeight: 'calc(100vh - 80px)'}}>
            {/* Header Section */}
            <Box sx={{mb: 4}}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                fontWeight: 'bold',
                                mb: 1,
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            {t('dashboard.title')}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{mb: 2}}>
                            {t('dashboard.currentFile')}: {summary?.currentFileName}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <Tooltip title={t('dashboard.refreshData')}>
                            <IconButton onClick={refetch} color="primary">
                                <Refresh/>
                            </IconButton>
                        </Tooltip>
                        <Button
                            variant="outlined"
                            startIcon={<CloudUpload/>}
                            onClick={() => navigate('/upload')}
                            sx={{borderRadius: 2}}
                        >
                            {t('dashboard.newFile')}
                        </Button>
                    </Stack>
                </Box>

                {/* Quick Stats Row */}
                <QuickStatsCards summary={summary}/>
            </Box>

            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Left Column - Quick Actions & Activity */}
                <Grid item xs={12} lg={4}>
                    <Stack spacing={3}>
                        {/* Quick Actions Card */}
                        <Card elevation={2} sx={{borderRadius: 3}}>
                            <CardContent sx={{p: 3}}>
                                <Typography variant="h6" sx={{mb: 2, fontWeight: 'bold'}}>
                                    {t('dashboard.quickAccess')}
                                </Typography>
                                <Stack spacing={2}>
                                    {quickActions.map((action) => (
                                        <Box
                                            key={action.title}
                                            onClick={() => navigate(action.path)}
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                border: `1px solid ${theme.palette.divider}`,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease-in-out',
                                                '&:hover': {
                                                    backgroundColor: alpha(action.color, 0.1),
                                                    borderColor: action.color,
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: `0 4px 20px ${alpha(action.color, 0.2)}`
                                                }
                                            }}
                                        >
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: alpha(action.color, 0.1),
                                                        color: action.color,
                                                        width: 48,
                                                        height: 48
                                                    }}
                                                >
                                                    {action.icon}
                                                </Avatar>
                                                <Box sx={{flexGrow: 1}}>
                                                    <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>
                                                        {action.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {action.description}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={action.stats}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{
                                                        borderColor: action.color,
                                                        color: action.color
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <RecentActivityWidget sections={sections}/>
                    </Stack>
                </Grid>

                {/* Center & Right Columns - Portfolio Overview */}
                <Grid item xs={12} lg={8}>
                    <PortfolioOverview sections={sections}/>
                </Grid>
            </Grid>

            {/* Bottom Section - Data Insights */}
            <Box sx={{mt: 4}}>
                <Typography variant="h5" sx={{mb: 3, fontWeight: 'bold'}}>
                    {t('dashboard.dataOverview')}
                </Typography>

                <Grid container spacing={3}>
                    {sections && Object.entries(sections).slice(0, 6).map(([sectionName, sectionData]) => (
                        <Grid item xs={12} sm={6} md={4} key={sectionName}>
                            <Card
                                elevation={1}
                                sx={{
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        elevation: 4,
                                        transform: 'translateY(-4px)'
                                    }
                                }}
                                onClick={() => navigate(`/data-explorer?section=${sectionName}`)}
                            >
                                <CardContent>
                                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                        <Typography variant="h6" noWrap sx={{fontWeight: 'bold'}}>
                                            {sectionName}
                                        </Typography>
                                        <Avatar sx={{width: 32, height: 32, bgcolor: theme.palette.primary.main}}>
                                            {getSectionIcon(sectionName)}
                                        </Avatar>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {sectionData.dataRows.length} {t('explorer.entries')} • {sectionData.headers.length} {t('explorer.columns')}
                                    </Typography>

                                    <LinearProgress
                                        variant="determinate"
                                        value={Math.min((sectionData.dataRows.length / 100) * 100, 100)}
                                        sx={{
                                            mt: 1,
                                            height: 6,
                                            borderRadius: 3,
                                            backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

// Helper function to get appropriate icon for section
const getSectionIcon = (sectionName: string) => {
    const name = sectionName.toLowerCase();
    if (name.includes('dividend')) return <Euro sx={{fontSize: 16}}/>;
    if (name.includes('trade')) return <ShowChart sx={{fontSize: 16}}/>;
    if (name.includes('performance')) return <TrendingUp sx={{fontSize: 16}}/>;
    if (name.includes('cash')) return <AccountBalance sx={{fontSize: 16}}/>;
    return <FilePresent sx={{fontSize: 16}}/>;
};

export default Dashboard;
