import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Grid,
  Slider as MuiSlider,
  TextField,
  Typography,
} from '@mui/material';

import {
  SLIDER_DEFAULT_MAX_VALUE,
  SLIDER_DEFAULT_MIN_VALUE,
} from '../../config/constants';
import {
  SLIDER_CY,
  SLIDER_MAX_FIELD_CY,
  SLIDER_MIN_FIELD_CY,
} from '../../config/selectors';

const Slider = ({ data, onChangeData }) => {
  const { t } = useTranslation();

  const values = useMemo(
    () => ({
      min: SLIDER_DEFAULT_MIN_VALUE,
      max: SLIDER_DEFAULT_MAX_VALUE,
      ...data,
    }),
    [data]
  );

  const middleValue = values.max - values.min;

  return (
    <div align="center">
      <Grid container direction={'column'} align="left">
        <Grid item sx={{ pb: 2 }}>
          <Typography variant="body1">
            {t('Slide the cursor to the correct value')}
          </Typography>
        </Grid>
        <Grid item sx={{ pb: 1, pt: 4 }}>
          <MuiSlider
            data-cy={SLIDER_CY}
            value={values?.value ?? middleValue}
            valueLabelDisplay="on"
            min={values.min}
            max={values.max}
            onChange={(_, value) => {
              onChangeData({ value });
            }}
          />
        </Grid>
        <Grid item sx={{ pb: 2 }}>
          <Grid justifyContent="space-between" container>
            <Grid item xs={2}>
              <TextField
                data-cy={SLIDER_MIN_FIELD_CY}
                value={values?.min}
                label={t('Minimum')}
                variant="outlined"
                type="number"
                onChange={(t) => {
                  console.log(t.target.value);
                  onChangeData({ min: parseInt(t.target.value) });
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                value={values?.max}
                data-cy={SLIDER_MAX_FIELD_CY}
                label={t('Maximum')}
                name="quiz text answer"
                variant="outlined"
                type="number"
                onChange={(t) => {
                  onChangeData({ max: parseInt(t.target.value) });
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Slider;
