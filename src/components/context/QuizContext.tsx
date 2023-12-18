import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, CircularProgress } from '@mui/material';

import { AppSetting } from '@graasp/sdk';

import { APP_SETTING_NAMES, DEFAULT_QUESTION } from '../../config/constants';
import { hooks, mutations } from '../../config/queryClient';
import {
  CurrentQuestion,
  QuestionData,
  QuestionDataAppSetting,
  QuestionListType,
} from '../types/types';
import { generateId, getSettingsByName } from './utilities';

type ContextType = {
  order: string[];
  questions: QuestionDataAppSetting[];
  currentQuestion: QuestionDataAppSetting; // TODO: check if it can be undefined
  currentIdx: number;
  setCurrentIdx: (idx: number) => void;
  deleteQuestion: (question: QuestionDataAppSetting) => () => void;
  moveToNextQuestion: () => void;
  moveToPreviousQuestion: () => void;
  addQuestion: () => void;
  saveQuestion: (newData: QuestionData) => Promise<void>;
  isSettingsFetching: boolean;
  saveOrder: (order: string[]) => void;
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
  const { mutateAsync: patchAppSettingAsync } = mutations.usePatchAppSetting();
  // current question idx
  // -1 if we are adding a new question
  const [currentIdx, setCurrentIdx] = useState(0);

  const [orderSetting, setOrderSetting] = useState<AppSetting>();
  const [order, setOrder] = useState<string[]>([]);
  // TODO: warning, without the DEFAULT_QUESTION, the type is not provided when question type is not changed in the ui !!!
  // Here use type of CurrentQuestion because only the id of appSetting is needed...
  const [currentQuestion, setCurrentQuestion] =
    useState<CurrentQuestion>(DEFAULT_QUESTION);

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

  // Saves Data of current question in db and adds its id to order list (at the end)
  const saveQuestion = useCallback(
    async (newData: QuestionData) => {
      // getcurrentquestionsetting
      // currentSetting.id
      // add new question
      if (!currentQuestion.id) {
        const newQuestionId = generateId();
        // add question in order if new
        // create order setting if doesn't exist
        if (!orderSetting) {
          await postAppSettingAsync({
            name: APP_SETTING_NAMES.QUESTION_LIST,
            data: { list: [newQuestionId] },
          });
        } else {
          await patchAppSettingAsync({
            id: orderSetting.id,
            // TODO: check if we want to alter the array or not
            data: { list: [...order, newQuestionId] },
          });
        }

        await postAppSettingAsync({
          data: { ...newData, questionId: newQuestionId },
          name: APP_SETTING_NAMES.QUESTION,
        });
        setCurrentIdx(order.length);
      }

      // update question
      else {
        patchAppSettingAsync({
          id: currentQuestion.id,
          data: newData,
        });
      }
    },
    [
      currentQuestion.id,
      order,
      orderSetting,
      patchAppSettingAsync,
      postAppSettingAsync,
    ]
  );

  const saveOrder = useCallback(
    async (newOrder: string[]) => {
      if (!orderSetting) {
        return console.error('order is not defined');
      }
      setOrder(newOrder);
      await patchAppSettingAsync({
        id: orderSetting.id,
        data: { list: newOrder },
      });
    },
    [orderSetting, patchAppSettingAsync]
  );

  const moveToNextQuestion = useCallback(() => {
    setCurrentIdxBounded(currentIdx + 1);
  }, [currentIdx, setCurrentIdxBounded]);

  const moveToPreviousQuestion = useCallback(() => {
    setCurrentIdxBounded(currentIdx - 1);
  }, [currentIdx, setCurrentIdxBounded]);

  // initialize order
  useEffect(() => {
    if (settings) {
      const newOrderSetting = getSettingsByName(
        settings,
        APP_SETTING_NAMES.QUESTION_LIST
      );

      if (newOrderSetting && newOrderSetting.length > 0) {
        const value = newOrderSetting[0] as QuestionListType;
        setOrderSetting(value);
        setOrder(value?.data?.list ?? []);
      }
    }
  }, [settings]);

  // set current question
  useEffect(() => {
    if (settings) {
      const questions = getSettingsByName(settings, APP_SETTING_NAMES.QUESTION);

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
        newValue = (questions as QuestionDataAppSetting[]).find(
          ({ data: { questionId } }: { data: { questionId: string } }) =>
            questionId === currentQId
        );
      }
      setCurrentQuestion(newValue ?? DEFAULT_QUESTION); // TODO: why not just updating with new value ? or set null ?
    }
  }, [order, currentIdx, settings]);

  // back track legacy data to match order list
  useEffect(() => {
    if (settings) {
      const questions = getSettingsByName(settings, APP_SETTING_NAMES.QUESTION);
      for (const q of questions) {
        if (!q.data.questionId) {
          patchAppSettingAsync({
            id: q.id,
            data: { ...q.data, questionId: q.id },
          });
        }
      }
    }
  }, [patchAppSettingAsync, settings]);

  const value: ContextType = useMemo(() => {
    const questions = settings
      ? (getSettingsByName(
          settings,
          APP_SETTING_NAMES.QUESTION
        ) as QuestionDataAppSetting[])
      : [];

    return {
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
      isSettingsFetching,
      saveOrder,
    };
  }, [
    settings,
    order,
    currentQuestion,
    currentIdx,
    deleteQuestion,
    moveToNextQuestion,
    moveToPreviousQuestion,
    saveQuestion,
    isSettingsFetching,
    saveOrder,
  ]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    console.error(error);
    return <Alert severity="error">{t('Error while loading the quiz')}</Alert>;
  }

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
