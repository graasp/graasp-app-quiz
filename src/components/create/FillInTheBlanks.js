import React from 'react';
import { useTranslation } from 'react-i18next';

import { TextField, Typography } from '@mui/material';

import { FILL_BLANKS_DEFAULT_TEXT } from '../../config/constants';
import { FILL_BLANKS_TEXT_FIELD_CY } from '../../config/selectors';

const FillInTheBlanks = ({ onChangeData }) => {
  const { t } = useTranslation();

  const onChange = (e) => {
    onChangeData(e.target.value);
  };

  return (
    <>
      <Typography variant="body1" mb={2}>
        {t(
          "Write your text and mark the blanks with '<' and '>' (for example <blank>)"
        )}
      </Typography>
      <TextField
        data-cy={FILL_BLANKS_TEXT_FIELD_CY}
        label={t('Text')}
        fullWidth
        rows={4}
        multiline
        onChange={onChange}
        placeholder={FILL_BLANKS_DEFAULT_TEXT}
      />
    </>
  );
};

export default FillInTheBlanks;
