import { List } from 'immutable';

import React, { useEffect, useState } from 'react';

import { APP_SETTING_NAMES } from '../../config/constants';
import { MUTATION_KEYS, hooks, useMutation } from '../../config/queryClient';

export const QuizContext = React.createContext();

export const QuizProvider = ({ children }) => {
  const { data, isLoading } = hooks.useAppSettings();
  const { mutate: deleteAppSetting } = useMutation(
    MUTATION_KEYS.DELETE_APP_SETTING
  );
  const { mutate: patchAppSetting } = useMutation(
    MUTATION_KEYS.PATCH_APP_SETTING
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [orderSetting, setOrderSetting] = useState(null);
  const [questions, setQuestions] = useState(List());

  // context returned value
  const [value, setValue] = useState({});

  const setCurrentIdxBounded = (newIdx) => {
    const order = orderSetting?.data?.list ?? [];
    const computedIdx = Math.min(Math.max(0, newIdx), order.length - 1);
    setCurrentIdx(computedIdx);
  };

  const deleteQuestion = (questionId) => () => {
    const order = orderSetting?.data?.list;
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

  const moveToNextQuestion = () => {
    setCurrentIdxBounded(currentIdx + 1);
  };

  const moveToPreviousQuestion = () => {
    setCurrentIdxBounded(currentIdx - 1);
  };

  useEffect(() => {
    setOrderSetting(
      data?.find(({ name }) => name === APP_SETTING_NAMES.QUESTION_LIST)
    );

    setQuestions(
      data?.filter(({ name }) => name === APP_SETTING_NAMES.QUESTION)
    );
  }, [data]);

  useEffect(() => {
    setValue({
      order: orderSetting?.data?.list ?? [],
      questions,
      currentQuestion: questions?.find(
        ({ id }) => id === orderSetting?.data?.list?.[currentIdx]
      ),
      currentIdx,
      setCurrentIdx,
      deleteQuestion,
      moveToNextQuestion,
      moveToPreviousQuestion,
    });
  }, [currentIdx, questions]);

  if (isLoading) {
    return 'Loading quiz...';
  }

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
