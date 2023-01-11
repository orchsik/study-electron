import Button from '@mui/material/Button';
import MaterialDialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useCallback } from 'react';
import { DialogType, useDialog } from './DialogProvider';

const Dialog = () => {
  const {
    state: { type, show, title, description },
    onInteractionEnd,
  } = useDialog();

  const onConfirmPressed = useCallback(() => {
    onInteractionEnd(true);
  }, [onInteractionEnd]);

  const onCancelPressed = useCallback(() => {
    onInteractionEnd(false);
  }, [onInteractionEnd]);

  return (
    <div>
      <MaterialDialog
        open={show}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={onConfirmPressed}>예</Button>
          {type === DialogType.CONFIRM ? (
            <Button onClick={onCancelPressed} autoFocus>
              아니오
            </Button>
          ) : null}
        </DialogActions>
      </MaterialDialog>
    </div>
  );
};

export { Dialog };
