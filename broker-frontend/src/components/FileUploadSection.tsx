import React, {useState} from 'react';
import {Alert, alpha, Avatar, Box, Card, CardContent, Chip, Grid, LinearProgress, Typography, useTheme} from '@mui/material';
import {Analytics, CheckCircle, CloudUpload, Security, Speed} from '@mui/icons-material';
import {useTranslation} from 'react-i18next';
import FileUpload from './FileUpload';

interface FileUploadSectionProps {
    onUploadSuccess?: () => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ onUploadSuccess }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const features = [
        {
            icon: <Analytics />,
            title: 'Automatische Analyse',
            description: 'CSV-Dateien werden automatisch analysiert und strukturiert',
            color: theme.palette.primary.main
        },
        {
            icon: <Security />,
            title: 'Sichere Verarbeitung',
            description: 'Alle Daten werden lokal verarbeitet und nicht gespeichert',
            color: theme.palette.success.main
        },
        {
            icon: <Speed />,
            title: 'Steueroptimierung',
            description: 'KAP-Formulardaten werden optimal aufbereitet',
            color: theme.palette.warning.main
        }
    ];

    const handleUploadStart = () => {
        setIsUploading(true);
        setUploadError(null);
        setUploadSuccess(false);
    };

    const handleUploadSuccess = () => {
        setIsUploading(false);
        setUploadSuccess(true);
        setUploadError(null);
        if (onUploadSuccess) {
            setTimeout(onUploadSuccess, 1000);
        }
    };

    const handleUploadError = (error: string) => {
        setIsUploading(false);
        setUploadError(error);
        setUploadSuccess(false);
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Avatar
                    sx={{
                        bgcolor: theme.palette.primary.main,
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 3
                    }}
                >
                    <CloudUpload sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {t('upload.title')}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                    {t('upload.description')}
                </Typography>
            </Box>

            {/* Upload Status */}
            {uploadSuccess && (
                <Alert 
                    severity="success" 
                    sx={{ mb: 4, borderRadius: 3 }}
                    icon={<CheckCircle />}
                >
                    <Typography fontWeight="600">
                        {t('upload.success')}
                    </Typography>
                    Ihre Datei wurde erfolgreich hochgeladen und analysiert.
                </Alert>
            )}

            {uploadError && (
                <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
                    <Typography fontWeight="600">
                        {t('upload.error')}
                    </Typography>
                    {uploadError}
                </Alert>
            )}

            {/* Main Upload Card */}
            <Card sx={{ mb: 6, overflow: 'visible' }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <FileUpload
                            onUploadStart={handleUploadStart}
                            onUploadSuccess={handleUploadSuccess}
                            onUploadError={handleUploadError}
                        />
                        
                        {isUploading && (
                            <Box sx={{ mt: 3 }}>
                                <LinearProgress sx={{ borderRadius: 1, height: 8, mb: 2 }} />
                                <Typography variant="body2" color="text.secondary">
                                    {t('upload.uploading')}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>

            {/* Features Grid */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                {features.map((feature) => (
                    <Grid item xs={12} md={4} key={feature.title}>
                        <Card
                            sx={{
                                height: '100%',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: theme.shadows[4]
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                <Avatar
                                    sx={{
                                        bgcolor: alpha(feature.color, 0.1),
                                        color: feature.color,
                                        width: 56,
                                        height: 56,
                                        mx: 'auto',
                                        mb: 2
                                    }}
                                >
                                    {feature.icon}
                                </Avatar>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {feature.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Supported Formats */}
            <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02), border: 'none' }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Unterstützte Formate
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {t('upload.supportedFormats')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {['Interactive Brokers', 'Comdirect', 'Consorsbank', 'DKB'].map((broker) => (
                            <Chip
                                key={broker}
                                label={broker}
                                variant="outlined"
                                size="small"
                                sx={{ fontSize: '0.75rem' }}
                            />
                        ))}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default FileUploadSection;
