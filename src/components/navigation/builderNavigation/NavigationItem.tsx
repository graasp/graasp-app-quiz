import { DraggableProvided } from 'react-beautiful-dnd';

import DragHandleIcon from '@mui/icons-material/DragHandle';
import { Box, Stack, SxProps, Typography } from '@mui/material';

import {
  DRAGGABLE_HANDLE_COMPONENT,
  MAX_QUESTION_LINES_TOP_BAR,
} from '../../../config/constants';
import {
  QUESTION_STEP_CLASSNAME,
  buildQuestionStepDefaultCy,
  buildQuestionStepTitle,
} from '../../../config/selectors';
import theme from '../../../layout/theme';
import TypographyMaxLines from '../../common/TypographyMaxLines';

const PRIMARY_PALETTE = theme.palette.primary;

const GRAY_COLOR = '#B5B5B5';
const DARK_GRAY_COLOR = '#504F4F';
const WHITE_COLOR = 'white';
const DEFAULT_BG_COLOR = WHITE_COLOR;
const ACTIVE_BG_COLOR = PRIMARY_PALETTE.main;
const DRAGGING_BORDER_COLOR = theme.palette.secondary.light;
const QUESTION_IDX_SIZE = '25px';
const QUESTION_ITEM_MIN_HEIGHT = '50px';

type Props = {
  qId: string;
  questionIdx: number;
  questionTitle: string;
  isActive?: boolean;
  isSwapping?: boolean;
  draggableProvided: DraggableProvided;
  marginBottom?: number;
  marginTop?: number;

  onClick: (questionIdx: number) => void;
};

const CONTAINER_PADDING = 2;

const SX_CONTAINER: SxProps = {
  border: `1px solid`,
  borderRadius: '5px',
  minHeight: QUESTION_ITEM_MIN_HEIGHT,
  boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.25);',
  ':hover': {
    cursor: 'pointer',
  },
};

const SX_DRAG_ICON: SxProps = {
  ':hover': {
    color: DARK_GRAY_COLOR,
    cursor: 'move',
  },
};

const SX_QUESTION_IDX: SxProps = {
  bgcolor: PRIMARY_PALETTE.main,
  border: `1px solid`,
  borderRadius: '50%',
  width: QUESTION_IDX_SIZE,
  height: QUESTION_IDX_SIZE,
  minWidth: QUESTION_IDX_SIZE,
  color: 'white',
};

const QUESTION_LINE_HEIGHT = 1.2;

export const NavigationItem = ({
  qId,
  questionIdx,
  questionTitle,
  isActive,
  isSwapping,
  draggableProvided,
  marginBottom,
  marginTop,

  onClick,
}: Props) => {
  return (
    <Stack
      className={QUESTION_STEP_CLASSNAME}
      data-cy={buildQuestionStepDefaultCy(qId)}
      // questionIdx - 1 because question number is questionIdx + 1
      onClick={() => onClick(questionIdx - 1)}
      direction="row"
      alignContent="center"
      alignItems="center"
      sx={{
        ...SX_CONTAINER,
        borderColor: isSwapping ? DRAGGING_BORDER_COLOR : GRAY_COLOR,
        bgcolor: isActive ? ACTIVE_BG_COLOR : DEFAULT_BG_COLOR,
        // use margin instead of gap in parent component to work correctly with draggable
        mb: marginBottom,
        mt: marginTop,
      }}
      spacing={CONTAINER_PADDING}
      paddingLeft={CONTAINER_PADDING}
      paddingRight={CONTAINER_PADDING}
      ref={draggableProvided.innerRef}
      {...draggableProvided.draggableProps}
    >
      <Box {...draggableProvided.dragHandleProps} display="flex">
        <DragHandleIcon
          className={DRAGGABLE_HANDLE_COMPONENT}
          htmlColor={isActive ? WHITE_COLOR : GRAY_COLOR}
          sx={SX_DRAG_ICON}
        />
      </Box>
      <Box
        sx={{
          ...SX_QUESTION_IDX,
          borderColor: isActive ? WHITE_COLOR : PRIMARY_PALETTE.dark,
        }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography fontSize={questionIdx < 100 ? 'medium' : 'small'}>
          {questionIdx}
        </Typography>
      </Box>

      <TypographyMaxLines
        maxLines={MAX_QUESTION_LINES_TOP_BAR}
        color={isActive ? WHITE_COLOR : DARK_GRAY_COLOR}
        lineHeight={QUESTION_LINE_HEIGHT}
        data-cy={buildQuestionStepTitle(questionIdx - 1)}
      >
        {questionTitle}
      </TypographyMaxLines>
    </Stack>
  );
};

export default NavigationItem;
