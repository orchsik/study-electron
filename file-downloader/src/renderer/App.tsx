import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import './App.css';
import Hello from './src/pages/Hello';
import ServiceSelector from './src/pages/ServiceSelector';
import { StateProvider } from './src/data/StateProvider';

export default function App() {
  return (
    <Router>
      <StateProvider>
        <Routes>
          <Route path="/" element={<Hello />} />
          <Route path="/select" element={<ServiceSelector />} />
          {/* <Route path="/main" element={<Main />} /> */}
        </Routes>
      </StateProvider>

      <ToastContainer pauseOnFocusLoss={false} />
    </Router>
  );
}
