import { useEffect, useState } from 'react';

import { Grid, Slider } from '@mui/material';

import { PLAY_VIEW_SLIDER_CY } from '../../config/selectors';
import theme from '../../layout/theme';
import { SliderAppDataData, SliderAppSettingData } from '../types/types';

type Props = {
  values: SliderAppSettingData;
  response: SliderAppDataData;
  showCorrection: boolean;
  showCorrectness: boolean;
  isCorrect: boolean;
  isReadonly: boolean;
  setResponse: (value: number) => void;
};

const PlaySlider = ({
  values,
  response,
  setResponse,
  showCorrection,
  showCorrectness,
  isReadonly,
  isCorrect,
}: Props) => {
  const min = values?.min;
  const max = values?.max;
  const defaultValue = Math.round((max - min) / 2 + min);
  const [marks, setMarks] = useState<{ value: number; label: number }[]>([]);

  const sliderSx = {
    '&.MuiSlider-root': {
      '&.Mui-disabled': {
        color: isCorrect
          ? theme.palette.success.main
          : theme.palette.error.main,
      },
    },
  };

  useEffect(() => {
    // Notify with the default value if response's value is null.
    // Without it, if the user click on submit without changing the slider's value,
    // the response's value will be undefined instead of defaultValue displayed on the screen.
    if (!response.value) {
      setResponse(defaultValue);
    }

    let newMarks = [
      { value: min, label: min },
      {
        value: max,
        label: max,
      },
    ];

    if (!isCorrect && showCorrection) {
      newMarks = [
        ...newMarks,
        {
          value: values.value,
          label: values.value,
        },
      ];
    }

    setMarks(newMarks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCorrection, response.value, values]);

  const computeColor = () => {
    return isCorrect ? 'success' : 'error';
  };

  return (
    <Grid container direction="column" sx={{ p: 2 }}>
      <Grid item sx={{ pb: 2 }}>
        <Slider
          data-cy={PLAY_VIEW_SLIDER_CY}
          aria-label="Custom marks"
          value={response?.value ?? defaultValue}
          valueLabelDisplay="on"
          onChange={(_e, val) => {
            if (!isReadonly) {
              setResponse(val as number);
            }
          }}
          marks={marks}
          min={min}
          max={max}
          // set color only if we show the correction
          {...(showCorrection || showCorrectness
            ? { color: computeColor() }
            : {})}
          disabled={isReadonly}
          sx={sliderSx}
        />
      </Grid>
    </Grid>
  );
};

export default PlaySlider;
