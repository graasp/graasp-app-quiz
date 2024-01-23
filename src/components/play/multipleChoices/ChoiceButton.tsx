
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Typography } from '@mui/material';

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

const styleButton = ({
  color,
  isSelected,
  dataCy,
  endIcon,
}: {
  color: StatusColor;
  isSelected: boolean;
  dataCy: string;
  endIcon?: JSX.Element;
}) => {
  return {
    color,
    variant: isSelected ? 'contained' : 'outlined',
    endIcon,
    'data-cy': dataCy,
  } as const;
};

const computeDisabledSx = (choiceState: ChoiceState | undefined) => {
  const successColor = theme.palette.success.main;
  const errorColor = theme.palette.error.main;

  switch (choiceState) {
    case ChoiceState.CORRECT:
      return { backgroundColor: successColor, color: DEFAULT_DISABLED };
    case ChoiceState.INCORRECT:
      return { backgroundColor: errorColor, color: DEFAULT_DISABLED };
    case ChoiceState.MISSING:
      return { color: successColor, borderColor: successColor };
    default:
      return {};
  }
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
  const computeStyles = () => {
    let color: StatusColor = DEFAULT_COLOR;
    let icon;

    if (showState) {
      switch (choiceState) {
        case ChoiceState.CORRECT:
          color = CORRECT_COLOR;
          icon = <CheckIcon />;
          break;
        case ChoiceState.INCORRECT:
          color = INCORRECT_COLOR;
          icon = <CloseIcon />;
          break;
        case ChoiceState.MISSING:
          color = CORRECT_COLOR;
          icon = <CheckIcon />;
          break;
      }
    }

    return styleButton({
      color,
      isSelected: isSelected,
      dataCy: buildMultipleChoicesButtonCy(idx, isSelected),
      endIcon: icon,
    });
  };

  const handleClick = () => {
    if (isReadonly) {
      return;
    }
    onClick(choice.value);
  };

  return (
    <Button
      key={choice.value}
      onClick={handleClick}
      fullWidth
      sx={{
        '&.MuiButton-root': {
          '&.Mui-disabled': computeDisabledSx(choiceState),
        },
      }}
      {...computeStyles()}
      disabled={isReadonly}
    >
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {choice.value}
      </Typography>
    </Button>
  );
};

export default ChoiceButton;
