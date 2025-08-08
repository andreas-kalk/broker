import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import Dashboard from './components/Dashboard';
import SectionDetail from './components/SectionDetail';
import TaxAnalysis from './components/TaxAnalysis';
import Navigation from './components/Navigation';
import { brokerTheme } from './theme/brokerTheme';

function App() {
  return (
    <ThemeProvider theme={brokerTheme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/section/:sectionName" element={<SectionDetail />} />
            <Route path="/tax-analysis" element={<TaxAnalysis />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
