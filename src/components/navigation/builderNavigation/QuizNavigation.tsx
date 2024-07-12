import { useContext, useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Stack,
  SxProps,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';

import {
  NAVIGATION_ADD_QUESTION_BUTTON_CY,
  NAVIGATION_DUPLICATE_QUESTION_BUTTON_CY,
  QUESTION_BAR_CY,
} from '../../../config/selectors';
import { QUIZ_TRANSLATIONS } from '../../../langs/constants';
import theme from '../../../layout/theme';
import { QuizContext } from '../../context/QuizContext';
import { getQuestionById } from '../../context/utilities';
import NavigationItem from './NavigationItem';

type QuestionOrder = {
  id: string;
  title: string;
};

type Props = {
  sx?: SxProps;
};

const QUESTION_PADDING = 1;
const QUESTION_SPACE = 1.5;
const CONTAINER_BG = '#FCFCFC';
const CONTAINER_BORDER_COLOR = '#C7C7C7';
const SWAPPED_BORDER_ANIMATION_MS = 500;

const SX_QUESTIONS_CONTAINER: SxProps = {
  display: 'flex',
  flexDirection: 'column',
};

const SX_CONTAINER: SxProps = {
  // border-box take in consideration the padding when using width = 100%
  boxSizing: 'border-box',
  width: '100%',
  padding: QUESTION_PADDING,
  background: CONTAINER_BG,
  border: `1px ${CONTAINER_BORDER_COLOR} solid`,
  borderRadius: '10px',
  overflow: 'auto',
};

export const QuizNavigationBuilder = ({ sx }: Props) => {
  const {
    questions,
    currentQuestion,
    currentIdx,
    setCurrentIdx,
    order,
    saveOrder,
    addQuestion,
    duplicateQuestion,
    isLoaded,
    errorMessage,
  } = useContext(QuizContext);

  const { t } = useTranslation();

  const displayAccordion = useMediaQuery(theme.breakpoints.down('md'));

  const [questionsInOrder, setQuestionsOrder] = useState<QuestionOrder[]>([]);
  const [swappingId, setSwappingId] = useState<string>();
  const isOnNewQuestion = currentIdx === -1;
  const duplicationErrorKey = isOnNewQuestion
    ? QUIZ_TRANSLATIONS.CANNOT_DUPLICATE_NEW_QUESTION_TOOLTIP
    : errorMessage?.msg;
  const duplicationError = duplicationErrorKey
    ? t(duplicationErrorKey)
    : undefined;

  useEffect(() => {
    setQuestionsOrder(
      order.reduce((acc: QuestionOrder[], qId: string) => {
        const q = getQuestionById(questions, qId);

        if (q) {
          acc.push({
            title: q.data.question,
            id: q.data.questionId,
          });
        }

        return acc;
      }, [])
    );
  }, [order, questions]);

  const getQIdByIdx = (idx: number | undefined) =>
    questionsInOrder[idx ?? -1]?.id;

  const reorder = <T,>(list: T[], startIndex: number, endIndex: number) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const handleDrop = ({ source, destination }: DropResult) => {
    setSwappingId(getQIdByIdx(source.index));
    setTimeout(() => {
      setSwappingId(undefined);
    }, SWAPPED_BORDER_ANIMATION_MS);

    // Ignore drop outside droppable container
    if (!destination) {
      return;
    }

    // Update States
    // Update questionsOrder first to avoid blinking effect
    setQuestionsOrder(
      reorder(questionsInOrder, source.index, destination.index)
    );
    saveOrder(
      reorder(order, source.index, destination.index),
      currentQuestion.data.questionId
    );
  };

  const renderDraggableList = () => (
    <DragDropContext
      onDragEnd={handleDrop}
      onBeforeDragStart={(e) => setSwappingId(getQIdByIdx(e.source.index))}
    >
      <Droppable droppableId="list-container" direction="vertical">
        {(provided) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={SX_QUESTIONS_CONTAINER}
          >
            {questionsInOrder.map((q, idx) => (
              <Draggable
                key={q.id}
                draggableId={q.id}
                index={idx}
                disableInteractiveElementBlocking={true}
                isDragDisabled={false}
              >
                {(draggableProvided) => (
                  <NavigationItem
                    qId={q.id}
                    draggableProvided={draggableProvided}
                    questionTitle={q.title}
                    questionIdx={idx + 1}
                    onClick={(qIdx) => setCurrentIdx(qIdx)}
                    isActive={q.id === currentQuestion.data.questionId}
                    isSwapping={swappingId === q.id}
                    marginBottom={QUESTION_SPACE / 2}
                    marginTop={QUESTION_SPACE / 2}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );

  const renderMenu = () => {
    if (order.length === 0) {
      return null;
    }

    if (displayAccordion) {
      return (
        <Accordion sx={SX_CONTAINER}>
          <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
            <Typography>
              {t(QUIZ_TRANSLATIONS.BUILDER_QUIZ_NAVIGATION_TITLE)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>{renderDraggableList()}</AccordionDetails>
        </Accordion>
      );
    }

    return <Box sx={SX_CONTAINER}>{renderDraggableList()}</Box>;
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <Stack
        data-cy={QUESTION_BAR_CY}
        alignItems="center"
        spacing={2}
        sx={{ ...sx }}
        width="100%"
      >
        {renderMenu()}
        <Button
          data-cy={NAVIGATION_ADD_QUESTION_BUTTON_CY}
          variant={currentIdx === -1 ? 'contained' : 'outlined'}
          startIcon={<AddIcon />}
          onClick={addQuestion}
          fullWidth
        >
          {t(QUIZ_TRANSLATIONS.ADD_NEW_QUESTION)}
        </Button>
        <Tooltip
          title={
            <Typography>
              {duplicationError ??
                t(QUIZ_TRANSLATIONS.DUPLICATE_QUESTION_TOOLTIP)}
            </Typography>
          }
        >
          {/* span is used to display tooltip even when button is disabled */}
          <span style={{ width: '100%' }}>
            <Button
              data-cy={NAVIGATION_DUPLICATE_QUESTION_BUTTON_CY}
              disabled={Boolean(duplicationError)}
              variant="outlined"
              startIcon={<FileCopyIcon />}
              onClick={duplicateQuestion}
              fullWidth
            >
              {t(QUIZ_TRANSLATIONS.DUPLICATE_QUESTION)}
            </Button>
          </span>
        </Tooltip>
      </Stack>

      {displayAccordion && <Divider sx={{ mb: 2, mt: 2 }}></Divider>}
    </>
  );
};

export default QuizNavigationBuilder;
