import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TextField } from '@mui/material';

import { TEXT_INPUT_FIELD_CY } from '../../config/selectors';

type Props = { text: string; onChangeData: (s: string) => void };

const TextInput = ({ text, onChangeData }: Props) => {
  const { t } = useTranslation();

  const value = useMemo(() => text ?? '', [text]);

  return (
    <TextField
      data-cy={TEXT_INPUT_FIELD_CY}
      fullWidth
      value={value}
      placeholder={t('Type your answer') ?? 'Type your answer'}
      label={t('Answer')}
      variant="outlined"
      onChange={(t) => onChangeData(t.target.value)}
    />
  );
};

export default TextInput;
