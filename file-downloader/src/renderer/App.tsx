import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import './App.css';
import { StateProvider } from './src/data/StateProvider';

import Hello from './src/pages/Hello';
import ServiceSelector from './src/pages/ServiceSelector';
import Downloader from './src/pages/Downloader';
import SampleDown from './SampleDown';

export default function App() {
  return (
    <Router>
      <StateProvider>
        <Routes>
          {/* <Route path="/sampleDown" element={<SampleDown />} /> */}
          <Route path="/" element={<Hello />} />
          <Route path="/select" element={<ServiceSelector />} />
          <Route path="/downloader" element={<Downloader />} />
        </Routes>
      </StateProvider>

      <ToastContainer pauseOnFocusLoss={false} />
    </Router>
  );
}
