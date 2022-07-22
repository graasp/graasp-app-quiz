import React from 'react';
import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import { Fab, Step, StepLabel } from '@mui/material';

const buttonStyle = {
  maxHeight: '23px',
  minHeight: '23px',
  minWidth: '23px',
  maxWidth: '23px',
};

const addStyle = {
  maxHeight: '20px',
  minHeight: '20px',
  minWidth: '20px',
  maxWidth: '20px',
};

const PlusStep = ({ onClick }) => {
  const { t } = useTranslation();

  return (
    <Step key="plus">
      <StepLabel
        icon={
          <Fab
            color="success"
            aria-label={t('add')}
            justify-content="center"
            style={buttonStyle}
            onClick={onClick}
            align="center"
          >
            <AddIcon style={addStyle} />
          </Fab>
        }
      ></StepLabel>
    </Step>
  );
};

export default PlusStep;
