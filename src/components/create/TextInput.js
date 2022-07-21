import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Grid, TextField } from '@mui/material';

const TextInput = ({ text, onChangeData }) => {
  const { t } = useTranslation();

  const value = useMemo(() => text ?? '', [text]);

  return (
    <Grid container>
      <Grid item>
        <TextField
          value={value}
          placeholder={t('Enter Answer')}
          label={t('Answer')}
          variant="outlined"
          onChange={(t) => onChangeData(t.target.value)}
        />
      </Grid>
    </Grid>
  );
};

TextInput.handleSave = ({ saveFn, data, id, type }) => {
  saveFn({
    id,
    data,
    type,
  });
};

export default TextInput;
