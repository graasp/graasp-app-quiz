import { useTranslation } from 'react-i18next';

import { Alert, Typography } from '@mui/material';

import { Data } from '@graasp/apps-query-client';
import { AppData } from '@graasp/sdk';

import { QuestionType } from '../../config/constants';
import { QUIZ_TRANSLATIONS } from '../../langs/constants';
import { setInData } from '../../utils/immutable';
import VibrationAnimation from '../common/animations/VibrationAnimation';
import {
  FillTheBlanksAppDataData,
  MultipleChoiceAppDataData,
  QuestionDataAppSetting,
  SliderAppDataData,
  TextAppDataData,
} from '../types/types';
import PlayFillInTheBlanks from './PlayFillInTheBlanks';
import PlaySlider from './PlaySlider';
import PlayTextInput from './PlayTextInput';
import PlayMultipleChoices from './multipleChoices/PlayMultipleChoices';

type Props = {
  newResponse: Data;
  currentQuestion: QuestionDataAppSetting;
  showCorrection: boolean;
  showCorrectness: boolean;
  isReadonly: boolean;
  isCorrect: boolean;
  latestAnswer?: AppData;
  numberOfSubmit: number;
  numberOfRetry: number;
  currentNumberOfAttempts: number;
  maxNumberOfAttempts: number;

  resetNumberOfSubmit: () => void;
  setShowCorrectness: (showCorrectness: boolean) => void;
  setNewResponse: (newData: Data) => void;
};

export const PlayViewQuestionType = ({
  newResponse,
  currentQuestion,
  showCorrection,
  showCorrectness,
  isReadonly,
  isCorrect,
  latestAnswer,
  numberOfSubmit,
  numberOfRetry,
  currentNumberOfAttempts,
  maxNumberOfAttempts,
  resetNumberOfSubmit,
  setShowCorrectness,
  setNewResponse,
}: Props) => {
  const { t } = useTranslation();

  if (!newResponse) {
    return <Typography>{t(QUIZ_TRANSLATIONS.NO_RESPONSE_FOR_NOW)}</Typography>;
  }

  const onInputChanged = <T extends Data, K extends keyof T, V extends T[K]>(
    object: Partial<T>,
    key: K,
    value: V,
    prevValue?: V
  ) => {
    // reset correctness on value changed if not the same
    // this allow to show prev error and avoid to show success
    // if the user write or move (slider) to the correct response before submit.
    setShowCorrectness(value === prevValue);
    setNewResponse(setInData(object, key, value));
  };

  const vibrationWrapper = (element: JSX.Element | JSX.Element[]) => (
    <VibrationAnimation
      animate={
        numberOfSubmit > 0 && currentNumberOfAttempts + 1 < maxNumberOfAttempts
      }
      onAnimationEnd={resetNumberOfSubmit}
    >
      {element}
    </VibrationAnimation>
  );

  switch (currentQuestion.data.type) {
    case QuestionType.MULTIPLE_CHOICES: {
      return (
        <PlayMultipleChoices
          choices={currentQuestion.data.choices}
          response={newResponse as MultipleChoiceAppDataData}
          lastUserAnswer={latestAnswer?.data as MultipleChoiceAppDataData}
          setResponse={(choices) =>
            setNewResponse(setInData(newResponse, 'choices', choices))
          }
          showCorrection={showCorrection}
          showCorrectness={showCorrectness}
          numberOfRetry={numberOfRetry}
        />
      );
    }
    case QuestionType.TEXT_INPUT: {
      return vibrationWrapper(
        <PlayTextInput
          values={currentQuestion.data}
          response={newResponse as TextAppDataData}
          lastUserAnswer={latestAnswer?.data as TextAppDataData}
          setResponse={(text: string) =>
            onInputChanged(newResponse, 'text', text, latestAnswer?.data?.text)
          }
          showCorrection={showCorrection}
          isCorrect={isCorrect}
          isReadonly={isReadonly}
        />
      );
    }
    case QuestionType.FILL_BLANKS: {
      return vibrationWrapper(
        <PlayFillInTheBlanks
          values={currentQuestion.data}
          response={newResponse as FillTheBlanksAppDataData}
          lastUserAnswer={latestAnswer?.data as FillTheBlanksAppDataData}
          setResponse={(text: string) =>
            setNewResponse(setInData(newResponse, 'text', text))
          }
          showCorrection={showCorrection}
          showCorrectness={showCorrectness}
          isReadonly={isReadonly}
          numberOfRetry={numberOfRetry}
        />
      );
    }
    case QuestionType.SLIDER: {
      return vibrationWrapper(
        <PlaySlider
          values={currentQuestion.data}
          response={newResponse as SliderAppDataData}
          lastUserAnswer={latestAnswer?.data as SliderAppDataData}
          setResponse={(value: number) => {
            onInputChanged(
              newResponse,
              'value',
              value,
              latestAnswer?.data?.value
            );
          }}
          showCorrection={showCorrection}
          isReadonly={isReadonly}
          isCorrect={isCorrect}
        />
      );
    }
    default:
      return <Alert severity="error">{t('Unknown question type')}</Alert>;
  }
};

export default PlayViewQuestionType;
