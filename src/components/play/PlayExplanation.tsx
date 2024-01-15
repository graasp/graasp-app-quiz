import { useTranslation } from 'react-i18next';

import { Alert, AlertTitle, Typography } from '@mui/material';

import {
  EXPLANATION_PLAY_CY,
} from '../../config/selectors';
import { QuestionData } from '../types/types';

type Props = {
  currentQuestionData: QuestionData;
  showCorrection: boolean;
  showCorrectness: boolean;
  mt?: number;
};

const PlayExplanation = ({
  currentQuestionData,
  showCorrection,
  showCorrectness,
  mt,
}: Props) => {
  const { t } = useTranslation();

  const displayExplanation = showCorrection || showCorrectness;

  if (!currentQuestionData.explanation) {
    return null;
  }

  return displayExplanation ? (
    <Alert severity="info" sx={{ width: '100%', mt }}>
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
  ) : null;
};

export default PlayExplanation;
