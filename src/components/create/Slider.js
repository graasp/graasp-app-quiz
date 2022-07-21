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

const Slider = ({ data, onChangeData }) => {
  const { t } = useTranslation();

  const values = useMemo(() => data, [data]);

  const middleValue = (values?.max || 0) - (values?.min || 0);

  return (
    <div align="center">
      <Grid container direction={'column'} align="left">
        <Grid item sx={{ pb: 2 }}>
          <Typography variant="body1">
            {t('Slide the cursor to the correct value:')}
          </Typography>
        </Grid>
        <Grid item sx={{ pb: 1, pt: 4 }}>
          <MuiSlider
            value={values?.value ?? middleValue}
            valueLabelDisplay="on"
            onChange={(_, value) => {
              onChangeData({ value });
            }}
          />
        </Grid>
        <Grid item sx={{ pb: 2 }}>
          <Grid justifyContent="space-between" container>
            <Grid item xs={2}>
              <TextField
                value={values?.min ?? SLIDER_DEFAULT_MIN_VALUE}
                label={t('Minimum')}
                variant="outlined"
                type="number"
                onChange={(t) => {
                  onChangeData({ min: t.target.value });
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                value={values?.max ?? SLIDER_DEFAULT_MAX_VALUE}
                label={t('Maximum')}
                name="quiz text answer"
                variant="outlined"
                type="number"
                onChange={(t) => {
                  onChangeData({ max: t.target.value });
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

Slider.handleSave = ({ id, saveFn, data, type }) => {
  saveFn({
    data,
    id,
    type,
  });
};

export default Slider;
