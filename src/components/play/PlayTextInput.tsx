import { useTranslation } from 'react-i18next';

import CheckIcon from '@mui/icons-material/Check';
import { TextField } from '@mui/material';

import { buildPlayViewTextInputCy } from '../../config/selectors';
import theme from '../../layout/theme';
import { TextAppDataData, TextAppSettingData } from '../types/types';

type Props = {
  values: TextAppSettingData;
  response: TextAppDataData;
  showCorrection: boolean;
  lastUserAnswer?: TextAppDataData;
  isCorrect: boolean;
  isReadonly: boolean;
  setResponse: (text: string) => void;
};

const PlayTextInput = ({
  values,
  response,
  showCorrection,
  lastUserAnswer,
  isCorrect,
  isReadonly,
  setResponse,
}: Props) => {
  const { t } = useTranslation();

  const showCorrectness = response.text === lastUserAnswer?.text;

  const textInputColor =
    showCorrectness || showCorrection
      ? isCorrect
        ? theme.palette.success.main
        : theme.palette.error.main
      : undefined;

  const textInputDisabledSx = {
    // define the color of the label when disabled
    '& .MuiInputLabel-root.Mui-disabled': {
      WebkitTextFillColor: textInputColor,
      color: textInputColor,
    },
    // define the border color when disabled
    '& .MuiInputBase-root.Mui-disabled': {
      '& > fieldset': {
        borderColor: textInputColor,
      },
    },
    // define the text color when disabled
    '& .MuiOutlinedInput-input.Mui-disabled': {
      WebkitTextFillColor: textInputColor,
      color: textInputColor,
    },
  };

  const computeColor = (showColors: boolean) =>
    showColors ? (isCorrect ? 'success' : 'error') : undefined;

  return (
    <TextField
      data-cy={buildPlayViewTextInputCy(
        showCorrectness || showCorrection ? isCorrect : undefined
      )}
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
      color={computeColor(showCorrectness || showCorrection)}
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
      sx={textInputDisabledSx}
    />
  );
};

export default PlayTextInput;
