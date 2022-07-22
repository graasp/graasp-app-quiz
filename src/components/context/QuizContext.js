import React, { useEffect, useMemo, useState } from 'react';

import { APP_SETTING_NAMES, DEFAULT_QUESTION } from '../../config/constants';
import { MUTATION_KEYS, hooks, useMutation } from '../../config/queryClient';
import { getSettingByName } from './utilities';

export const QuizContext = React.createContext();

export const QuizProvider = ({ children }) => {
  const { data: settings, isLoading, isError } = hooks.useAppSettings();
  const { mutate: deleteAppSetting } = useMutation(
    MUTATION_KEYS.DELETE_APP_SETTING
  );
  const { mutateAsync: postAppSettingAsync, mutate: postAppSetting } =
    useMutation(MUTATION_KEYS.POST_APP_SETTING);
  const { mutate: patchAppSetting } = useMutation(
    MUTATION_KEYS.PATCH_APP_SETTING
  );
  // current question idx
  // -1 if we are adding a new question
  const [currentIdx, setCurrentIdx] = useState(0);

  const [orderSetting, setOrderSetting] = useState(null);
  const [order, setOrder] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(DEFAULT_QUESTION);

  const setCurrentIdxBounded = (newIdx) => {
    const computedIdx = Math.min(Math.max(0, newIdx), order.length - 1);
    setCurrentIdx(computedIdx);
  };

  const deleteQuestion = (questionId) => () => {
    // We do not allow the deletion of all questions of the quiz
    // there should be at least one visible
    // but maybe we could add a screen for when no quiz questions have been created.
    if (order.length > 1) {
      // delete question
      deleteAppSetting({ id: questionId });

      // update list order
      let newOrder = [...order];
      const idx = order.findIndex((id) => id === questionId);
      newOrder.splice(idx, 1);
      patchAppSetting({ id: orderSetting.id, data: { list: newOrder } });

      // change current idx
      // go to previous, bound by number of questions
      setCurrentIdxBounded(currentIdx - 1);
    }
  };

  const addQuestion = () => {
    // setting the current idx to -1 will display a mock question structure
    setCurrentIdx(-1);
  };

  const saveQuestion = (newData) => async () => {
    // add new question
    if (!currentQuestion?.id) {
      const newQuestion = await postAppSettingAsync({
        data: newData,
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
          data: { list: [...order, newQuestion.id] },
        });
      }
      setCurrentIdx(order.length);
    }

    // update question
    else {
      patchAppSetting({
        id: currentQuestion.id,
        data: newData,
      });
    }
  };

  const moveToNextQuestion = () => {
    setCurrentIdxBounded(currentIdx + 1);
  };

  const moveToPreviousQuestion = () => {
    setCurrentIdxBounded(currentIdx - 1);
  };

  useEffect(() => {
    if (settings) {
      const newOrderSetting = getSettingByName(
        settings,
        APP_SETTING_NAMES.QUESTION_LIST
      ).first();
      setOrderSetting(newOrderSetting);
      setOrder(newOrderSetting?.data?.list ?? []);
    }
  }, [settings]);

  useEffect(() => {
    const questions = getSettingByName(settings, APP_SETTING_NAMES.QUESTION);
    if (
      questions &&
      !questions.isEmpty() &&
      order?.length &&
      currentIdx < order.length
    ) {
      const newValue =
        // show mock data if idx is -1
        currentIdx === -1
          ? DEFAULT_QUESTION
          : questions.find(({ id }) => id === order[currentIdx]);
      setCurrentQuestion(newValue);
    }
  }, [order, currentIdx]);

  const value = useMemo(() => {
    return {
      order,
      questions: getSettingByName(settings, APP_SETTING_NAMES.QUESTION),
      currentQuestion,
      currentIdx,
      setCurrentIdx,
      deleteQuestion,
      moveToNextQuestion,
      moveToPreviousQuestion,
      addQuestion,
      saveQuestion,
    };
  }, [currentIdx, order, currentQuestion]);

  if (isLoading) {
    return 'Loading quiz...';
  }

  if (isError) {
    return 'Error while loading the quiz';
  }

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
