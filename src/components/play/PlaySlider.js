import React, { useEffect, useState } from 'react';

import { Grid, Slider } from '@mui/material';

import { computeCorrectness } from '../context/utilities';

function PlaySlider({ values, response, setResponse, showCorrection }) {
  const min = values?.min;
  const max = values?.max;
  const [marks, setMarks] = useState([]);
  const [isCorrect, setIsCorrect] = useState();

  useEffect(() => {
    let newMarks = [
      { value: min, label: min },
      {
        value: max,
        label: max,
      },
    ];

    if (showCorrection) {
      const isCorrect = computeCorrectness(response, values);
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
  }, [showCorrection, response]);

  const computeColor = () => {
    return isCorrect ? 'success' : 'error';
  };

  return (
    <Grid container direction={'column'} sx={{ p: 2 }}>
      <Grid item sx={{ pb: 2 }}>
        <Slider
          aria-label="Custom marks"
          defaultValue={max - min}
          valueLabelDisplay="on"
          onChange={(e, val) => {
            setResponse(val);
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
}

export default PlaySlider;
