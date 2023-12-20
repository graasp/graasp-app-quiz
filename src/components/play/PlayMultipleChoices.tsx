import CheckIcon from '@mui/icons-material/Check';
import { Button, ButtonProps, Typography } from '@mui/material';

import { buildMultipleChoicesButtonCy } from '../../config/selectors';
import {
  MultipleChoiceAppDataData,
  MultipleChoicesAppSettingData,
} from '../types/types';

type Props = {
  choices: MultipleChoicesAppSettingData['choices'];
  response: MultipleChoiceAppDataData;
  setResponse: (d: MultipleChoiceAppDataData['choices']) => void;
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
        const choicesWithoutChoiceIdx = [
          ...response.choices.slice(0, choiceIdx),
          ...response.choices.slice(choiceIdx + 1),
        ];
        setResponse(choicesWithoutChoiceIdx);
      } else {
        if (!value) {
          return console.error('choice for value ' + value + ' does not exist');
        }
        // TODO: check if the response.choices must be immutable or not
        setResponse([...(response.choices ?? []), value]);
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
    <>
      {choices?.map((choice, idx) => (
        <Button
          onClick={onResponseClick(choice.value)}
          fullWidth
          sx={{ mb: 1 }}
          {...computeStyles(choice, idx)}
        >
          {showCorrection &&
          choice.explanation &&
          response.choices?.find((c) => c === choice.value) ? (
            <>
              <Typography variant="body1">{choice.value}</Typography>
            </>
          ) : (
            <Typography variant="body1">{choice.value}</Typography>
          )}
        </Button>
      ))}
    </>
  );
};

export default PlayMultipleChoices;
