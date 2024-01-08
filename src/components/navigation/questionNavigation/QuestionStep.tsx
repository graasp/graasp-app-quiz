import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Box, SxProps, Tooltip, Typography } from '@mui/material';

import { buildQuestionStepCy } from '../../../config/selectors';
import theme from '../../../layout/theme';
import CircularProgressWithPath from '../../common/CircularProgressWithPath';
import QuestionTitleStepper from './QuestionTitleStepper';

const DEFAULT_SIZE = 10;
const CONTAINER_SIZE = 27;
const SELECTED_SIZE = 23;
const DEFAULT_SHADOW = '0px 1px 1px rgb(0, 0, 0, 0.25)';
const DEFAULT_BORDER_WIDTH = '2px';
const DEFAULT_BORDER_STYLE = 'solid';
const BORDER_RADIUS = '50%';
const INCORRECT_BORDER_COLOR = theme.palette.error.dark;
const ATTEMPTS_BORDER_COLOR = theme.palette.error.dark;
const CORRECT_BORDER_COLOR = theme.palette.success.dark;

const DEFAULT_SX = {
  borderWidth: DEFAULT_BORDER_WIDTH,
  borderRadius: BORDER_RADIUS,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',

  transition: 'width 0.5s, height 0.5s, background 0.2s',

  '&:hover': {
    height: SELECTED_SIZE,
    width: SELECTED_SIZE,
    boxShadow: 'none',
    borderStyle: DEFAULT_BORDER_STYLE,
  },
};

export enum QuestionStepStyleKeys {
  DEFAULT = 'default',
  CORRECT = 'correct',
  INCORRECT = 'incorrect',
  REMAIN_ATTEMPTS = 'remain_attempts',
}

const QuestionStepStyle = {
  [QuestionStepStyleKeys.DEFAULT]: {
    borderStyle: DEFAULT_BORDER_STYLE,
    boxShadow: DEFAULT_SHADOW,
    background: '#CDCDCD',
    borderColor: '#504F4F',
  },
  [QuestionStepStyleKeys.CORRECT]: {
    borderColor: CORRECT_BORDER_COLOR,
  },
  [QuestionStepStyleKeys.INCORRECT]: {
    borderColor: INCORRECT_BORDER_COLOR,
  },
  [QuestionStepStyleKeys.REMAIN_ATTEMPTS]: {
    borderColor: ATTEMPTS_BORDER_COLOR,
  },
} as const;

const isSelectedStyle = {
  width: SELECTED_SIZE,
  height: SELECTED_SIZE,
  boxShadow: 'none',
  cursor: 'default',
  borderStyle: DEFAULT_BORDER_STYLE,
  background: 'none',
};

export type QuestionStatus = `${QuestionStepStyleKeys}`;

type Props = {
  qId: string;
  questionIdx: number;
  size?: number;
  isCorrect: boolean;
  currentNumberOfAttempts: number;
  numberOfAttempts: number;
  isSelected?: boolean;
  onClick: (qIdx: number) => void;
};

export const computeQuestionStatus = ({
  currentNumberOfAttempts,
  numberOfAttempts,
  isCorrect,
}: {
  currentNumberOfAttempts: number;
  numberOfAttempts: number;
  isCorrect: boolean;
}) => {
  switch (true) {
    case currentNumberOfAttempts === 0:
      return QuestionStepStyleKeys.DEFAULT;
    case isCorrect:
      return QuestionStepStyleKeys.CORRECT;
    case currentNumberOfAttempts < numberOfAttempts:
      return QuestionStepStyleKeys.REMAIN_ATTEMPTS;
    default:
      return QuestionStepStyleKeys.INCORRECT;
  }
};

export const QuestionStep = ({
  questionIdx,
  qId,
  size = DEFAULT_SIZE,
  currentNumberOfAttempts,
  numberOfAttempts,
  isCorrect,
  isSelected,
  onClick,
}: Props) => {
  const status = computeQuestionStatus({
    currentNumberOfAttempts,
    numberOfAttempts,
    isCorrect,
  });

  const sx: SxProps = {
    ...DEFAULT_SX,
    width: size,
    height: size,
    ...QuestionStepStyle[status],
    ...(isSelected ? isSelectedStyle : {}),
  };

  const renderTooltipTitle = () => {
    return isSelected ? (
      ''
    ) : (
      <QuestionTitleStepper
        isCorrect={isCorrect}
        currentNumberOfAttempts={currentNumberOfAttempts}
        numberOfAttempts={numberOfAttempts}
        questionIndex={questionIdx}
        darkIconColor={false}
      />
    );
  };

  const renderIcon = () => {
    switch (status) {
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
            maxValue={numberOfAttempts}
            htmlColor={ATTEMPTS_BORDER_COLOR}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      data-cy={buildQuestionStepCy(qId, status)}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ width: CONTAINER_SIZE, height: CONTAINER_SIZE }}
    >
      <Tooltip title={renderTooltipTitle()} arrow>
        <Box sx={sx} onClick={() => onClick(questionIdx - 1)}>
          {isSelected ? (
            <Typography color={QuestionStepStyle[status].borderColor}>
              {questionIdx}
            </Typography>
          ) : (
            renderIcon()
          )}
        </Box>
      </Tooltip>
    </Box>
  );
};

export default QuestionStep;
