import { List } from 'immutable';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, CircularProgress } from '@mui/material';

import { AppSettingRecord } from '@graasp/sdk/frontend';

import { APP_SETTING_NAMES, DEFAULT_QUESTION } from '../../config/constants';
import { hooks, mutations } from '../../config/queryClient';
import {
  QuestionDataAppSettingRecord,
  QuestionDataRecord,
  QuestionListTypeRecord,
} from '../types/types';
import { getSettingsByName } from './utilities';

type ContextType = {
  order: List<string>;
  setOrder: (order: List<string>) => void;
  questions: List<QuestionDataAppSettingRecord>;
  currentQuestion: QuestionDataAppSettingRecord;
  currentIdx: number;
  setCurrentIdx: (idx: number) => void;
  deleteQuestion: (questionId: string) => () => void;
  moveToNextQuestion: () => void;
  moveToPreviousQuestion: () => void;
  addQuestion: () => void;
  saveQuestion: (newData: QuestionDataRecord) => Promise<void>;
};

export const QuizContext = React.createContext({} as ContextType);

type Props = {
  children: JSX.Element;
};

export const QuizProvider = ({ children }: Props) => {
  const { t } = useTranslation();
  const { data: settings, isLoading, isError, error } = hooks.useAppSettings();
  const { mutate: deleteAppSetting } = mutations.useDeleteAppSetting();
  const { mutateAsync: postAppSettingAsync, mutate: postAppSetting } =
    mutations.usePostAppSetting();
  const { mutateAsync: patchAppSetting } = mutations.usePatchAppSetting();
  // current question idx
  // -1 if we are adding a new question
  const [currentIdx, setCurrentIdx] = useState(0);

  const [orderSetting, setOrderSetting] = useState<AppSettingRecord>();
  const [order, setOrder] = useState<List<string>>(List());
  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionDataAppSettingRecord>(DEFAULT_QUESTION);

  const setCurrentIdxBounded = (newIdx: number) => {
    const computedIdx = Math.min(Math.max(0, newIdx), order.size - 1);
    setCurrentIdx(computedIdx);
  };

  const deleteQuestion = (questionId: string) => () => {
    // update list order
    const newOrder = order.toJS();
    const idx = order.findIndex((id) => id === questionId);
    newOrder.splice(idx, 1);
    if (orderSetting) {
      patchAppSetting({ id: orderSetting.id, data: { list: newOrder } });
    }
    // delete question
    deleteAppSetting({ id: questionId });

    // change current idx
    // go to previous, bound by number of questions
    // unless there's no more questions -> create new question screen
    if (!newOrder.length) {
      setCurrentIdx(-1);
    } else {
      setCurrentIdxBounded(currentIdx - 1);
    }
  };

  const addQuestion = () => {
    // setting the current idx to -1 will display a mock question structure
    setCurrentIdx(-1);
  };

  // Saves Data of current question in db and adds its id to order list (at the end)
  const saveQuestion = async (newData: QuestionDataRecord) => {
    // add new question
    if (!currentQuestion?.id) {
      const newQuestion = await postAppSettingAsync({
        data: newData.toJS(),
        name: APP_SETTING_NAMES.QUESTION,
      });
      // add question in order if new
      // create order setting if doesn't exist
      if (!orderSetting) {
        postAppSetting({
          name: APP_SETTING_NAMES.QUESTION_LIST,
          data: { list: [newQuestion.id] },
        });
      } else {
        patchAppSetting({
          id: orderSetting.id,
          data: { list: order.push(newQuestion.id).toJS() },
        });
      }
      setCurrentIdx(order.size);
    }

    // update question
    else {
      patchAppSetting({
        id: currentQuestion.id,
        data: newData.toJS(),
      });
    }
  };

  const moveToNextQuestion = () => {
    setCurrentIdxBounded(currentIdx + 1);
  };

  const moveToPreviousQuestion = () => {
    setCurrentIdxBounded(currentIdx - 1);
  };

  // initialize order
  useEffect(() => {
    if (settings) {
      const newOrderSetting = getSettingsByName(
        settings,
        APP_SETTING_NAMES.QUESTION_LIST
      );

      if (newOrderSetting.size) {
        const value = newOrderSetting?.first() as QuestionListTypeRecord;
        setOrderSetting(value);
        setOrder(value?.data?.list ?? List());
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
        !questions.isEmpty() &&
        order?.size &&
        currentIdx !== -1 &&
        currentIdx < order.size
      ) {
        newValue = questions.find(({ id }) => id === order.get(currentIdx));
      }
      setCurrentQuestion(newValue ?? DEFAULT_QUESTION);
    }
  }, [order, currentIdx, settings]);

  const value: ContextType = useMemo(
    () => {
      const questions = settings
        ? (getSettingsByName(
            settings,
            APP_SETTING_NAMES.QUESTION
          ) as List<QuestionDataAppSettingRecord>)
        : List<QuestionDataAppSettingRecord>();
      return {
        order,
        setOrder,
        questions,
        currentQuestion,
        currentIdx,
        setCurrentIdx,
        deleteQuestion,
        moveToNextQuestion,
        moveToPreviousQuestion,
        addQuestion,
        saveQuestion,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIdx, order, currentQuestion]
  );

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    console.error(error);
    return <Alert severity="error">{t('Error while loading the quiz')}</Alert>;
  }

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
