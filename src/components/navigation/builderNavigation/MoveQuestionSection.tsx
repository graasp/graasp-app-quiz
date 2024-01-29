import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import {
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';

import {
  CREATE_VIEW_SELECT_POSITION_QUESTION_CY,
  buildQuestionPositionOption,
} from '../../../config/selectors';
import { QUIZ_TRANSLATIONS } from '../../../langs/constants';
import { QuizContext } from '../../context/QuizContext';

type Props = {
  qId: string;
};

export const MoveQuestionSection = ({ qId }: Props) => {
  const { t } = useTranslation();
  const { order, saveOrder, currentQuestion } = useContext(QuizContext);

  const qIdx = order.findIndex((questionId) => questionId === qId);

  const moveItemToPosition = <T,>(arr: T[], fromIdx: number, toIdx: number) => {
    const newArray = [...arr];
    const [item] = newArray.splice(fromIdx, 1);
    newArray.splice(toIdx, 0, item);
    return newArray;
  };

  const updateOrder = (event: SelectChangeEvent<number>) => {
    if (typeof event.target.value === 'number') {
      const toIdx = event.target.value;
      saveOrder(
        moveItemToPosition(order, qIdx, toIdx),
        currentQuestion.data.questionId
      );
    }
  };

  return (
    <>
      <Typography variant="h6">
        {t(QUIZ_TRANSLATIONS.QUESTION_POSITION_TITLE)}
      </Typography>
      <Typography variant="body1" mb={1}>
        {t(QUIZ_TRANSLATIONS.QUESTION_POSITION_EXPLANATION)}
      </Typography>
      <InputLabel id="question-position-helper-label">
        {t(QUIZ_TRANSLATIONS.QUESTION_POSITION_LABEL)}
      </InputLabel>
      <Select
        labelId="question-position-helper-label"
        value={qIdx}
        onChange={updateOrder}
        data-cy={CREATE_VIEW_SELECT_POSITION_QUESTION_CY}
      >
        {order.map((_, idx) => (
          <MenuItem value={idx} data-cy={buildQuestionPositionOption(idx)}>
            {idx + 1}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default MoveQuestionSection;
