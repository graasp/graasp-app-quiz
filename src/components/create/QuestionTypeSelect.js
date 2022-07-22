import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { DEFAULT_QUESTION_TYPE, QUESTION_TYPES } from '../../config/constants';

function QuestionTypeSelect({ value, onChange }) {
  const { t } = useTranslation();

  const type = useMemo(() => value ?? DEFAULT_QUESTION_TYPE, [value]);

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          {t('Answer Type')}
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={type}
          label={t('Answer Type')}
          onChange={(e) => onChange(e.target.value)}
        >
          <MenuItem value={QUESTION_TYPES.MULTIPLE_CHOICES}>
            {t('Multiple Choice')}
          </MenuItem>
          <MenuItem value={QUESTION_TYPES.TEXT_INPUT}>
            {t('Text Input')}
          </MenuItem>
          <MenuItem value={QUESTION_TYPES.SLIDER}>{t('Slider')}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default QuestionTypeSelect;
