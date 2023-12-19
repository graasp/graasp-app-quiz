import { useEffect, useState } from 'react';

import { Grid, Slider } from '@mui/material';

import { PLAY_VIEW_SLIDER_CY } from '../../config/selectors';
import { computeCorrectness } from '../context/utilities';
import {
  SliderAppDataData,
  SliderAppSettingData,
} from '../types/types';

type Props = {
  values: SliderAppSettingData;
  response: SliderAppDataData;
  showCorrection: boolean;
  setResponse: (value: number) => void;
};

const PlaySlider = ({
  values,
  response,
  setResponse,
  showCorrection,
}: Props) => {
  console.log('Play slider values', values);
  console.log('Play slider response', response);
  console.log('Show correction', showCorrection)

  const min = values?.min;
  const max = values?.max;
  const [marks, setMarks] = useState<{ value: number; label: number; }[]>([]);
  const [isCorrect, setIsCorrect] = useState<null | boolean>();

  useEffect(() => {
    let newMarks = [
      { value: min, label: min },
      {
        value: max,
        label: max,
      },
    ];

    if (showCorrection) {
      const isCorrect = computeCorrectness(values, response);
      setIsCorrect(isCorrect);
      if (!isCorrect) {
        newMarks = [
          ...newMarks,
          {
            value: values.value,
            label: values.value,
          },
        ];
      }
    }

    setMarks(newMarks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCorrection, response, values]);

  const computeColor = () => {
    return isCorrect ? 'success' : 'error';
  };

  return (
    <Grid container direction="column" sx={{ p: 2 }}>
      <Grid item sx={{ pb: 2 }}>
        <Slider
          data-cy={PLAY_VIEW_SLIDER_CY}
          aria-label="Custom marks"
          value={response?.value ?? (max - min) / 2 + min}
          valueLabelDisplay="on"
          onChange={(_e, val) => {
            setResponse(val as number);
          }}
          marks={marks}
          min={min}
          max={max}
          // set color only if we show the correction
          {...(showCorrection ? { color: computeColor() } : {})}
        />
      </Grid>
    </Grid>
  );
};

export default PlaySlider;