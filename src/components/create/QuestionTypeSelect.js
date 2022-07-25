import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { DEFAULT_QUESTION_TYPE, QUESTION_TYPES } from '../../config/constants';
import {
  CREATE_QUESTION_SELECT_TYPE_CY,
  buildQuestionTypeOption,
} from '../../config/selectors';

function QuestionTypeSelect({ value, onChange }) {
  const { t } = useTranslation();

  const type = useMemo(() => value ?? DEFAULT_QUESTION_TYPE, [value]);

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel>{t('Answer Type')}</InputLabel>
        <Select
          data-cy={CREATE_QUESTION_SELECT_TYPE_CY}
          value={type}
          label={t('Answer Type')}
          onChange={(e) => onChange(e.target.value)}
        >
          <MenuItem
            value={QUESTION_TYPES.MULTIPLE_CHOICES}
            data-cy={buildQuestionTypeOption(QUESTION_TYPES.MULTIPLE_CHOICES)}
          >
            {t('Multiple Choice')}
          </MenuItem>
          <MenuItem
            value={QUESTION_TYPES.TEXT_INPUT}
            data-cy={buildQuestionTypeOption(QUESTION_TYPES.TEXT_INPUT)}
          >
            {t('Text Input')}
          </MenuItem>
          <MenuItem
            value={QUESTION_TYPES.SLIDER}
            data-cy={buildQuestionTypeOption(QUESTION_TYPES.SLIDER)}
          >
            {t('Slider')}
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default QuestionTypeSelect;
