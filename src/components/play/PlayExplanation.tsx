import React from 'react';
import { useTranslation } from 'react-i18next';

import { Grid, Typography } from '@mui/material';

import { QuestionType } from '../../config/constants';
import {
  EXPLANATION_PLAY_CY,
  buildMultipleChoiceExplanationPlayCy,
} from '../../config/selectors';
import { QuestionDataRecord } from '../types/types';

const PlayExplanation = ({
  currentQuestionData,
}: {
  currentQuestionData: QuestionDataRecord;
}) => {
  const { t } = useTranslation();

  const renderMultipleChoicesExplanations = () => {
    if (currentQuestionData.type !== QuestionType.MULTIPLE_CHOICES) {
      return null;
    }

    if (!currentQuestionData.choices.some((c) => Boolean(c.explanation))) {
      return (
        <ul>
          {currentQuestionData.choices.map((c, idx) => (
            <li key={idx} data-cy={buildMultipleChoiceExplanationPlayCy(idx)}>
              {c.explanation}
            </li>
          ))}
        </ul>
      );
    }
  };

  const mcExplanations = renderMultipleChoicesExplanations();

  if (!currentQuestionData.explanation || !mcExplanations) {
    return null;
  }

  return (
    <Grid item xs={12} width={'100%'}>
      <Typography variant="h6" mb={1}>
        {t('Explanations')}
      </Typography>
      <Typography variant="body1" mb={1} data-cy={EXPLANATION_PLAY_CY}>
        {currentQuestionData.explanation}

        {mcExplanations}
      </Typography>
    </Grid>
  );
};

export default PlayExplanation;
