import React from 'react';
import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import { Fab, Step, StepLabel } from '@mui/material';

const buttonStyle = {
  height: '23px',
  minHeight: '23px',
  width: '23px',
};

const PlusStep = ({ onClick }) => {
  const { t } = useTranslation();

  return (
    <Step key="plus">
      <StepLabel
        icon={
          <Fab
            color="success"
            aria-label={t('Add new question')}
            justify-content="center"
            style={buttonStyle}
            onClick={onClick}
            align="center"
          >
            <AddIcon />
          </Fab>
        }
      ></StepLabel>
    </Step>
  );
};

export default PlusStep;
