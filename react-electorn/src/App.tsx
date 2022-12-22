import logo from './logo.svg';
import './App.css';
import { channels } from './shared/constants';
import { useEffect, useState } from 'react';

const { ipcRenderer } = window.require('electron');

function App() {
  const [product, setProduct] = useState('');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Listen for the event
    ipcRenderer.on(channels.GET_DATA, (event: any, arg: any) => {
      setData(arg);
    });
    // Clean the listener after the component is dismounted
    return () => {
      ipcRenderer.removeAllListeners();
    };
  }, []);

  const getData = () => {
    // Send the event to get the data
    ipcRenderer.send(channels.GET_DATA, { product: 'notebook' });
  };

  const handleQuit = () => {
    ipcRenderer.invoke(channels.QUIT);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} width={200} className="App-logo" alt="logo" />
        <button onClick={getData}>Get data</button>
        <button onClick={handleQuit}>Quit app</button>
      </header>

      {data && (
        <>
          <h3>Product info</h3>
          <ul>
            <li>Name: {data.name}</li>
            <li>Price: {data.price}</li>
            <li>Color: {data.color}</li>
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
