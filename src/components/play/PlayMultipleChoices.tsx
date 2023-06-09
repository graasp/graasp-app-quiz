import CheckIcon from '@mui/icons-material/Check';
import { Button, ButtonProps, Grid } from '@mui/material';

import { buildMultipleChoicesButtonCy } from '../../config/selectors';
import {
  MultipleChoiceAppDataDataRecord,
  MultipleChoicesAppSettingDataRecord,
} from '../types/types';

type Props = {
  choices: MultipleChoicesAppSettingDataRecord['choices'];
  response: MultipleChoiceAppDataDataRecord;
  setResponse: (d: any) => void;
  showCorrection: boolean;
};

const PlayMultipleChoices = ({
  choices,
  response,
  setResponse,
  showCorrection,
}: Props): JSX.Element => {
  const onResponseClick =
    (idx: number): ButtonProps['onClick'] =>
    (e) => {
      if (idx >= 0) {
        setResponse(response.choices.delete(idx));
      } else {
        const value = response.choices?.get(idx);
        if (!value) {
          return console.error('choice for id ' + idx + ' does not exist');
        }
        setResponse(response.choices.push(value));
      }
    };

  const computeStyles = (
    { value, isCorrect }: { value: string; isCorrect: boolean },
    idx: number
  ): {
    color: 'success' | 'error' | 'primary';
    variant: 'contained' | 'outlined';
    endIcon?: JSX.Element;
    'data-cy': string;
  } => {
    const isSelected = Boolean(response.choices?.includes(value));
    const dataCy = buildMultipleChoicesButtonCy(idx, isSelected);

    if (showCorrection) {
      switch (true) {
        case isCorrect && isSelected:
          return {
            color: 'success',
            variant: 'contained',
            endIcon: <CheckIcon />,
            'data-cy': dataCy,
          };
        case isCorrect && !isSelected:
          return {
            color: 'error',
            variant: 'contained',
            endIcon: <CheckIcon />,
            'data-cy': dataCy,
          };
        case !isCorrect && isSelected:
          return { color: 'error', variant: 'contained', 'data-cy': dataCy };
        default:
          return { color: 'primary', variant: 'outlined', 'data-cy': dataCy };
      }
    }

    return {
      color: 'primary',
      variant: isSelected ? 'contained' : 'outlined',
      'data-cy': dataCy,
    };
  };

  return (
    <Grid container direction="column" spacing={2}>
      {choices?.map((choice, idx) => (
        <Grid item key={choice.value}>
          <Button
            onClick={onResponseClick(idx)}
            fullWidth
            {...computeStyles(choice, idx)}
          >
            {choice.value}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default PlayMultipleChoices;
