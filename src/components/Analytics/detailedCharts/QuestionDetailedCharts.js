import { useEffect, useState } from 'react';

import { CircularProgress, Typography } from '@mui/material';
import Box from '@mui/material/Box';

import { QUESTION_TYPES } from '../../../config/constants';
import { hooks } from '../../../config/queryClient';
import { getAllAppDataByQuestionId } from '../../context/utilities';
import AnswersDistributionMultipleChoices from './answersDistribution/AnswersDistributionMultipleChoices';

const QuestionDetailedCharts = ({
  maxWidth,
  questionDetailedMenuLabels,
  chartRefs,
  question,
}) => {
  const { data: responses, isLoading } = hooks.useAppData();

  const [appDataForQuestion, setAppDataForQuestion] = useState(
    getAllAppDataByQuestionId(responses, question.id)
  );

  useEffect(
    () =>
      setAppDataForQuestion(getAllAppDataByQuestionId(responses, question.id)),
    [responses, question]
  );

  const renderAnswerDistributionChart = () => {
    switch (question.data.type) {
      case QUESTION_TYPES.MULTIPLE_CHOICES:
        return (
          <AnswersDistributionMultipleChoices
            maxWidth={maxWidth}
            question={question}
            appDataForQuestion={appDataForQuestion}
          />
        );
      default:
        return <Typography> Error, question type unknown </Typography>;
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Box
        ref={(elm) =>
          (chartRefs.current[questionDetailedMenuLabels[0].label] = elm)
        }
        id={questionDetailedMenuLabels[0].link}
      >
        {renderAnswerDistributionChart()}
      </Box>
    </>
  );
};

export default QuestionDetailedCharts;
