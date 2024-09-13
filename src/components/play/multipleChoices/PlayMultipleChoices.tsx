import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { buildMultipleChoiceHintPlayCy } from '../../../config/selectors';
import { QUIZ_TRANSLATIONS } from '../../../langs/constants';
import {
  ChoiceState,
  MultipleChoiceAppDataData,
  MultipleChoicesAppSettingData,
  MultipleChoicesChoice,
} from '../../types/types';
import ChoiceButton from './ChoiceButton';

const computeChoiceState = (
  { value, isCorrect }: MultipleChoicesChoice,
  userChoices: string[] | undefined,
  showCorrection: boolean
) => {
  const isSelected = Boolean(userChoices?.includes(value));

  switch (true) {
    case isCorrect && isSelected:
      return ChoiceState.CORRECT;
    case isCorrect && !isSelected:
      return showCorrection ? ChoiceState.MISSING : ChoiceState.UNSELECTED;
    case !isCorrect && isSelected:
      return ChoiceState.INCORRECT;
    case !isCorrect && !isSelected:
      return ChoiceState.UNSELECTED;
    default:
      throw new Error(
        `The state is unkown for isCorrect = ${isCorrect} and isSelected = ${isSelected}.`
      );
  }
};

enum ElementType {
  Answer,
  Hint,
}

type AnswerDataType = {
  idx: number;
  choice: MultipleChoicesChoice;
  elementType: ElementType.Answer;
};
type HintDataType = {
  idx: number;
  hint: string;
  elementType: ElementType.Hint;
};
type DataType = AnswerDataType | HintDataType;
type DataTypes = DataType | DataType[];

const choiceToAnswer = (
  choice: MultipleChoicesChoice,
  idx: number
): AnswerDataType => ({
  idx,
  choice,
  elementType: ElementType.Answer,
});

const choiceToHint = (choiceIdx: number, hint: string): HintDataType => ({
  hint,
  idx: choiceIdx,
  elementType: ElementType.Hint,
});

const isChoiceSelected = (
  choices: string[] | undefined,
  choice: MultipleChoicesChoice
) => Boolean(choices?.includes(choice.value));

export const showHint = (
  isSelected: boolean,
  showCorrectness: boolean,
  showCorrection: boolean,
  choiceState: ChoiceState
) =>
  isSelected &&
  (showCorrectness || showCorrection) &&
  choiceState === ChoiceState.INCORRECT;

type Props = {
  choices: MultipleChoicesAppSettingData['choices'];
  response: MultipleChoiceAppDataData;
  lastUserAnswer?: MultipleChoiceAppDataData;
  showCorrection: boolean;
  showCorrectness: boolean;
  numberOfRetry: number;
  setResponse: (d: MultipleChoiceAppDataData['choices']) => void;
};

const PlayMultipleChoices = ({
  choices,
  response,
  lastUserAnswer,
  showCorrection,
  showCorrectness,
  numberOfRetry,
  setResponse,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const [elements, setElements] = useState<DataTypes[]>([]);
  const isReadonly = showCorrection || showCorrectness;
  const choiceStates = choices.map((choice) =>
    computeChoiceState(choice, lastUserAnswer?.choices, showCorrection)
  );
  const showError =
    (showCorrection &&
      choiceStates.some(
        (state) =>
          state === ChoiceState.INCORRECT || state === ChoiceState.MISSING
      )) ||
    (showCorrectness && !showCorrection);

  useEffect(() => {
    const answers = choices.map((c, idx) => choiceToAnswer(c, idx));
    // set the "gaming" view
    if (!showCorrection && !showCorrectness) {
      setElements(answers);
    } else {
      // set the "correctness" or "correction" view
      setElements(
        answers.map((answer, idx) => {
          const hint = answer.choice.explanation;
          const displayHint = showHint(
            isChoiceSelected(response.choices, answer.choice),
            showCorrectness,
            showCorrection,
            choiceStates[idx]
          );

          return displayHint && hint
            ? [answer, choiceToHint(answer.idx, hint)]
            : answer;
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choices, showCorrection, showCorrectness]);

  // Reset the user's selection at each retry.
  useEffect(() => {
    setResponse([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberOfRetry]);

  const onResponseClick = (value: string) => {
    const choiceIdx = response.choices?.findIndex((choice) => choice === value);

    if (choiceIdx >= 0) {
      const choicesWithoutChoiceIdx = [
        ...response.choices.slice(0, choiceIdx),
        ...response.choices.slice(choiceIdx + 1),
      ];
      setResponse(choicesWithoutChoiceIdx);
    } else {
      setResponse([...(response.choices ?? []), value]);
    }
  };

  const renderElement = (el: DataType) => {
    switch (el.elementType) {
      case ElementType.Answer: {
        const isSelected = isChoiceSelected(response.choices, el.choice);
        return (
          <ChoiceButton
            idx={el.idx}
            choice={el.choice}
            choiceState={choiceStates[el.idx]}
            isReadonly={isReadonly}
            isSelected={isSelected}
            showState={showCorrection || showCorrectness}
            onClick={onResponseClick}
          />
        );
      }
      case ElementType.Hint:
        return (
          <Typography
            data-cy={buildMultipleChoiceHintPlayCy(el.idx)}
            style={{ paddingLeft: '25px', fontStyle: 'italic' }}
          >
            {el.hint}
          </Typography>
        );
    }

    return undefined;
  };

  return (
    <Stack sx={{ width: '100%', mb: showError ? 0 : 2 }}>
      <Stack spacing={1.5}>
        {elements.map((el) => {
          // The element can be a button or an array with a button and a hint
          if (Array.isArray(el)) {
            return <Stack>{el.map((e) => renderElement(e))}</Stack>;
          }
          return renderElement(el);
        })}
      </Stack>
      {showError && (
        <Typography variant="body1" mt={4}>
          {t(QUIZ_TRANSLATIONS.MULTIPLE_CHOICE_NOT_CORRECT)}
        </Typography>
      )}
    </Stack>
  );
};

export default PlayMultipleChoices;
