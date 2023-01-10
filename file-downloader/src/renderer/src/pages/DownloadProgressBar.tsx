import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

import LinearProgressWithLabel from '../components/LinearProgressWithLabel';

const DownloadProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [totalCnt, setTotalCnt] = useState(0);
  const [downloadedCnt, setDownloadedCnt] = useState(0);

  useEffect(() => {
    window.electron.ipcRenderer.on('download-progress', (args) => {
      // setProgress(args.progressPercent);
      setProgress(Math.round((args.downloadedCnt / args.totalCnt) * 100));
      setTotalCnt(args.totalCnt);
      setDownloadedCnt(args.downloadedCnt);
    });
  }, []);

  const label = totalCnt
    ? // ? `${downloadedCnt}/${totalCnt} - ${Math.round(progress)}%`
      `${downloadedCnt}/${totalCnt}`
    : undefined;

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={progress} label={label} />
    </Box>
  );
};

export default DownloadProgressBar;
