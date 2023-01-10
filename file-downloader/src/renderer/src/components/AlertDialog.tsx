import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({
  alerting,
  title,
  message,
  onConfirmPressed,
  onCancelPressed,
}: {
  alerting: boolean;
  title: string;
  message?: string;
  onConfirmPressed?: () => void;
  onCancelPressed?: () => void;
}) {
  return (
    <div>
      <Dialog
        open={alerting}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={onConfirmPressed}>예</Button>
          {onCancelPressed ? (
            <Button onClick={onCancelPressed} autoFocus>
              아니오
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </div>
  );
}
