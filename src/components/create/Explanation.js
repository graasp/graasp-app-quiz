import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TextField, Typography } from '@mui/material';

const Explanation = ({ value: explanation, onChange }) => {
  const { t } = useTranslation();

  const value = useMemo(() => explanation ?? '', [explanation]);

  return (
    <>
      <Typography variant="h6">{t('Explanation')}</Typography>
      {
        <Typography variant="body1" mb={1}>
          {t(
            'Type here an explanation that will be displayed after an answer is submitted'
          )}
        </Typography>
      }
      <TextField
        fullWidth
        value={value}
        label={t('Explanation')}
        variant="outlined"
        onChange={(t) => onChange(t.target.value)}
        multiline
      />
    </>
  );
};

export default Explanation;
