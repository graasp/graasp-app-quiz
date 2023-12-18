import { useContext } from 'react';
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Grid,
  Skeleton,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';

import {
  QUESTION_BAR_CY,
  QUESTION_BAR_NEXT_CY,
  QUESTION_BAR_PREV_CY,
  QUESTION_STEP_CLASSNAME,
  buildQuestionStepCy,
} from '../../config/selectors';
import { QuizContext } from '../context/QuizContext';
import { getQuestionById } from '../context/utilities';
import PlusStep from '../navigation/PlusStep';
import { QuestionDataAppSetting } from '../types/types';

const CreateQuestionTopBar = () => {
  const { t } = useTranslation();
  const {
    questions,
    currentIdx,
    setCurrentIdx,
    moveToPreviousQuestion,
    order,
    saveOrder,
    moveToNextQuestion,
    isSettingsFetching,
    addQuestion,
  } = useContext(QuizContext);

  const questionsInOrder = order
    .map((qId: string, index: number) => {
      const question = getQuestionById(questions, qId);

      if (!question) {
        return null;
      }
      return question;
    })
    .filter(Boolean) as QuestionDataAppSetting[];

  // important that it reloads from first render
  // bug: but won't show anything if empty data
  if (isSettingsFetching) {
    return (
      <Skeleton variant="rectangular" width="100%" height={50} sx={{ mb: 3 }} />
    );
  }

  const renderLabel = (
    question: QuestionDataAppSetting,
    index: number,
    provided: DraggableProvided
  ): JSX.Element => {
    const props = {
      StepIconProps: {
        sx: { '&:hover': { cursor: 'ew-resize' } },
      },
    };
    return (
      <StepLabel
        onClick={() => setCurrentIdx(index)}
        sx={{ '&:hover': { cursor: 'pointer' } }}
        ref={provided.innerRef}
        {...provided.dragHandleProps}
        {...provided.draggableProps}
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
    saveOrder(updatedList);
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
                {questionsInOrder?.map((question, index: number) => {
                  const qId = question.data.questionId;

                  return (
                    <Step
                      key={qId}
                      data-cy={buildQuestionStepCy(qId)}
                      className={QUESTION_STEP_CLASSNAME}
                      ref={provided.innerRef}
                    >
                      <Draggable
                        key={qId}
                        draggableId={qId}
                        index={index}
                        disableInteractiveElementBlocking={true}
                        isDragDisabled={false}
                      >
                        {(draggableProvided) =>
                          renderLabel(question, index, draggableProvided)
                        }
                      </Draggable>
                    </Step>
                  );
                })}
                {provided.placeholder}
                <PlusStep onClick={addQuestion} />
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
          disabled={currentIdx >= order.length - 1}
        >
          {t('Next')}
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateQuestionTopBar;
