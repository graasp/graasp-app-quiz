import { useTranslation } from 'react-i18next';

import { Alert, AlertTitle, Typography } from '@mui/material';

import { EXPLANATION_PLAY_CY } from '../../config/selectors';
import { QuestionData } from '../types/types';

type Props = {
  currentQuestionData: QuestionData;
  showCorrection: boolean;
};

const PlayExplanation = ({ currentQuestionData, showCorrection }: Props) => {
  const { t } = useTranslation();

  if (!currentQuestionData.explanation || !showCorrection) {
    return null;
  }

  return (
    <Alert severity="info" sx={{ width: '100%', mt: 4 }}>
      <AlertTitle>
        {' '}
        <Typography variant="h6" mb={1}>
          {t('Explanations')}
        </Typography>
      </AlertTitle>

      <Typography variant="body1" mb={1} data-cy={EXPLANATION_PLAY_CY}>
        {showCorrection && currentQuestionData.explanation}
      </Typography>
    </Alert>
  );
};

export default PlayExplanation;
