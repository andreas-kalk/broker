import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { SectionData } from '../types/api';

interface DividendsTableProps {
  sectionData: SectionData;
}

interface DividendEntry {
  currency: string;
  date: string;
  description: string;
  amount: string;
  share?: string;
}

interface GroupedDividends {
  [currency: string]: {
    [date: string]: {
      [share: string]: DividendEntry[];
    };
  };
}

const DividendsTable: React.FC<DividendsTableProps> = ({ sectionData }) => {
  // Extract share symbol from description
  const extractShare = (description: string): string => {
    const match = description.match(/^([A-Z0-9]+)\(/);
    return match ? match[1] : 'Unbekannt';
  };

  // Group dividends by currency, date, and share
  const groupDividends = (): GroupedDividends => {
    const grouped: GroupedDividends = {};

    sectionData.dataRows.forEach((row) => {
      // Skip summary rows
      if (row['Währung'] === 'Gesamt' || row['Währung'] === 'Gesamtwert in EUR' || row['Währung'] === 'Gesamt Dividenden in EUR') {
        return;
      }

      const currency = row['Währung'] || 'Unbekannt';
      const date = row['Datum'] || 'Unbekannt';
      const description = row['Beschreibung'] || '';
      const amount = row['Betrag'] || '0';
      const share = extractShare(description);

      if (!grouped[currency]) {
        grouped[currency] = {};
      }
      if (!grouped[currency][date]) {
        grouped[currency][date] = {};
      }
      if (!grouped[currency][date][share]) {
        grouped[currency][date][share] = [];
      }

      grouped[currency][date][share].push({
        currency,
        date,
        description,
        amount,
        share
      });
    });

    return grouped;
  };

  // Calculate totals
  const calculateTotal = (entries: DividendEntry[]): number => {
    return entries.reduce((sum, entry) => {
      const amount = parseFloat(entry.amount) || 0;
      return sum + amount;
    }, 0);
  };

  const groupedData = groupDividends();

  return (
    <Box>
      {Object.entries(groupedData).map(([currency, dateGroups]) => (
        <Accordion key={currency} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              {currency} - Währung
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {Object.entries(dateGroups).map(([date, shareGroups]) => (
              <Box key={date} mb={3}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  📅 {date}
                </Typography>

                {Object.entries(shareGroups).map(([share, entries]) => {
                  const total = calculateTotal(entries);

                  return (
                    <Box key={share} mb={2} ml={2}>
                      <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          📈 {share}
                        </Typography>
                        <Chip
                          label={`Gesamt: ${total.toFixed(2)} ${currency}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>

                      <TableContainer component={Paper} variant="outlined" sx={{ ml: 2 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
                                Beschreibung
                              </TableCell>
                              <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}>
                                Betrag ({currency})
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {entries.map((entry, index) => (
                              <TableRow key={index} hover>
                                <TableCell>{entry.description}</TableCell>
                                <TableCell align="right">
                                  <Typography
                                    color={parseFloat(entry.amount) >= 0 ? 'success.main' : 'error.main'}
                                    sx={{ fontWeight: 'medium' }}
                                  >
                                    {parseFloat(entry.amount).toFixed(2)}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  );
                })}
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default DividendsTable;
