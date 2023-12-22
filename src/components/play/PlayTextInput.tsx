import { useTranslation } from 'react-i18next';

import CheckIcon from '@mui/icons-material/Check';
import { TextField } from '@mui/material';

import { PLAY_VIEW_TEXT_INPUT_CY } from '../../config/selectors';
import theme from '../../layout/theme';
import { TextAppDataData, TextAppSettingData } from '../types/types';

type Props = {
  values: TextAppSettingData;
  response: TextAppDataData;
  showCorrection: boolean;
  showCorrectness: boolean;
  isCorrect: boolean;
  isReadonly: boolean;
  setResponse: (text: string) => void;
};

const PlayTextInput = ({
  values,
  response,
  showCorrection,
  showCorrectness,
  isCorrect,
  isReadonly,
  setResponse,
}: Props) => {
  const { t } = useTranslation();

  const textInputColor = () =>
    showCorrectness || showCorrection
      ? isCorrect
        ? 'green'
        : theme.palette.error.main
      : undefined;

  const computeColor = () => {
    return isCorrect ? 'success' : 'error';
  };

  return (
    <TextField
      data-cy={PLAY_VIEW_TEXT_INPUT_CY}
      fullWidth
      value={response.text ?? ''}
      placeholder={t('Type your answer')}
      helperText={
        showCorrection &&
        !isCorrect &&
        values.text &&
        t('Correct Answer', { answer: values.text })
      }
      label={t('Answer')}
      variant="outlined"
      onChange={(t) => {
        if (!isReadonly) {
          setResponse(t.target.value);
        }
      }}
      color={showCorrectness || showCorrection ? computeColor() : undefined}
      InputProps={{
        endAdornment: showCorrection && isCorrect && (
          <CheckIcon color="success" />
        ),
      }}
      // set error prop only if we show the correction
      {...(showCorrectness || showCorrection
        ? {
            error: !isCorrect,
          }
        : {})}
      disabled={isReadonly}
      // TODO: check why the text color is not set for first question
      sx={{
        '& .Mui-disabled': {
          WebkitTextFillColor: textInputColor(),
        },
        '& .MuiInputBase-root.Mui-disabled': {
          color: textInputColor(),
          WebkitTextFillColor: textInputColor(),
          '& > fieldset': {
            borderColor: textInputColor(),
          },
        },
      }}
    />
  );
};

export default PlayTextInput;
