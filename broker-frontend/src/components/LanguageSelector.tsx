import React from 'react';
import {Box, FormControl, MenuItem, Select, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';

const LanguageSelector: React.FC = () => {
    const {i18n} = useTranslation();

    const languages = [
        {code: 'de', name: 'Deutsch', flag: '🇩🇪'},
        {code: 'en', name: 'English', flag: '🇺🇸'}
    ];

    const handleLanguageChange = (event: any) => {
        const languageCode = event.target.value;
        i18n.changeLanguage(languageCode);
        localStorage.setItem('i18nextLng', languageCode);
    };

    return (
        <FormControl size="small" sx={{minWidth: 120}}>
            <Select
                value={i18n.language}
                onChange={handleLanguageChange}
                displayEmpty
                renderValue={(selected) => {
                    const lang = languages.find(l => l.code === selected);
                    return (
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2">{lang?.flag}</Typography>
                            <Typography variant="body2" fontWeight="500">
                                {lang?.name}
                            </Typography>
                        </Box>
                    );
                }}
                sx={{
                    '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        py: 1
                    }
                }}
            >
                {languages.map((language) => (
                    <MenuItem key={language.code} value={language.code}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2">{language.flag}</Typography>
                            <Typography variant="body2">{language.name}</Typography>
                        </Box>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default LanguageSelector;
