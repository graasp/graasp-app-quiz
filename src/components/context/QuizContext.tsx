import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, CircularProgress } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { AppSetting, PermissionLevel } from '@graasp/sdk';

import { APP_SETTING_NAMES, DEFAULT_QUESTION } from '../../config/constants';
import { hooks, mutations } from '../../config/queryClient';
import { QUIZ_TRANSLATIONS } from '../../langs/constants';
import { appendAfter } from '../../utils/array';
import {
  CurrentQuestion,
  QuestionData,
  QuestionDataAppSetting,
} from '../types/types';
import {
  generateId,
  getSettingsByName,
  isDifferent,
  validateQuestionData,
} from './utilities';

type ValidationSeverity = 'warning' | 'error';

type ValidationMessage = {
  msg: string;
  severity: ValidationSeverity;
};

type ContextType = {
  order: string[];
  questions: QuestionDataAppSetting[];
  currentQuestion: QuestionDataAppSetting;
  currentIdx: number;
  setCurrentIdx: (idx: number) => void;
  deleteQuestion: (question: QuestionDataAppSetting) => () => void;
  moveToNextQuestion: () => void;
  moveToPreviousQuestion: () => void;
  addQuestion: () => void;
  saveQuestion: (newData: QuestionData) => Promise<void>;
  duplicateQuestion: () => Promise<void>;
  isSettingsFetching: boolean;
  isLoaded: boolean;
  saveOrder: (order: string[], currQuestionId?: string) => void;
  newData: QuestionData;
  setNewData: (newData: QuestionData) => void;
  errorMessage: ValidationMessage | null;
};

export const QuizContext = React.createContext({} as ContextType);

type Props = {
  children: JSX.Element;
};

