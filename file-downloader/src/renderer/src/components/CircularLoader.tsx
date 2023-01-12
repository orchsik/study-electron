import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const CircularLoader = ({ size = 16 }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 1,
      }}
    >
      <CircularProgress color="inherit" size={size} />
    </Box>
  );
};

export default CircularLoader;
