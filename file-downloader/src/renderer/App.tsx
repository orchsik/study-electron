import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import './App.css';
import './src/api/common';
import { StateProvider } from './src/modules/data/StateProvider';

import Hello from './src/pages/Hello';
import ServiceSelector from './src/pages/ServiceSelector';
import Downloader from './src/pages/Downloader';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
  return (
    <Router>
      <StateProvider>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Routes>
            {/* <Route path="/sampleDown" element={<SampleDown />} /> */}
            <Route path="/" element={<Hello />} />
            <Route path="/select" element={<ServiceSelector />} />
            <Route path="/downloader" element={<Downloader />} />
          </Routes>
        </ThemeProvider>
      </StateProvider>

      <ToastContainer pauseOnFocusLoss={false} />
    </Router>
  );
}
