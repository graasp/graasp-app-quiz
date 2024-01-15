import { Alert } from '@mui/material';

import { buildMultipleChoiceExplanationPlayCy } from '../../../config/selectors';

type Props = {
  showCorrectness: boolean;
  showCorrection: boolean;
  idx: number;
  explanation?: string;
  isSelected: boolean;
};

export const ChoiceHint = ({
  explanation,
  isSelected,
  showCorrection,
  showCorrectness,
  idx,
}: Props) => {
  return (
    showCorrection ||
    (showCorrectness && isSelected && explanation && (
      <Alert
        severity="info"
        data-cy={buildMultipleChoiceExplanationPlayCy(idx)}
      >
        {explanation}
      </Alert>
    ))
  );
};

export default ChoiceHint;
