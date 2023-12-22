import { useTranslation } from 'react-i18next';

import CheckIcon from '@mui/icons-material/Check';
import { Button, ButtonProps, Typography } from '@mui/material';

import { buildMultipleChoicesButtonCy } from '../../config/selectors';
import { QUIZ_TRANSLATIONS } from '../../langs/constants';
import theme from '../../layout/theme';
import {
  MultipleChoiceAppDataData,
  MultipleChoicesAppSettingData,
} from '../types/types';

type Props = {
  choices: MultipleChoicesAppSettingData['choices'];
  response: MultipleChoiceAppDataData;
  setResponse: (d: MultipleChoiceAppDataData['choices']) => void;
  showCorrection: boolean;
  showCorrectness: boolean;
  isReadonly: boolean;
};

const PlayMultipleChoices = ({
  choices,
  response,
  setResponse,
  showCorrection,
  showCorrectness,
  isReadonly,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const onResponseClick =
    (value: string): ButtonProps['onClick'] =>
    (_e) => {
      if (isReadonly) {
        return;
      }

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
        setResponse([...(response.choices ?? []), value]);
      }
    };

  const hasError =
    choices.reduce((acc, { value, isCorrect }) => {
      if (!showCorrectness) {
        return acc + 1;
      }
      const isSelected = Boolean(response.choices?.includes(value));
      return acc + (isSelected && isCorrect ? 1 : 0);
    }, 0) !== choices.length;

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

    if (showCorrection || (isSelected && showCorrectness)) {
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
      {choices?.map((choice, idx) => {
        const styleColor = computeStyles(choice, idx);
        const disabledColor =
          styleColor.color === 'success'
            ? theme.palette.success.main
            : styleColor.color === 'error'
            ? theme.palette.error.main
            : undefined;

        return (
          <Button
            onClick={onResponseClick(choice.value)}
            fullWidth
            sx={{
              mb: 1,
              '&.MuiButton-root': {
                '&.Mui-disabled': {
                  color: disabledColor ? 'whitesmoke' : undefined,
                  backgroundColor: disabledColor,
                },
              },
            }}
            {...styleColor}
            disabled={isReadonly}
          >
            {showCorrection &&
            choice.explanation &&
            response.choices?.some((c) => c === choice.value) ? (
              <>
                <Typography variant="body1">{choice.value}</Typography>
              </>
            ) : (
              <Typography variant="body1">{choice.value}</Typography>
            )}
          </Button>
        );
      })}

      {hasError && !showCorrection && (
        <Typography variant="body1" color="error">
          {t(QUIZ_TRANSLATIONS.MULTIPLE_CHOICE_NOT_CORRECT)}
        </Typography>
      )}
    </>
  );
};

export default PlayMultipleChoices;
