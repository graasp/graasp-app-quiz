import { List } from 'immutable';

import { useContext } from 'react';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd';
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
} from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { Context } from '@graasp/sdk';

import { hooks } from '../../config/queryClient';
import {
  PLAY_VIEW,
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

type Props = {
  view?: string;
  additionalSteps?: JSX.Element;
};

const QuestionTopBar = ({ view, additionalSteps }: Props) => {
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

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={70} />;
  }

  const renderLabel = (questionId: string, index: number) => {
    const q = getQuestionById(questions, questionId);
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
          StepIconProps: {
            color: isCorrect ? 'success' : 'error',
            sx: { '&:hover': { cursor: 'ew-resize' } },
          },
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
  const handleDrop = (droppedItem: DropResult) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) {
      return;
    }
    const updatedList = [...order];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setOrder(List(updatedList));
  };

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
          sx={{ pr: 2 }}
          color="primary"
          onClick={moveToPreviousQuestion}
          disabled={currentIdx === 0}
        >
          {t('Prev')}
        </Button>
      </Grid>
      <Grid item>
        <DragDropContext onDragEnd={handleDrop}>
          <Droppable droppableId="list-container" direction="horizontal">
            {(provided) => (
              <Stepper
                data-cy={QUESTION_BAR_CY}
                nonLinear
                alternativeLabel
                activeStep={currentIdx}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {order?.map((qId: string, index: number) => (
                  <Draggable
                    key={qId}
                    draggableId={qId}
                    index={index}
                    disableInteractiveElementBlocking={true}
                    isDragDisabled={view === PLAY_VIEW}
                  >
                    {(provided) => (
                      <Step
                        key={qId}
                        data-cy={buildQuestionStepCy(qId)}
                        className={QUESTION_STEP_CLASSNAME}
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      >
                        {renderLabel(qId, index)}
                      </Step>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {additionalSteps}
              </Stepper>
            )}
          </Droppable>
        </DragDropContext>
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
