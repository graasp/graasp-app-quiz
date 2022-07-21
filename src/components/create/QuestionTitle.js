import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Grid, TextField } from '@mui/material';

function QuestionTitle({ title, onChange }) {
  const { t } = useTranslation();

  const text = useMemo(() => title, [title]);

  return (
    <Grid item>
      <TextField
        value={text}
        placeholder={t('Enter Question')}
        label={t('Question')}
        variant="outlined"
        fullWidth
        onChange={onChange}
        InputLabelProps={{ shrink: Boolean(text) }}
      />
    </Grid>
  );
}

export default QuestionTitle;
