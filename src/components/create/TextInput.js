import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TextField } from '@mui/material';

const TextInput = ({ text, onChangeData }) => {
  const { t } = useTranslation();

  const value = useMemo(() => text ?? '', [text]);

  return (
    <TextField
      fullWidth
      value={value}
      placeholder={t('Type your answer')}
      label={t('Answer')}
      variant="outlined"
      onChange={(t) => onChangeData(t.target.value)}
    />
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
