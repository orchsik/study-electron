import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import { StateProvider } from './src/data/StateProvider';

import Hello from './src/pages/Hello';
import ServiceSelector from './src/pages/ServiceSelector';
import Downloader from './src/pages/Downloader';
import SampleDown from './SampleDown';

axios.defaults.adapter = httpAdapter;

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
