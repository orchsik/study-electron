import Box from '@mui/material/Box';

import LinearProgressWithLabel from '../components/LinearProgressWithLabel';

const ProgressBar = ({
  totalFiles = 0,
  downloadedFiles = 0,
  progress = 0,
}: {
  totalFiles: number;
  downloadedFiles: number;
  progress: number;
}) => {
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
