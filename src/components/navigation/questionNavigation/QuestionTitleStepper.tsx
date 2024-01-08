import { useTranslation } from 'react-i18next';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Stack, Typography } from '@mui/material';

import {
  NUMBER_OF_ATTEMPTS_TEXT_CY,
  buildNavigationQuestionStatus,
} from '../../../config/selectors';
import { QUIZ_TRANSLATIONS } from '../../../langs/constants';
import theme from '../../../layout/theme';
import CircularProgressWithPath from '../../common/CircularProgressWithPath';
import { computeQuestionStatus } from './QuestionStep';

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

  const renderIcon = () => {
    if (currentNumberOfAttempts === 0) {
      return null;
    }

    const successColor = darkIconColor
      ? theme.palette.success.dark
      : theme.palette.success.light;

    if (isCorrect) {
      return <CheckIcon htmlColor={successColor} className="success" />;
    }

    const errorColor = darkIconColor
      ? theme.palette.error.dark
      : theme.palette.error.light;

    if (currentNumberOfAttempts < numberOfAttempts) {
      return (
        <CircularProgressWithPath
          value={currentNumberOfAttempts}
          maxValue={numberOfAttempts}
          htmlColor={errorColor}
          className="error"
          // margin is to align with other icons
          marginLeft={0.5}
        />
      );
    }

    return <CloseIcon htmlColor={errorColor} className="error" />;
  };

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
          <span
            data-cy={buildNavigationQuestionStatus(
              computeQuestionStatus({
                currentNumberOfAttempts,
                numberOfAttempts,
                isCorrect,
              })
            )}
            style={{ display: 'flex' }}
          >
            {renderIcon()}
          </span>
        )}
      </Stack>

      <Typography data-cy={NUMBER_OF_ATTEMPTS_TEXT_CY}>
        {renderText()}
      </Typography>
    </Stack>
  );
};

export default QuestionTitleStepper;
