import React, {useMemo, useState} from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import {AccountBalance, Assessment, Euro, ExpandMore, GetApp, Search, ShowChart, TableChart, Timeline, Visibility} from '@mui/icons-material';
import {useSearchParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useReportData} from '../hooks/useReportData';
import DividendsTable from './DividendsTable';
import TransactionsTable from './TransactionsTable';
import {getSectionType, SECTION_TYPES} from '../utils/sectionUtils';

const DataExplorer: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const { sections, loading, error } = useReportData();
  const initialSection = searchParams.get('section');

  // Initialize expanded sections with the initial section if provided
  React.useEffect(() => {
    if (initialSection && sections?.[initialSection]) {
      setExpandedSections(new Set([initialSection]));
    }
  }, [initialSection, sections]);

  const categories = [
    { id: 'all', label: t('explorer.categories.all'), icon: <TableChart /> },
    { id: 'trades', label: t('explorer.categories.trades'), icon: <ShowChart /> },
    { id: 'dividends', label: t('explorer.categories.dividends'), icon: <Euro /> },
    { id: 'performance', label: t('explorer.categories.performance'), icon: <Timeline /> },
    { id: 'cash', label: t('explorer.categories.cash'), icon: <AccountBalance /> },
    { id: 'other', label: t('explorer.categories.other'), icon: <Assessment /> }
  ];

  const filteredSections = useMemo(() => {
    if (!sections) return [];

    return Object.entries(sections).filter(([sectionName, sectionData]) => {
      // Search filter
      const matchesSearch = sectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sectionData.headers.some((header: string) =>
          header.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Category filter
      let matchesCategory = true;
      if (selectedCategory !== 'all') {
        const name = sectionName.toLowerCase();
        switch (selectedCategory) {
          case 'trades':
            matchesCategory = name.includes('trade') || name.includes('transak');
            break;
          case 'dividends':
            matchesCategory = name.includes('dividend');
            break;
          case 'performance':
            matchesCategory = name.includes('performance') || name.includes('mtm');
            break;
          case 'cash':
            matchesCategory = name.includes('cash') || name.includes('konto');
            break;
          case 'other':
            matchesCategory = !name.includes('trade') && !name.includes('transak') &&
                             !name.includes('dividend') && !name.includes('performance') &&
                             !name.includes('cash') && !name.includes('konto');
            break;
        }
      }

      return matchesSearch && matchesCategory;
    });
  }, [sections, searchTerm, selectedCategory]);

  const toggleSection = (sectionName: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName);
    } else {
      newExpanded.add(sectionName);
    }
    setExpandedSections(newExpanded);
  };

  const getSectionIcon = (sectionName: string) => {
    const name = sectionName.toLowerCase();
    if (name.includes('dividend')) return <Euro sx={{ fontSize: 20 }} />;
    if (name.includes('trade') || name.includes('transak')) return <ShowChart sx={{ fontSize: 20 }} />;
    if (name.includes('performance')) return <Timeline sx={{ fontSize: 20 }} />;
    if (name.includes('cash') || name.includes('konto')) return <AccountBalance sx={{ fontSize: 20 }} />;
    return <Assessment sx={{ fontSize: 20 }} />;
  };

  const getSectionColor = (sectionName: string) => {
    const name = sectionName.toLowerCase();
    if (name.includes('dividend')) return theme.palette.success.main;
    if (name.includes('trade') || name.includes('transak')) return theme.palette.primary.main;
    if (name.includes('performance')) return theme.palette.warning.main;
    if (name.includes('cash') || name.includes('konto')) return theme.palette.info.main;
    return theme.palette.secondary.main;
  };

  const renderSectionContent = (sectionName: string, sectionData: any) => {
    const sectionType = getSectionType(sectionName);

    if (sectionType === SECTION_TYPES.DIVIDENDS) {
      return <DividendsTable sectionData={sectionData} />;
    }

    if (sectionType === SECTION_TYPES.TRADES) {
      return <TransactionsTable sectionData={sectionData} />;
    }

    // Default table view for other sections
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {sectionData.dataRows.length} Einträge • {sectionData.headers.length} Spalten
        </Typography>
        <Typography variant="body2">
          Standardansicht für {sectionName} - detaillierte Tabelle verfügbar über Sektion-Detail
        </Typography>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>{t('common.loading')}...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          {t('explorer.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('explorer.description')}
        </Typography>
      </Box>

      {/* Filters */}
      <Card elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder={t('explorer.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Tabs
                value={selectedCategory}
                onChange={(_, value) => setSelectedCategory(value)}
                variant="scrollable"
                scrollButtons="auto"
              >
                {categories.map((category) => (
                  <Tab
                    key={category.id}
                    value={category.id}
                    icon={category.icon}
                    label={category.label}
                    sx={{ textTransform: 'none', minHeight: 48 }}
                  />
                ))}
              </Tabs>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results */}
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">
            {filteredSections.length} {t('explorer.sectionsFound')}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<Visibility />}
              onClick={() => setExpandedSections(new Set(filteredSections.map(([name]) => name)))}
            >
              {t('explorer.openAll')}
            </Button>
            <Button
              startIcon={<ExpandMore />}
              onClick={() => setExpandedSections(new Set())}
            >
              {t('explorer.closeAll')}
            </Button>
          </Stack>
        </Box>

        <Stack spacing={2}>
          {filteredSections.map(([sectionName, sectionData]) => {
            const isExpanded = expandedSections.has(sectionName);
            const sectionColor = getSectionColor(sectionName);

            return (
              <Card
                key={sectionName}
                elevation={1}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${alpha(sectionColor, 0.2)}`,
                  '&:hover': {
                    boxShadow: `0 8px 32px ${alpha(sectionColor, 0.1)}`
                  }
                }}
              >
                <Accordion
                  expanded={isExpanded}
                  onChange={() => toggleSection(sectionName)}
                  sx={{
                    boxShadow: 'none',
                    '&:before': { display: 'none' },
                    borderRadius: 3
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      px: 3,
                      py: 2,
                      backgroundColor: alpha(sectionColor, 0.05),
                      borderRadius: isExpanded ? '12px 12px 0 0' : 3,
                      '& .MuiAccordionSummary-content': {
                        alignItems: 'center',
                        gap: 2
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha(sectionColor, 0.1),
                        color: sectionColor,
                        width: 40,
                        height: 40
                      }}
                    >
                      {getSectionIcon(sectionName)}
                    </Avatar>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {sectionName}
                      </Typography>
                      <Box display="flex" gap={1} mt={0.5}>
                        <Chip
                          label={`${sectionData.dataRows.length} ${t('explorer.entries')}`}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: sectionColor, color: sectionColor }}
                        />
                        <Chip
                          label={`${sectionData.headers.length} ${t('explorer.columns')}`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>

                    <Tooltip title={t('explorer.exportCsv')}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          // Export functionality would go here
                        }}
                        sx={{ color: sectionColor }}
                      >
                        <GetApp />
                      </IconButton>
                    </Tooltip>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 0 }}>
                    {renderSectionContent(sectionName, sectionData)}
                  </AccordionDetails>
                </Accordion>
              </Card>
            );
          })}
        </Stack>

        {filteredSections.length === 0 && (
          <Card elevation={1} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('explorer.noSections')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('explorer.tryDifferent')}
            </Typography>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default DataExplorer;
