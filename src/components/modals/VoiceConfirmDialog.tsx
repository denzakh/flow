import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { VoiceCommand } from '../../types';
import { VOICE_TRANSLATIONS } from '../../constants';

interface VoiceConfirmDialogProps {
  open: boolean;
  command: VoiceCommand | null;
  language: keyof typeof VOICE_TRANSLATIONS;
  onConfirm: () => void;
  onCancel: () => void;
}

const VoiceConfirmDialog: React.FC<VoiceConfirmDialogProps> = ({
  open,
  command,
  language,
  onConfirm,
  onCancel,
}) => {
  if (!command) return null;

  const translations = VOICE_TRANSLATIONS[language];

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>
        {translations.confirmAdd.replace('{title}', command.entities.title || '')}
      </DialogTitle>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VoiceConfirmDialog;
