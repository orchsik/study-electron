import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { CircularProgress } from '@mui/material';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

export default function Loader({ loading }: { loading: boolean }) {
  return (
    <div>
      <Modal
        keepMounted
        open={loading}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <CircularProgress />
        </Box>
      </Modal>
    </div>
  );
}
