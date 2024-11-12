import clonedeep from 'lodash.clonedeep';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

import { QUIZ_TRANSLATIONS } from '../../langs/constants';
import {
  ANSWER_REGEXP,
  Word,
  responseToText,
  splitSentence,
} from '../../utils/fillInTheBlanks';
import {
  FillTheBlanksAppDataData,
  FillTheBlanksAppSettingData,
} from '../types/types';
import Answers from './fillInTheBlanks/Answers';
import BlankedText from './fillInTheBlanks/BlankedText';
import Correction from './fillInTheBlanks/Correction';

type State = { answers: Word[]; words: Word[] };

const isWordCorrect = (w: Word) => w.displayed === w.text;

const resetWrongAnswers = (state: State): State => {
  const newWords = state.words.map((w) => {
    const isCorrect = isWordCorrect(w);

    // Type word cannot be placed
    if (w.type === 'word') {
      return w;
    }

    return {
      ...w,
      // set displayed to empty string to reset the answer
      displayed: isCorrect ? w.displayed : '',
      placed: isCorrect,
    };
  });
  const newAnswers = state.answers.map((a) => ({
    ...a,
    placed: Boolean(newWords.find((w) => w.id === a.id)?.displayed),
  }));

  return { answers: newAnswers, words: newWords };
};

type Props = {
  showCorrection: boolean;
  showCorrectness: boolean;
  lastUserAnswer?: FillTheBlanksAppDataData;
  isReadonly: boolean;
  values: FillTheBlanksAppSettingData;
  response: FillTheBlanksAppDataData;
  numberOfRetry: number;
  setResponse: (text: string) => void;
};

const PlayFillInTheBlanks = ({
  showCorrection,
  showCorrectness,
  lastUserAnswer,
  isReadonly,
  values,
  response,
  numberOfRetry,
  setResponse,
}: Props) => {
  const [state, setState] = useState<{ answers: Word[]; words: Word[] }>({
    answers: [],
    words: [],
  });

  const { t } = useTranslation();
  const [prevWords, setPrevWords] = useState<string[]>();

  const userCannotPlay = isReadonly || showCorrection || showCorrectness;

  // reset wrong answers on retry
  useEffect(() => {
    const newState = resetWrongAnswers(state);
    setState(newState);
    saveResponse(newState.words);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberOfRetry]);

  useEffect(() => {
    if (lastUserAnswer) {
      const regExp = RegExp(ANSWER_REGEXP);
      const words: string[] = [];
      let array1;
      while ((array1 = regExp.exec(lastUserAnswer?.text)) !== null) {
        if (array1.length) {
          words.push(array1[0].slice(1, -1));
        }
      }
      setPrevWords(words);
    } else {
      setPrevWords(undefined);
    }
  }, [lastUserAnswer]);

  useEffect(() => {
    const { words, answers } = splitSentence(values.text ?? '', response.text);
    setState({ words, answers });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, response]);

  const saveResponse = (newWords: Word[]) => {
    setResponse(responseToText(newWords));
  };

  const onDelete = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (userCannotPlay) {
      return;
    }

    const datasetId = e.currentTarget.dataset.id;
    if (datasetId) {
      const clickedId = +datasetId;
      // remove from text
      const newWords = clonedeep(state.words);
      const toDelete = newWords.find(({ id }) => id === clickedId);
      if (toDelete) {
        toDelete.displayed = '';
      }
      saveResponse(newWords);
    } else {
      console.error('The dataset id is null');
    }
  };

  const onDrop = (e: React.DragEvent<HTMLSpanElement>, dropId: number) => {
    if (userCannotPlay) {
      return;
    }

    const text = e.dataTransfer.getData('text/plain');
    const previousAnswer = null;

    // update words to display dropped answer
    const newWords = clonedeep(state.words);
    const blank = newWords.find((word) => word.id === dropId);
    if (blank) {
      // change reference
      blank.displayed = text;
    }

    // don't need to remove answers manually, it is automatically computed when app data changes

    // add back the previous answer to the poll
    if (previousAnswer) {
      const prevAnswer = state.answers.find(
        (answer) => answer.text === previousAnswer
      );
      if (prevAnswer) {
        // change reference
        prevAnswer.placed = false;
      }
    }

    saveResponse(newWords);
  };

  return (
    <Box width="100%">
      <Answers answers={state.answers} isReadonly={userCannotPlay} />
      <BlankedText
        showCorrection={showCorrection}
        showCorrectness={showCorrectness}
        isReadonly={userCannotPlay}
        words={state.words}
        prevWords={prevWords}
        onDrop={onDrop}
        onDelete={onDelete}
      />
      {showCorrectness && !isReadonly && (
        <Typography variant="body1" color="error" mt={2}>
          {t(QUIZ_TRANSLATIONS.RESPONSE_NOT_CORRECT)}
        </Typography>
      )}
      {showCorrection && <Correction words={state.words} />}
    </Box>
  );
};

export default PlayFillInTheBlanks;
