import { List } from 'immutable';

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

import { AppDataRecord } from '@graasp/sdk/frontend';

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
import { getAppDataByQuestionId, getQuestionById } from '../context/utilities';
import {
  AppDataQuestionRecord,
  QuestionDataAppSettingRecord,
} from '../types/types';

type Props = {
  view?: string;
  additionalSteps?: JSX.Element;
};

const CreateQuestionTopBar = ({ view, additionalSteps }: Props) => {
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
  } = useContext(QuizContext);
  const { data: appData, isLoading } = hooks.useAppData();

  // necessary isSettingsFetching to reload component and allow new questions to be draggable
  if (isSettingsFetching || isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={70} />;
  }

  const renderLabel = (
    response: AppDataRecord,
    question: QuestionDataAppSettingRecord,
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
                {order?.map((qId: string, index: number) => {
                  const q = getQuestionById(questions, qId);
                  if (!q) {
                    console.error('question does not exist');
                    return null;
                  }
                  const response = getAppDataByQuestionId(
                    (appData as List<AppDataQuestionRecord>) ?? List(),
                    q
                  );
                  const question = getQuestionById(questions, qId);

                  if (!question) {
                    return null;
                  }

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
                        isDragDisabled={view === PLAY_VIEW}
                      >
                        {(draggableProvided) =>
                          renderLabel(
                            response,
                            question,
                            index,
                            draggableProvided
                          )
                        }
                      </Draggable>
                    </Step>
                  );
                })}
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

export default CreateQuestionTopBar;
