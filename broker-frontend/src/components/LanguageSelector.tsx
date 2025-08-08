import React from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  Box,
  Typography,
  useTheme,
  alpha
} from '@mui/material';
import { Language, Public } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();
  const theme = useTheme();

  const languages = [
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('i18nextLng', languageCode);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <Select
        value={i18n.language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        displayEmpty
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 0.5,
            px: 1.5,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.15),
            }
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          },
          '& .MuiSelect-icon': {
            color: theme.palette.primary.main
          }
        }}
        renderValue={() => (
          <Box display="flex" alignItems="center" gap={1}>
            <Public sx={{ fontSize: 16, color: theme.palette.primary.main }} />
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {currentLanguage.flag} {currentLanguage.name}
            </Typography>
          </Box>
        )}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            value={language.code}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 1,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              },
              '&.Mui-selected': {
                backgroundColor: alpha(theme.palette.primary.main, 0.15),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2)
                }
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <Typography sx={{ fontSize: '1.2rem' }}>{language.flag}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {language.name}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
