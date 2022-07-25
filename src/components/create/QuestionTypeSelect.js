import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import {
  DEFAULT_QUESTION_TYPE,
  DEFAULT_QUESTION_VALUES,
  QUESTION_TYPES_TO_NAME,
} from '../../config/constants';
import {
  CREATE_QUESTION_SELECT_TYPE_CY,
  buildQuestionTypeOption,
} from '../../config/selectors';

const QuestionTypeSelect = ({ value, onChange }) => {
  const { t } = useTranslation();

  const type = useMemo(() => value ?? DEFAULT_QUESTION_TYPE, [value]);

  const onTypeChange = (e) => {
    const type = e.target.value;
    onChange(DEFAULT_QUESTION_VALUES[type]);
  };

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel>{t('Answer Type')}</InputLabel>
        <Select
          data-cy={CREATE_QUESTION_SELECT_TYPE_CY}
          value={type}
          label={t('Answer Type')}
          onChange={onTypeChange}
        >
          {Object.entries(QUESTION_TYPES_TO_NAME).map(([key, value]) => (
            <MenuItem
              key={key}
              value={key}
              data-cy={buildQuestionTypeOption(key)}
            >
              {t(value)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default QuestionTypeSelect;
