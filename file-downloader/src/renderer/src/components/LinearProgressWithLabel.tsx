import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const LinearProgressWithLabel = (
  props: LinearProgressProps & {
    value: number;
    label: string | undefined;
  }
) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%' }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>

      {props.label && (
        <Box sx={{ ml: 1, minWidth: 70 }}>
          <Typography variant="body2" color="text.secondary">
            {props.label}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LinearProgressWithLabel;
