import { useTranslation } from 'react-i18next';

import { Grid, Typography } from '@mui/material';

import { QuestionType } from '../../config/constants';
import {
  EXPLANATION_PLAY_CY,
  buildMultipleChoiceExplanationPlayCy,
} from '../../config/selectors';
import { MultipleChoiceAppDataData, QuestionData } from '../types/types';

type Props = {
  currentQuestionData: QuestionData;
  response?: MultipleChoiceAppDataData;
  showCorrection: boolean;
  showCorrectness: boolean;
};

const PlayExplanation = ({
  currentQuestionData,
  response,
  showCorrection,
  showCorrectness,
}: Props) => {
  const { t } = useTranslation();

  const renderMultipleChoicesExplanations = () => {
    if (currentQuestionData.type !== QuestionType.MULTIPLE_CHOICES) {
      return null;
    }

    if (currentQuestionData.choices.some((c) => Boolean(c.explanation))) {
      return (
        <ul>
          {currentQuestionData.choices
            .filter(
              (c) =>
                Boolean(c.explanation) &&
                (showCorrection || response?.choices.includes(c.value))
            )
            .map((c, idx) => (
              <li key={idx} data-cy={buildMultipleChoiceExplanationPlayCy(idx)}>
                {c.explanation}
              </li>
            ))}
        </ul>
      );
    }
  };

  const mcExplanations = renderMultipleChoicesExplanations();
  const displayExplanation =
    showCorrection || (showCorrectness && mcExplanations);

  if (!currentQuestionData.explanation && !mcExplanations) {
    return null;
  }

  return displayExplanation ? (
    <Grid item xs={12} width={'100%'}>
      <Typography variant="h6" mb={1}>
        {t('Explanations')}
      </Typography>
      <Typography variant="body1" mb={1} data-cy={EXPLANATION_PLAY_CY}>
        {showCorrection && currentQuestionData.explanation}

        {mcExplanations}
      </Typography>
    </Grid>
  ) : null;
};

export default PlayExplanation;
