import React from 'react';
import { useTranslation } from 'react-i18next';

import { TextField, TextFieldProps, Typography } from '@mui/material';

import { FILL_BLANKS_PLACEHOLDER_TEXT } from '../../config/constants';
import { FILL_BLANKS_TEXT_FIELD_CY } from '../../config/selectors';

type Props = { onChangeData: (s: string) => void; text: string };

const FillInTheBlanks = ({ onChangeData, text }: Props) => {
  const { t } = useTranslation();

  const onChange: TextFieldProps['onChange'] = (e) => {
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
        value={text}
        placeholder={FILL_BLANKS_PLACEHOLDER_TEXT}
      />
    </>
  );
};

export default FillInTheBlanks;
