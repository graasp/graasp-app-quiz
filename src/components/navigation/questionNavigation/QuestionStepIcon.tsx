import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import CircularProgressWithPath from '../../common/CircularProgressWithPath';
import {
  ATTEMPTS_BORDER_COLOR,
  CORRECT_BORDER_COLOR,
  INCORRECT_BORDER_COLOR,
  QuestionStepStyleKeys,
} from './QuestionStep';

type Props = {
  questionStatus: QuestionStepStyleKeys;
  currentNumberOfAttempts: number;
  totalNumberOfAttempts: number;
};

export const QuestionStepIcon = ({
  questionStatus,
  currentNumberOfAttempts,
  totalNumberOfAttempts,
}: Props) => {
  switch (questionStatus) {
    case QuestionStepStyleKeys.DEFAULT:
      return null;
    case QuestionStepStyleKeys.CORRECT:
      return <CheckIcon htmlColor={CORRECT_BORDER_COLOR} />;
    case QuestionStepStyleKeys.INCORRECT:
      return <CloseIcon htmlColor={INCORRECT_BORDER_COLOR} />;
    case QuestionStepStyleKeys.REMAIN_ATTEMPTS:
      return (
        <CircularProgressWithPath
          value={currentNumberOfAttempts}
          maxValue={totalNumberOfAttempts}
          htmlColor={ATTEMPTS_BORDER_COLOR}
        />
      );
    default:
      return null;
  }
};

export default QuestionStepIcon;
