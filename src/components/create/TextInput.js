import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TextField } from '@mui/material';

import { TEXT_INPUT_FIELD_CY } from '../../config/selectors';

const TextInput = ({ text, onChangeData }) => {
  const { t } = useTranslation();

  const value = useMemo(() => text ?? '', [text]);

  return (
    <TextField
      data-cy={TEXT_INPUT_FIELD_CY}
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
