import { List } from 'immutable';

import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Grid,
  Skeleton,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  Fab,
} from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { Context } from '@graasp/sdk';

import { hooks } from '../../config/queryClient';
import {
  QUESTION_BAR_CY,
  QUESTION_BAR_NEXT_CY,
  QUESTION_BAR_PREV_CY,
  QUESTION_STEP_CLASSNAME,
  buildQuestionStepCy,
} from '../../config/selectors';
import { QuizContext } from '../context/QuizContext';
import {
  computeCorrectness,
  getAppDataByQuestionId,
  getQuestionById,
} from '../context/utilities';
import { AppDataQuestionRecord, QuestionDataRecord } from '../types/types';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

type Props = {
  additionalSteps?: JSX.Element;
};

const QuestionTopBar = ({ additionalSteps }: Props) => {
  const { t } = useTranslation();
  const {
    questions,
    currentIdx,
    setCurrentIdx,
    moveToPreviousQuestion,
    order,
    setOrder,
    moveToNextQuestion,
  } = useContext(QuizContext);
  const context = useLocalContext();
  const { data: appData, isLoading } = hooks.useAppData();
  const [dragged, setDragged] = useState(true);

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={70} />;
  }

  const renderLabel = (questionId: string, index: number) => {
    const q = questions.find(({ id }) => id === questionId);
    if (!q) {
      console.error('question does not exist');
      return null;
    }
    const response = getAppDataByQuestionId(
      (appData as List<AppDataQuestionRecord>) ?? List(),
      q
    );
    const question = getQuestionById(questions, questionId);

    if (!question) {
      return null;
    }

    if (context.get('context') === Context.Builder) {
      return (
        <StepButton onClick={() => setCurrentIdx(index)}>
          {question.data.question}
        </StepButton>
      );
    }

    // show correctness in label only if a response exists
    const isCorrect = computeCorrectness(
      question.data as QuestionDataRecord,
      response?.data
    );
    const props = !response.id
      ? {}
      : {
          StepIconComponent: isCorrect ? CheckIcon : CloseIcon,
          StepIconProps: { color: isCorrect ? 'success' : 'error' },
        };

    return (
      <StepLabel
        sx={{ '&:hover': { cursor: 'pointer' } }}
        onClick={() => setCurrentIdx(index)}
        {...props}
      >
        {question.data.question}
      </StepLabel>
    );
  };

  // Function to update list on drop
  const handleDrop = (droppedItem: any) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    const updatedList = [...order];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setOrder(List(updatedList));
    setDragged(false);
  };

  const handleDragStart = () => {
    setDragged(true);
  }

  const renderQuestionBar = () => {
    return (
      <Stepper
          data-cy={QUESTION_BAR_CY}
          nonLinear
          alternativeLabel
          activeStep={currentIdx}
          sx={{ pb: 3 }}
        >
          {order?.map((qId: string, index: number) => (
            <Step key={qId} data-cy={buildQuestionStepCy(qId)} className={
              QUESTION_STEP_CLASSNAME
            }>
              {renderLabel(qId, index)}
            </Step>
          ))}
          {additionalSteps}
        </Stepper>
    );
  };

  const renderDndBalls = () => {
    return (
      <DragDropContext onDragEnd={handleDrop}>
      <Droppable droppableId="list-container">
        {(provided) => (
          <div
            className="list-container"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {order?.map((qId: string, index: number) => (
              <Draggable key={qId} draggableId={qId} index={index}>
                {(provided) => (
                  <div
                  className="item-container"
                  ref={provided.innerRef}
                  {...provided.dragHandleProps}
                  {...provided.draggableProps}
                >
                    {index + 1}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>);
  }

  return (
    <Grid
      container
      direction="row"
      alignItems="flex-start"
      justifyContent="center"
    >
      <Grid item>
        <Button
          data-cy={QUESTION_BAR_PREV_CY}
          sx={{ p: 0 }}
          color="primary"
          onClick={moveToPreviousQuestion}
          disabled={currentIdx === 0}
        >
          {t('Prev')}
        </Button>
      </Grid>
      <Grid item>
          {dragged ? renderDndBalls() : renderQuestionBar()}
      </Grid>
      <Grid item>
        <Button
          data-cy={QUESTION_BAR_NEXT_CY}
          sx={{ p: 0 }}
          color="primary"
          onClick={moveToNextQuestion}
          disabled={currentIdx >= order.size - 1}
        >
          {t('Next')}
        </Button>
      </Grid>
    </Grid>
  );
};

export default QuestionTopBar;
