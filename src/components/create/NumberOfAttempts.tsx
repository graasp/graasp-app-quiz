import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';

import {
  NUMBER_OF_ATTEMPTS_DECREASE_BTN_CY,
  NUMBER_OF_ATTEMPTS_INCREASE_BTN_CY,
  NUMBER_OF_ATTEMPTS_INPUT_CY,
} from '../../config/selectors';
import { QUIZ_TRANSLATIONS } from '../../langs/constants';

type Props = {
  initAttempts?: number;
  onChange?: (attempts: number) => void;
};

const NumberOfAttempts = ({ initAttempts, onChange }: Props) => {
  const { t } = useTranslation();
  const MIN_ATTEMPTS = 1;
  const UNSET_NUMBER = 0;
  
  const attemptsLabel = t(QUIZ_TRANSLATIONS.CREATE_VIEW_NUMBER_OF_ATTEMPTS);
  const [attempts, setAttempts] = useState<number>(MIN_ATTEMPTS);

  useEffect(() => {
    setAttempts(initAttempts && initAttempts > 0 ? initAttempts : MIN_ATTEMPTS);
  }, [initAttempts]);

  useEffect(() => {
    if (onChange && attempts >= MIN_ATTEMPTS) {
      onChange(attempts);
    }
  }, [attempts, onChange]);

  const increaseAttempts = () => setAttempts(attempts + 1);
  const decreaseAttempts = () => {
    if (attempts - 1 >= MIN_ATTEMPTS) {
      setAttempts(attempts - 1);
    }
  };

  const isValidInteger = (value: string) => {
    const newValue = Number(value);
    return Number.isInteger(newValue) && newValue >= MIN_ATTEMPTS;
  };

  const handleTextChanged = ({ target }: { target: { value: string } }) => {
    if (!target.value) {
      setAttempts(UNSET_NUMBER);
    } else if (isValidInteger(target.value)) {
      setAttempts(Number(target.value));
    }
  };

  const setMinIfNotValid = () => {
    if (attempts < MIN_ATTEMPTS) {
      setAttempts(MIN_ATTEMPTS);
    }
  };

  return (
    <FormControl sx={{ mt: 3, width: '25ch' }} variant="outlined">
      <InputLabel htmlFor="outlined-adornment-attempts">
        {attemptsLabel}
      </InputLabel>
      <OutlinedInput
        data-cy={NUMBER_OF_ATTEMPTS_INPUT_CY}
        id="outlined-adornment-attempts"
        onChange={handleTextChanged}
        // Allows the user to delete the number of attempts,
        // but check that when it has terminated, the number is valid.
        onBlur={() => setMinIfNotValid()}
        value={attempts}
        inputProps={{ min: 0, style: { textAlign: 'center' } }}
        startAdornment={
          <IconButton
            data-cy={NUMBER_OF_ATTEMPTS_DECREASE_BTN_CY}
            aria-label="decrease-attempts"
            onClick={decreaseAttempts}
          >
            <RemoveIcon />
          </IconButton>
        }
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              data-cy={NUMBER_OF_ATTEMPTS_INCREASE_BTN_CY}
              aria-label="increase-attempts"
              onClick={increaseAttempts}
            >
              <AddIcon />
            </IconButton>
          </InputAdornment>
        }
        label={attemptsLabel}
      />
    </FormControl>
  );
};

export default NumberOfAttempts;
