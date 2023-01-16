import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import MaterialDialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import notify from 'renderer/src/utils/toast';
import { DialogType, useDialog } from './DialogProvider';

const Dialog = () => {
  const {
    state: { type, show, title, description },
    onInteractionEnd,
  } = useDialog();

  const [fieldValue, setfieldValue] = useState('');

  useEffect(() => {
    setfieldValue('');
  }, [show]);

  const onChangeTextField = (event: ChangeEvent<HTMLInputElement>) => {
    setfieldValue(event.target.value);
  };

  const onConfirmPressed = useCallback(() => {
    if (type === DialogType.PROMPT && fieldValue === '') {
      notify({
        content: '텍스트 필드를 일력해주세요.',
        type: 'warning',
      });
      return;
    }

    onInteractionEnd(fieldValue || true);
  }, [type, fieldValue, onInteractionEnd]);

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
          {type === DialogType.PROMPT && (
            <TextField
              autoFocus
              fullWidth
              margin="dense"
              variant="standard"
              value={fieldValue}
              onChange={onChangeTextField}
            />
          )}
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
