import { useTranslation } from 'react-i18next';

import { Alert, AlertTitle } from '@mui/material';

import { HINTS_PLAY_CY } from '../../config/selectors';
import { QUIZ_TRANSLATIONS } from '../../langs/constants';

type Props = {
  hints: string | undefined;
  maxAttempts: number;
  currentAttempts: number;
  isCorrect: boolean;
};

export const PlayHints = ({
  hints,
  maxAttempts,
  currentAttempts,
  isCorrect,
}: Props) => {
  const { t } = useTranslation();

  if (
    hints &&
    !isCorrect &&
    currentAttempts > 0 &&
    currentAttempts < maxAttempts
  ) {
    return (
      <Alert
        severity="info"
        sx={{ mt: 4, width: '100%' }}
        data-cy={HINTS_PLAY_CY}
      >
        <AlertTitle>{t(QUIZ_TRANSLATIONS.HINTS_ALERT_TITLE)}</AlertTitle>
        {hints}
      </Alert>
    );
  }

  return null;
};

export default PlayHints;
