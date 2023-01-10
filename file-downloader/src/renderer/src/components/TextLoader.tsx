import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import LinearProgress from '@mui/material/LinearProgress';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function TextLoader({
  loading,
  desc = '잠시만 기다려주세요.',
}: {
  loading: boolean;
  desc?: string;
}) {
  return (
    <div>
      <Modal
        keepMounted
        open={loading}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 id="parent-modal-title" style={{ textAlign: 'center' }}>
            {desc}
          </h2>
          <LinearProgress />
        </Box>
      </Modal>
    </div>
  );
}
