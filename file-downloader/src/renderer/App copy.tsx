import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

const Hello = () => {
  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <button
          type="button"
          onClick={() => {
            window.electron.ipcRenderer.sendMessage('download', {
              url: 'https://jinhakstorageaccount.blob.core.windows.net/rms-8888/2023/A/%EA%B5%AD%EC%A0%9C%20%ED%95%99%EC%83%9D%EB%B6%80%EC%A2%85%ED%95%A9%EC%A0%84%ED%98%95%20%EC%9E%84%EC%9D%98%20%EB%A9%B4%EC%A0%91/5%40T00000001%402.mp4?st=2022-12-26T05%3A31%3A36Z&se=2022-12-26T05%3A56%3A36Z&sp=r&sv=2018-03-28&sr=b&sig=euAMJfg7Y6oxbSM2UbzIjZYWEG0Pdbjiy7W9yIvxg%2B8%3D',
            });
          }}
        >
          <span role="img" aria-label="books">
            📚
          </span>
          Read our docs
        </button>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
