import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { QUIZ_TRANSLATIONS } from '../../../langs/constants';
import ReorderAnimation, {
  TransitionData,
} from '../../common/animations/ReorderAnimation';
import {
  ChoiceState,
  MultipleChoiceAppDataData,
  MultipleChoicesAppSettingData,
  MultipleChoicesChoice,
} from '../../types/types';
import ChoiceButton from './ChoiceButton';

const TITLE_HEIGHT = 20;
const BTN_HEIGHT = 26;
const DEFAULT_BTN_HEIGHT = 50;
const DEFAULT_TITLE_HEIGHT = 38;

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

const sectionTitles = [
  {
    title: QUIZ_TRANSLATIONS.MULTIPLE_CHOICE_SECTION_TITLE_CORRECT,
    state: ChoiceState.CORRECT,
  },
  {
    title: QUIZ_TRANSLATIONS.MULTIPLE_CHOICE_SECTION_TITLE_MISSING,
    state: ChoiceState.MISSING,
  },
  {
    title: QUIZ_TRANSLATIONS.MULTIPLE_CHOICE_SECTION_TITLE_INCORRECT,
    state: ChoiceState.INCORRECT,
  },

  {
    title: QUIZ_TRANSLATIONS.MULTIPLE_CHOICE_SECTION_TITLE_UNSELECTED,
    state: ChoiceState.UNSELECTED,
  },
];

enum ElementType {
  Answer,
  SectionTitle,
}

type AnswerDataType = {
  idx: number;
  choice: MultipleChoicesChoice;
  elementType: ElementType.Answer;
};
type TitleDataType = { title: string; elementType: ElementType.SectionTitle };

const choiceToAnswer = (
  choice: MultipleChoicesChoice,
  idx: number
): TransitionData<AnswerDataType> => ({
  key: choice.value,
  height: BTN_HEIGHT,
  defaultHeight: DEFAULT_BTN_HEIGHT,
  y: 0,
  data: { idx, choice, elementType: ElementType.Answer },
});

const choiceToTitle = (title: string): TransitionData<TitleDataType> => ({
  key: title,
  height: TITLE_HEIGHT,
  defaultHeight: DEFAULT_TITLE_HEIGHT,
  y: 0,
  data: {
    title,
    elementType: ElementType.SectionTitle,
  },
});

type Props = {
  choices: MultipleChoicesAppSettingData['choices'];
  response: MultipleChoiceAppDataData;
  lastUserAnswer?: MultipleChoiceAppDataData;
  showCorrection: boolean;
  showCorrectness: boolean;
  lastSubmit: number;
  setResponse: (d: MultipleChoiceAppDataData['choices']) => void;
};

const PlayMultipleChoices = ({
  choices,
  response,
  lastUserAnswer,
  showCorrection,
  showCorrectness,
  lastSubmit,
  setResponse,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const [elements, setElements] = useState<
    TransitionData<AnswerDataType | TitleDataType>[]
  >([]);
  const isReadonly = showCorrection || showCorrectness;
  const choiceStates = choices.map((choice) =>
    computeChoiceState(choice, lastUserAnswer?.choices, showCorrection)
  );
  const isAnimating = lastSubmit > 0;
  const showError =
    choiceStates.some(
      (state) =>
        state === ChoiceState.INCORRECT || state === ChoiceState.MISSING
    ) &&
    showCorrectness &&
    !showCorrection;

  useEffect(() => {
    // set the "gaming" view
    if (!showCorrection && !showCorrectness) {
      setElements(choices.map(choiceToAnswer));
    } else {
      // set the "correctness" or "correction" view
      setElements(
        sectionTitles.flatMap((sectionTitle, i) => {
          const sectionAnswers = choiceStates.some(
            (state) => sectionTitle.state === state
          );

          return sectionAnswers
            ? [
                choiceToTitle(t(sectionTitles[i].title)),
                ...choices
                  .map((c, idx) => choiceToAnswer(c, idx))
                  .filter((_, idx) => sectionTitle.state === choiceStates[idx]),
              ]
            : [];
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choices, showCorrection, showCorrectness]);

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

  const renderElement = (
    item: TransitionData<AnswerDataType | TitleDataType>
  ) => {
    if (item.data.elementType === ElementType.Answer) {
      const isSelected = Boolean(
        response.choices?.includes(item.data.choice.value)
      );

      return (
        <ChoiceButton
          idx={item.data.idx}
          choice={item.data.choice}
          choiceState={choiceStates[item.data.idx]}
          isReadonly={isReadonly}
          isSelected={isSelected}
          showState={showCorrection || showCorrectness}
          onClick={onResponseClick}
        />
      );
    } else {
      return (
        <Typography component="h2" variant="subtitle1" sx={{ fontWeight: 500 }}>
          {item.data.title}
        </Typography>
      );
    }
  };

  return (
    <Stack sx={{ width: '100%', mb: showError ? 0 : 2 }}>
      <ReorderAnimation
        isAnimating={isAnimating}
        elements={elements}
        renderElement={renderElement}
      />
      {showError && (
        <Typography variant="body1" mt={4}>
          {t(QUIZ_TRANSLATIONS.MULTIPLE_CHOICE_NOT_CORRECT)}
        </Typography>
      )}
    </Stack>
  );
};

export default PlayMultipleChoices;
