import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {Container, Box} from '@mui/material';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard.tsx';
import DataExplorer from './components/DataExplorer';
import TaxAnalysis from './components/TaxAnalysis';
import CodesAndHelp from './components/CodesAndHelp';
import SectionDetail from './components/SectionDetail';
import OptionsCalculator from './components/OptionsCalculator';
import {brokerTheme} from './theme/brokerTheme';

function App() {
    return (
        <ThemeProvider theme={brokerTheme}>
            <CssBaseline/>
            <Router>
                <Box sx={{minHeight: '100vh', backgroundColor: 'background.default'}}>
                    <Navigation/>
                    <Container
                        maxWidth="xl"
                        sx={{
                            px: {xs: 1, sm: 2, md: 3},
                            py: 0,
                            minHeight: 'calc(100vh - 80px)'
                        }}
                    >
                        <Routes>
                            <Route path="/" element={<Dashboard/>}/>
                            <Route path="/data-explorer" element={<DataExplorer/>}/>
                            <Route path="/tax-analysis" element={<TaxAnalysis/>}/>
                            <Route path="/help" element={<CodesAndHelp/>}/>
                            <Route path="/options-calculator" element={<OptionsCalculator/>}/>
                            <Route path="/section/:sectionName" element={<SectionDetail/>}/>
                        </Routes>
                    </Container>
                </Box>
            </Router>
        </ThemeProvider>
    );
}

export default App;
