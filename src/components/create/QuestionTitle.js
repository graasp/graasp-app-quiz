import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Grid, TextField } from '@mui/material';

import { CREATE_QUESTION_TITLE_CY } from '../../config/selectors';

function QuestionTitle({ title, onChange }) {
  const { t } = useTranslation();

  const text = useMemo(() => title ?? '', [title]);

  return (
    <Grid item>
      <TextField
        data-cy={CREATE_QUESTION_TITLE_CY}
        value={text}
        placeholder={t('Enter Question')}
        label={t('Question')}
        variant="outlined"
        fullWidth
        onChange={(e) => onChange(e.target.value)}
        InputLabelProps={{ shrink: Boolean(text) }}
      />
    </Grid>
  );
}

export default QuestionTitle;
