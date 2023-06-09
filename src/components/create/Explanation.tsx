import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TextField, Typography } from '@mui/material';

import { EXPLANATION_CY } from '../../config/selectors';

type Props = { value?: string; onChange: (s: string) => void };

const Explanation = ({ value: explanation, onChange }: Props) => {
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
        data-cy={EXPLANATION_CY}
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
