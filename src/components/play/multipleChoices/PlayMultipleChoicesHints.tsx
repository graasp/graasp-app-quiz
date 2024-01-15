import { QuestionType } from '../../../config/constants';
import { buildMultipleChoiceExplanationPlayCy } from '../../../config/selectors';
import { MultipleChoiceAppDataData, QuestionData } from '../../types/types';

type Props = {
  currentQuestionData: QuestionData;
  response?: MultipleChoiceAppDataData;
  showCorrection: boolean;
};

export const PlayMultipleChoicesHints = ({
  currentQuestionData,
  response,
  showCorrection,
}: Props) => {
  if (currentQuestionData.type !== QuestionType.MULTIPLE_CHOICES) {
    return null;
  }

  if (currentQuestionData.choices.some((c) => Boolean(c.explanation))) {
    return (
      <ul>
        {currentQuestionData.choices
          .filter(
            (c) =>
              Boolean(c.explanation) &&
              (showCorrection || response?.choices?.includes(c.value))
          )
          .map((c, idx) => (
            <li key={idx} data-cy={buildMultipleChoiceExplanationPlayCy(idx)}>
              {c.explanation}
            </li>
          ))}
      </ul>
    );
  }
};

export default PlayMultipleChoicesHints;
