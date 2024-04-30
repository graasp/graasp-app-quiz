import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { buildMultipleChoiceHintPlayCy } from '../../../config/selectors';
import { QUIZ_TRANSLATIONS } from '../../../langs/constants';
import HeightObserver from '../../common/HeightObserver';
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

const DEFAULT_MARGIN = 10;
const HINT_MARGIN = 10;

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
  Hint,
}

type AnswerDataType = {
  idx: number;
  choice: MultipleChoicesChoice;
  elementType: ElementType.Answer;
};
type TitleDataType = { title: string; elementType: ElementType.SectionTitle };
type HintDataType = {
  idx: number;
  hint: string;
  elementType: ElementType.Hint;
};
type DataType = AnswerDataType | TitleDataType | HintDataType;

const choiceToAnswer = (
  choice: MultipleChoicesChoice,
  idx: number,
  marginBottom: number
): TransitionData<AnswerDataType> => ({
  key: `answer-${choice.value}-${idx}`,
  marginBottom,
  data: { idx, choice, elementType: ElementType.Answer },
});

const choiceToTitle = (title: string): TransitionData<TitleDataType> => ({
  key: `title-${title}`,
  marginBottom: DEFAULT_MARGIN,
  data: {
    title,
    elementType: ElementType.SectionTitle,
  },
});

const choiceToHint = (
  choiceIdx: number,
  hint: string
): TransitionData<HintDataType> => ({
  key: `hint-${hint}-${choiceIdx}`,
  marginBottom: HINT_MARGIN,
  data: {
    hint,
    idx: choiceIdx,
    elementType: ElementType.Hint,
  },
});

const isChoiceSelected = (
  choices: string[] | undefined,
  choice: MultipleChoicesChoice
) => Boolean(choices?.includes(choice.value));

export const showHint = (
  isSelected: boolean,
  showCorrectness: boolean,
  showCorrection: boolean
) => showCorrection || (showCorrectness && isSelected);

type Props = {
  choices: MultipleChoicesAppSettingData['choices'];
  response: MultipleChoiceAppDataData;
  lastUserAnswer?: MultipleChoiceAppDataData;
  showCorrection: boolean;
  showCorrectness: boolean;
  numberOfSubmit: number;
  setResponse: (d: MultipleChoiceAppDataData['choices']) => void;
};

const PlayMultipleChoices = ({
  choices,
  response,
  lastUserAnswer,
  showCorrection,
  showCorrectness,
  numberOfSubmit,
  setResponse,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const [elements, setElements] = useState<TransitionData<DataType>[]>([]);
  const isReadonly = showCorrection || showCorrectness;
  const choiceStates = choices.map((choice) =>
    computeChoiceState(choice, lastUserAnswer?.choices, showCorrection)
  );
  const isAnimating = numberOfSubmit > 0;
  const showError =
    choiceStates.some(
      (state) =>
        state === ChoiceState.INCORRECT || state === ChoiceState.MISSING
    ) &&
    showCorrectness &&
    !showCorrection;

  useEffect(() => {
    const answers = choices.map((c, idx) =>
      choiceToAnswer(c, idx, DEFAULT_MARGIN)
    );
    // set the "gaming" view
    if (!showCorrection && !showCorrectness) {
      setElements(answers);
    } else {
      // set the "correctness" or "correction" view
      setElements(
        sectionTitles.flatMap((sectionTitle, i) => {
          const sectionAnswers = choiceStates.some(
            (state) => sectionTitle.state === state
          );

          if (!sectionAnswers) {
            return [];
          }

          return [
            choiceToTitle(t(sectionTitles[i].title)),
            ...answers
              .filter((_, idx) => sectionTitle.state === choiceStates[idx])
              .map((answer) => {
                const hint = answer.data.choice.explanation;
                const displayHint = showHint(
                  isChoiceSelected(response.choices, answer.data.choice),
                  showCorrectness,
                  showCorrection
                );

                return displayHint && hint
                  ? [
                      { ...answer, marginBottom: 0 },
                      choiceToHint(answer.data.idx, hint),
                    ]
                  : answer;
              })
              .flat(),
          ];
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
    item: TransitionData<DataType>,
    onHeightChange: (key: string, height: number) => void
  ) => {
    let element: JSX.Element | undefined;

    switch (item.data.elementType) {
      case ElementType.Answer: {
        const isSelected = isChoiceSelected(response.choices, item.data.choice);
        element = (
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
        break;
      }
      case ElementType.SectionTitle:
        element = (
          <Typography
            component="h2"
            variant="subtitle1"
            sx={{ fontWeight: 500 }}
          >
            {item.data.title}
          </Typography>
        );
        break;
      case ElementType.Hint:
        element = (
          <Typography
            data-cy={buildMultipleChoiceHintPlayCy(item.data.idx)}
            style={{ paddingLeft: '25px' }}
          >
            {item.data.hint}
          </Typography>
        );
        break;
    }

    return (
      <HeightObserver
        onHeightChange={(height: number) => onHeightChange(item.key, height)}
      >
        {element}
      </HeightObserver>
    );
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
