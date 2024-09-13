import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Checkbox, Typography } from '@mui/material';

import { buildMultipleChoicesButtonCy } from '../../../config/selectors';
import theme from '../../../layout/theme';
import {
  ChoiceState,
  MultipleChoicesChoice,
  StatusColor,
} from '../../types/types';

const DEFAULT_COLOR = 'primary';
const CORRECT_COLOR = 'success';
const INCORRECT_COLOR = 'error';
const DEFAULT_DISABLED = 'whitesmoke';
const SUCCESS_COLOR = theme.palette.success.main;
const ERROR_COLOR = theme.palette.error.main;
const PRIMARY_COLOR = theme.palette.primary.main;

const styleButton = ({
  color,
  dataCy,
  endIcon,
}: {
  color: StatusColor;
  dataCy: string;
  endIcon?: JSX.Element;
}) =>
  ({
    color,
    endIcon,
    variant: 'outlined',
    'data-cy': dataCy,
  } as const);

const computeDisabledSx = (choiceState: ChoiceState | undefined) => {
  switch (choiceState) {
    case ChoiceState.CORRECT:
    case ChoiceState.MISSING:
      return { borderColor: SUCCESS_COLOR, color: SUCCESS_COLOR };
    case ChoiceState.INCORRECT:
      return { borderColor: ERROR_COLOR, color: ERROR_COLOR };
    default:
      return {};
  }
};

const computeStyles = ({
  isSelected,
  idx,
  showState,
  choiceState,
}: {
  isSelected: boolean;
  idx: number;
  showState: boolean;
  choiceState: number;
}) => {
  const btn = {
    color: DEFAULT_COLOR,
    isSelected: isSelected,
    dataCy: buildMultipleChoicesButtonCy(idx, isSelected),
  } as const; // const is needed to allow color strings

  if (showState) {
    switch (choiceState) {
      case ChoiceState.CORRECT:
      case ChoiceState.MISSING:
        return styleButton({
          ...btn,
          color: CORRECT_COLOR,
          endIcon: <CheckIcon />,
        });
      case ChoiceState.INCORRECT:
        return styleButton({
          ...btn,
          color: INCORRECT_COLOR,
          endIcon: <CloseIcon />,
        });
    }
  }

  return styleButton(btn);
};

const computeCheckboxSx = ({
  showState,
  choiceState,
}: {
  showState: boolean;
  choiceState: number;
}) => {
  let borderColor = PRIMARY_COLOR;

  if (showState) {
    switch (choiceState) {
      case ChoiceState.CORRECT:
      case ChoiceState.MISSING:
        borderColor = SUCCESS_COLOR;
        break;
      case ChoiceState.INCORRECT:
        borderColor = ERROR_COLOR;
        break;
      default:
        borderColor = DEFAULT_DISABLED;
    }
  }

  return {
    '&.Mui-checked': {
      color: borderColor,
    },
    color: borderColor,
  };
};

type Props = {
  choice: MultipleChoicesChoice;
  choiceState: ChoiceState;
  idx: number;
  isSelected: boolean;
  isReadonly: boolean;
  showState: boolean;
  onClick: (value: string) => void;
};

export const ChoiceButton = ({
  choice,
  choiceState,
  idx,
  isSelected,
  isReadonly,
  showState,
  onClick,
}: Props) => {
  const handleClick = () => {
    if (isReadonly) {
      return;
    }
    onClick(choice.value);
  };

  return (
    <Button
      key={choice.value}
      startIcon={
        <Checkbox
          checked={isSelected}
          sx={computeCheckboxSx({ showState, choiceState })}
        />
      }
      onClick={handleClick}
      fullWidth
      sx={{
        '&.MuiButton-root': {
          '&.Mui-disabled': computeDisabledSx(choiceState),
        },
      }}
      {...computeStyles({ isSelected, idx, choiceState, showState })}
      disabled={isReadonly}
    >
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {choice.value}
      </Typography>
    </Button>
  );
};

export default ChoiceButton;
