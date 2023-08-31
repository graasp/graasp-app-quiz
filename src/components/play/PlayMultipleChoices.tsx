import { List } from 'immutable';

import CheckIcon from '@mui/icons-material/Check';
import { Button, ButtonProps, Grid, Typography } from '@mui/material';

import {
  buildMultipleChoiceExplanationPlayCy,
  buildMultipleChoicesButtonCy,
} from '../../config/selectors';
import {
  MultipleChoiceAppDataDataRecord,
  MultipleChoicesAppSettingDataRecord,
} from '../types/types';

type Props = {
  choices: MultipleChoicesAppSettingDataRecord['choices'];
  response: MultipleChoiceAppDataDataRecord;
  setResponse: (d: MultipleChoiceAppDataDataRecord['choices']) => void;
  showCorrection: boolean;
};

const PlayMultipleChoices = ({
  choices,
  response,
  setResponse,
  showCorrection,
}: Props): JSX.Element => {
  const onResponseClick =
    (value: string): ButtonProps['onClick'] =>
    (e) => {
      const choiceIdx = response.choices?.findIndex(
        (choice) => choice === value
      );
      if (choiceIdx >= 0) {
        setResponse(response.choices.delete(choiceIdx));
      } else {
        if (!value) {
          return console.error('choice for value ' + value + ' does not exist');
        }
        setResponse((response.choices ?? List()).push(value));
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
        <Grid item key={choice.value + '-' + idx}>
          <Button
            onClick={onResponseClick(choice.value)}
            fullWidth
            {...computeStyles(choice, idx)}
          >
            {showCorrection &&
            choice.explanation &&
            response.choices?.contains(choice.value) ? (
              <Grid container direction="column">
                <Grid item>
                  <Typography variant="body1">{choice.value}</Typography>
                </Grid>
                <Grid item>
                  <Typography
                    variant="caption"
                    data-cy={buildMultipleChoiceExplanationPlayCy(idx)}
                  >
                    {choice.explanation}
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="body1">{choice.value}</Typography>
            )}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default PlayMultipleChoices;
