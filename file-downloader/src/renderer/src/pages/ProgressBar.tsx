import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

import LinearProgressWithLabel from '../components/LinearProgressWithLabel';

const ProgressBar = ({
  totalFiles = 0,
  downloadedFiles = 0,
}: {
  totalFiles: number;
  downloadedFiles: number;
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'download-progress',
      ({ progressPercent }) => {
        setProgress(progressPercent);
      }
    );
  }, []);

  const label = totalFiles
    ? `${Math.round(progress)}% - ${downloadedFiles}/${totalFiles}`
    : undefined;

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={progress} label={label} />
    </Box>
  );
};

export default ProgressBar;
