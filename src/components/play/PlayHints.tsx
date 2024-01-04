import { useTranslation } from 'react-i18next';

import { Alert, AlertTitle } from '@mui/material';

import { HINTS_PLAY_CY } from '../../config/selectors';
import { QUIZ_TRANSLATIONS } from '../../langs/constants';

type Props = {
  hints: string | undefined;
  maxAttempts: number;
  currentAttempts: number;
  isCorrect: boolean;
  mt?: number;
};

export const PlayHints = ({
  hints,
  maxAttempts,
  currentAttempts,
  isCorrect,
  mt,
}: Props) => {
  const { t } = useTranslation();

  return (
    hints &&
    !isCorrect &&
    currentAttempts > 0 &&
    currentAttempts < maxAttempts && (
      <Alert
        severity="info"
        sx={{ mt: mt, width: '100%' }}
        data-cy={HINTS_PLAY_CY}
      >
        <AlertTitle>{t(QUIZ_TRANSLATIONS.HINTS_ALERT_TITLE)}</AlertTitle>
        {hints}
      </Alert>
    )
  );
};

export default PlayHints;