export const QuizProvider = ({ children }: Props) => {
  const { t } = useTranslation();
  const {
    data: settings,
    isFetching: isSettingsFetching,
    isError,
    error,
    isLoading,
  } = hooks.useAppSettings();
  const { mutateAsync: deleteAppSettingAsync } =
    mutations.useDeleteAppSetting();
  const { mutateAsync: postAppSettingAsync } = mutations.usePostAppSetting();
  const { mutateAsync: patchAppSettingAsync, isLoading: isPatching } =
    mutations.usePatchAppSetting();
  const { permission } = useLocalContext();
  // prevents patching infinitely because of throwing patch
  const [isPatched, setIsPatched] = useState(false);
  // current question idx
  // -1 if we are adding a new question
  const [currentIdx, setCurrentIdx] = useState(-1);

  const [orderSetting, setOrderSetting] = useState<AppSetting>();
  const [order, setOrder] = useState<string[]>([]);

  // This state indicates if the questions were received and the question order set correctly.
  // It allows QuizNavigation to display the Add question button when loading stops
  // and the current index updated correctly according if there is questions or not.
  const [isLoaded, setIsLoaded] = useState(false);

  // Here use type of CurrentQuestion because only the id of appSetting is needed...
  const [currentQuestion, setCurrentQuestion] =
    useState<CurrentQuestion>(DEFAULT_QUESTION);

  // curated questions
  const [questions, setQuestions] = useState<QuestionDataAppSetting[]>([]);

  const [newData, setNewData] = useState<QuestionData>(currentQuestion.data);
  const hasChanged = isDifferent(newData, currentQuestion.data);
  const [errorMessage, setErrorMessage] = useState<ValidationMessage | null>(
    null
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  // validate data to enable save
  useEffect(() => {
    try {
      validateQuestionData(newData);
      setErrorMessage(null);
    } catch (e) {
      setErrorMessage({
        msg: e as string,
        severity: isSubmitted ? 'error' : 'warning',
      });
    }
  }, [isSubmitted, newData]);

  // Reset is submitted when currentIdx changed to
  // display errorMessage with the correct severity.
  useEffect(() => {
    setIsSubmitted(false);
  }, [currentIdx]);

  const setCurrentIdxBounded = useCallback(
    (newIdx: number) => {
      const computedIdx = Math.min(Math.max(0, newIdx), order.length - 1);
      setCurrentIdx(computedIdx);
    },
    [order.length]
  );

  const deleteQuestion = useCallback(
    (question?: QuestionDataAppSetting) => async () => {
      if (!question) {
        console.error('Cannot delete a question that does not exist');
        return;
      }
      // update list order
      const idx = order.findIndex((id) => id === question.data.questionId);
      // construct new order without the idx:
      // add elements before the idx as well as the end of the list after the idx
      const newOrder = [...order.slice(0, idx), ...order.slice(idx + 1)];
      if (orderSetting) {
        await patchAppSettingAsync({
          id: orderSetting.id,
          data: { list: newOrder },
        });
      }
      // delete question
      await deleteAppSettingAsync({ id: question.id });

      // change current idx
      // go to previous, bound by number of questions
      // unless there's no more questions -> create new question screen
      if (!newOrder.length) {
        setCurrentIdx(-1);
      } else {
        setCurrentIdxBounded(currentIdx - 1);
      }
    },
    [
      currentIdx,
      deleteAppSettingAsync,
      order,
      orderSetting,
      patchAppSettingAsync,
      setCurrentIdxBounded,
    ]
  );

  const addQuestion = () => {
    // setting the current idx to -1 will display a mock question structure
    setCurrentIdx(-1);
  };

  // add question in order if new
  // create order setting if doesn't exist
  const saveQuestionList = useCallback(
    async (newQuestionId: string, newOrder: string[]) => {
      if (!orderSetting) {
        await postAppSettingAsync({
          name: APP_SETTING_NAMES.QUESTION_LIST,
          data: { list: [newQuestionId] },
        });
      } else {
        await patchAppSettingAsync({
          id: orderSetting.id,
          data: { list: newOrder },
        });
      }
    },
    [orderSetting, patchAppSettingAsync, postAppSettingAsync]
  );

  const saveNewQuestion = useCallback(
    async (
      newQuestionId: string,
      newData: QuestionData,
      newOrder: string[]
    ) => {
      await saveQuestionList(newQuestionId, newOrder);

      await postAppSettingAsync({
        data: { ...newData, questionId: newQuestionId },
        name: APP_SETTING_NAMES.QUESTION,
      });

      const idxOfNewQuestion = newOrder.indexOf(newQuestionId);
      setCurrentIdx(idxOfNewQuestion);
    },
    [postAppSettingAsync, saveQuestionList]
  );

  // Saves Data of current question in db and adds its id to order list (at the end)
  const saveQuestion = useCallback(
    async (newData: QuestionData) => {
      try {
        validateQuestionData(newData);
        // add new question
        if (!currentQuestion.id) {
          const newQuestionId = generateId();
          const newOrder = [...order, newQuestionId];

          await saveNewQuestion(newQuestionId, newData, newOrder);

          await postAppSettingAsync({
            data: { ...newData, questionId: newQuestionId },
            name: APP_SETTING_NAMES.QUESTION,
          });
          setCurrentIdx(order.length);
        }

        // update question
        else {
          await patchAppSettingAsync({
            id: currentQuestion.id,
            data: newData,
          });
        }

        setIsSubmitted(true);
      } catch (e) {
        setErrorMessage({
          msg: e as string,
          severity: 'error',
        });
      }
    },
    [
      currentQuestion.id,
      order,
      patchAppSettingAsync,
      postAppSettingAsync,
      saveNewQuestion,
    ]
  );

  // Duplicate current question and add it just after the original one
  const duplicateQuestion = useCallback(async () => {
    if (!currentQuestion.id) {
      console.error('Cannot duplicate a new question!');

      return;
    }

    if (hasChanged) {
      await saveQuestion(newData);
    }

    const newQuestionData = hasChanged ? newData : currentQuestion.data;
    const prevId = currentQuestion.data.questionId;
    const newId = generateId();
    const newOrder = appendAfter(order, prevId, newId);

    await saveNewQuestion(newId, newQuestionData, newOrder);
  }, [
    currentQuestion.data,
    currentQuestion.id,
    hasChanged,
    newData,
    order,
    saveNewQuestion,
    saveQuestion,
  ]);

  const saveOrder = useCallback(
    async (newOrder: string[], currQuestionId?: string) => {
      if (!orderSetting) {
        return console.error('order is not defined');
      }

      // The state currentQuestion is not synchronized correctly in the callback,
      // so we pass the current id in the parameters to set its new position as the current idx.
      // Update the current index to the new position of the current question.
      // This allows the user to stay on the current question even after changing the order.
      if (currQuestionId) {
        const newIdx = newOrder.findIndex((qId) => qId === currQuestionId);
        if (newIdx >= 0 && newIdx < newOrder.length) {
          setCurrentIdx(newIdx);
        }
      }

      setOrder(newOrder);
      await patchAppSettingAsync({
        id: orderSetting.id,
        data: { list: newOrder },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderSetting, patchAppSettingAsync]
  );

  const moveToNextQuestion = useCallback(() => {
    setCurrentIdxBounded(currentIdx + 1);
  }, [currentIdx, setCurrentIdxBounded]);

  const moveToPreviousQuestion = useCallback(() => {
    setCurrentIdxBounded(currentIdx - 1);
  }, [currentIdx, setCurrentIdxBounded]);

  // initialize questions
  useEffect(() => {
    // Get all questions
    const validIds =
      getSettingsByName(settings, APP_SETTING_NAMES.QUESTION_LIST)[0]?.data
        ?.list ?? [];
    const tmpQ = getSettingsByName(settings, APP_SETTING_NAMES.QUESTION)
      // Filter out questions that are not well formatted in AppSettings.
      .filter(
        (q) => validIds.includes(q.data.questionId) || validIds.includes(q.id)
      );
    // remove duplicated questions that might happen on save
    const questions = tmpQ.filter(({ id, data, updatedAt }) => {
      const duplicate = tmpQ.find(
        (q) => data?.questionId === q.data.questionId && q.id !== id
      );
      if (!duplicate) {
        return true;
      }
      return updatedAt > duplicate.updatedAt;
    });
    setQuestions(questions);
  }, [settings]);

  // initialize order
  useEffect(() => {
    if (settings && questions) {
      const newOrderSetting = getSettingsByName(
        settings,
        APP_SETTING_NAMES.QUESTION_LIST
      );

      // Get all questions id. To support legacy code, if no question id, the id is used instead.
      const questionIds = questions.map(
        (appSetting) => appSetting?.data?.questionId ?? appSetting.id
      );

      const filteredOrder: string[] = [];
      if (newOrderSetting && newOrderSetting.length > 0) {
        const value = newOrderSetting[0];
        setOrderSetting(value);
        // Filter out questions that are not well formatted in AppSettings.
        filteredOrder.push(
          ...(value?.data?.list.filter((id) => questionIds.includes(id)) ?? [])
        );
        setOrder(filteredOrder);
      }

      // if it is first loading, set is loaded to true.
      if (!isLoaded) {
        // If there are questions, set current idx to the first one.
        // If it has already set current idx, don't do it again to not reset curr question on order changed.
        if (filteredOrder.length) {
          setCurrentIdx(0);
        }

        setIsLoaded(true);
      }
    }
    // Disable exhaustive-deps for isLoaded, because we don't want
    // to reload this useEffect when isLoaded has changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, questions]);

  // set current question
  useEffect(() => {
    if (settings) {
      let newValue;
      // set current question if current idx, questions and order are correctly defined
      if (
        questions &&
        questions.length > 0 &&
        order?.length &&
        currentIdx !== -1 &&
        currentIdx < order.length
      ) {
        const currentQId = order[currentIdx];
        newValue = questions.find(
          ({ data: { questionId } }: { data: { questionId: string } }) =>
            questionId === currentQId
        );
      }
      setCurrentQuestion(newValue ?? DEFAULT_QUESTION);
    }
  }, [order, currentIdx, settings, questions]);

  // back track legacy data to match order list when admin
  useEffect(() => {
    if (questions && permission === PermissionLevel.Admin && !isPatched) {
      for (const q of questions) {
        if (!q.data.questionId) {
          patchAppSettingAsync({
            id: q.id,
            data: { ...q.data, questionId: q.id },
          });
        }
      }
      setIsPatched(true);
    }
  }, [patchAppSettingAsync, permission, questions, isPatched]);

  const value: ContextType = useMemo(
    () => ({
      order,
      questions,
      currentQuestion: currentQuestion as QuestionDataAppSetting,
      currentIdx,
      setCurrentIdx,
      deleteQuestion,
      moveToNextQuestion,
      moveToPreviousQuestion,
      addQuestion,
      saveQuestion,
      duplicateQuestion,
      isSettingsFetching,
      isLoaded,
      saveOrder,
      newData,
      setNewData,
      errorMessage,
    }),
    [
      order,
      currentQuestion,
      currentIdx,
      deleteQuestion,
      moveToNextQuestion,
      moveToPreviousQuestion,
      saveQuestion,
      duplicateQuestion,
      isSettingsFetching,
      isLoaded,
      saveOrder,
      newData,
      errorMessage,
      questions,
    ]
  );

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    console.error(error);
    return <Alert severity="error">{t('Error while loading the quiz')}</Alert>;
  }

  // show error banner if quiz format is incorrect and show current state of patch
  // useful message for readers
  if (settings) {
    if (questions.some((q) => !q.data.questionId)) {
      return (
        <Alert severity="error">
          {t(QUIZ_TRANSLATIONS.OUTDATED_QUIZ_FORMAT_MESSAGE)}
          {isPatching && <CircularProgress />}
        </Alert>
      );
    }
  }

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
