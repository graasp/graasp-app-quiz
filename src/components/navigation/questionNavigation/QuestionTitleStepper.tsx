import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import {
  NUMBER_OF_ATTEMPTS_TEXT_CY,
  buildNavigationQuestionStatus,
} from '../../../config/selectors';
import { QUIZ_TRANSLATIONS } from '../../../langs/constants';
import { computeQuestionStatus } from './QuestionStep';
import { QuestionTitleStepperIcon } from './QuestionTitleStepperIcon';

type Props = {
  isCorrect: boolean;
  currentNumberOfAttempts: number;
  numberOfAttempts: number;
  questionIndex: number;
  darkIconColor?: boolean;
};

export const QuestionTitleStepper = ({
  isCorrect,
  currentNumberOfAttempts,
  numberOfAttempts,
  questionIndex,
  darkIconColor = true,
}: Props) => {
  const { t } = useTranslation();

  const renderText = () => {
    const hasTried = currentNumberOfAttempts > 0;
    const remainAttempts =
      currentNumberOfAttempts < numberOfAttempts && !isCorrect;

    if (!hasTried || remainAttempts) {
      return t(QUIZ_TRANSLATIONS.QUESTION_STEPPER_TITLE_ATTEMPTS, {
        current_attempts: currentNumberOfAttempts,
        max_attempts: numberOfAttempts,
      });
    }

    return t(QUIZ_TRANSLATIONS.QUESTION_STEPPER_TITLE_NO_MORE_ATTEMPTS);
  };

  return (
    <Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h6">Question {questionIndex}</Typography>
        {currentNumberOfAttempts > 0 && (
          // The stack is needed to attach a data-cy on the question icon.
          // The stack allow to keep the alignement with the text.
          <Stack
            data-cy={buildNavigationQuestionStatus(
              computeQuestionStatus({
                currentNumberOfAttempts,
                numberOfAttempts,
                isCorrect,
              })
            )}
          >
            <QuestionTitleStepperIcon
              currentNumberOfAttempts={currentNumberOfAttempts}
              totalNumberOfAttempts={numberOfAttempts}
              darkIconColor={darkIconColor}
              isCorrect={isCorrect}
            />
          </Stack>
        )}
      </Stack>

      <Typography data-cy={NUMBER_OF_ATTEMPTS_TEXT_CY}>
        {renderText()}
      </Typography>
    </Stack>
  );
};

export default QuestionTitleStepper;
