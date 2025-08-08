import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Avatar,
  useTheme,
  alpha,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  CloudUpload,
  FileUpload as FileUploadIcon,
  Analytics,
  TrendingUp
} from '@mui/icons-material';
import FileUpload from './FileUpload';

interface FileUploadSectionProps {
  onUploadSuccess: () => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ onUploadSuccess }) => {
  const [showUpload, setShowUpload] = useState(false);
  const theme = useTheme();

  const features = [
    {
      icon: <Analytics />,
      title: 'Automatische Analyse',
      description: 'Ihre CSV-Datei wird automatisch analysiert und strukturiert'
    },
    {
      icon: <TrendingUp />,
      title: 'Steueroptimierung',
      description: 'Bereiten Sie Ihre KAP-Formulardaten optimal vor'
    },
    {
      icon: <FileUploadIcon />,
      title: 'Sichere Verarbeitung',
      description: 'Alle Daten werden lokal verarbeitet und nicht gespeichert'
    }
  ];

  const handleUploadSuccess = () => {
    setShowUpload(false);
    onUploadSuccess();
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4
      }}
    >
      <Card
        elevation={3}
        sx={{
          maxWidth: 800,
          width: '100%',
          borderRadius: 4,
          overflow: 'visible'
        }}
      >
        <CardContent sx={{ p: 6 }}>
          {!showUpload ? (
            <Stack spacing={4} alignItems="center" textAlign="center">
              {/* Header */}
              <Box>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <CloudUpload sx={{ fontSize: 40 }} />
                </Avatar>

                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 'bold',
                    mb: 2,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Willkommen bei Broker Analyzer
                </Typography>

                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                  Laden Sie Ihre CSV-Datei hoch, um mit der professionellen Analyse Ihrer Broker-Daten zu beginnen
                </Typography>
              </Box>

              {/* Features */}
              <Stack spacing={3} sx={{ width: '100%', maxWidth: 600 }}>
                {features.map((feature, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      p: 3,
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        borderColor: theme.palette.primary.main,
                        transform: 'translateX(8px)'
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        width: 48,
                        height: 48
                      }}
                    >
                      {feature.icon}
                    </Avatar>

                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>

              {/* Call to Action */}
              <Button
                variant="contained"
                size="large"
                startIcon={<CloudUpload />}
                onClick={() => setShowUpload(true)}
                sx={{
                  py: 2,
                  px: 4,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`
                  }
                }}
              >
                CSV-Datei hochladen
              </Button>

              {/* Info */}
              <Alert
                severity="info"
                sx={{
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.info.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                }}
              >
                <Typography variant="body2">
                  <strong>Unterstützte Formate:</strong> CSV-Dateien von Interactive Brokers,
                  Comdirect, und anderen gängigen Brokern
                </Typography>
              </Alert>
            </Stack>
          ) : (
            <Box>
              <Button
                onClick={() => setShowUpload(false)}
                sx={{ mb: 3 }}
              >
                ← Zurück
              </Button>
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default FileUploadSection;
