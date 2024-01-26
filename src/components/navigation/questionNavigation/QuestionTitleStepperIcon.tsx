import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import theme from '../../../layout/theme';
import CircularProgressWithPath from '../../common/CircularProgressWithPath';

type Props = {
  currentNumberOfAttempts: number;
  totalNumberOfAttempts: number;
  darkIconColor: boolean;
  isCorrect: boolean;
};

export const QuestionTitleStepperIcon = ({
  currentNumberOfAttempts,
  totalNumberOfAttempts,
  darkIconColor,
  isCorrect,
}: Props) => {
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

  if (currentNumberOfAttempts < totalNumberOfAttempts) {
    return (
      <CircularProgressWithPath
        value={currentNumberOfAttempts}
        maxValue={totalNumberOfAttempts}
        htmlColor={errorColor}
        // margin is to align with other icons
        marginLeft={0.5}
      />
    );
  }

  return <CloseIcon htmlColor={errorColor} />;
};
