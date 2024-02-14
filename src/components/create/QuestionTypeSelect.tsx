import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from '@mui/material';

import {
  DEFAULT_QUESTION_TYPE,
  DEFAULT_QUESTION_VALUES,
  QuestionType,
  QuestionType_TO_NAME,
} from '../../config/constants';
import {
  CREATE_QUESTION_SELECT_TYPE_CY,
  buildQuestionTypeOption,
} from '../../config/selectors';
import { QuestionData } from '../types/types';

type Props = {
  value: QuestionType;
  onChange: (d: QuestionData) => void;
};

const QuestionTypeSelect = ({ value, onChange }: Props) => {
  const { t } = useTranslation();

  const type = useMemo(() => value ?? DEFAULT_QUESTION_TYPE, [value]);

  const onTypeChange: SelectProps['onChange'] = (e) => {
    const value = e.target.value as QuestionType;
    const defaultQuestionValues = DEFAULT_QUESTION_VALUES[
      value
    ] as QuestionData;
    onChange(defaultQuestionValues);
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
          {Object.entries(QuestionType_TO_NAME).map(([key, value]) => (
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
