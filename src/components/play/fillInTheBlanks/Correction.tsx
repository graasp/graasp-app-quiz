import { ListItem, ListItemProps, Typography, styled } from '@mui/material';

import { FILL_BLANKS_TYPE } from '../../../config/constants';
import {
  FILL_BLANKS_CORRECTION_CY,
  buildFillBlanksCorrectionAnswerCy,
} from '../../../config/selectors';
import { Word } from '../../../utils/fillInTheBlanks';

const StyledOl = styled('ol')(({ theme }) => ({
  columnCount: 3,
  fontFamily: theme.typography.fontFamily,
}));

interface StyledListItemProps extends ListItemProps {
  isCorrect: boolean;
}

const StyledListItem = styled(ListItem)<StyledListItemProps>(
  ({ theme, isCorrect }) => ({
    p: theme.spacing(0.5),
    display: 'list-item',
    color: isCorrect ? theme.palette.success.main : theme.palette.error.main,
  })
);

type Props = {
  words: Word[];
};

const Correction = ({ words }: Props) => (
  <StyledOl data-cy={FILL_BLANKS_CORRECTION_CY}>
    {words
      .filter(({ type }) => type === FILL_BLANKS_TYPE.BLANK)
      .map(({ text, displayed, id }) => {
        const isCorrect = text === displayed;
        return (
          <StyledListItem isCorrect={isCorrect}>
            <Typography
              data-cy={buildFillBlanksCorrectionAnswerCy(id, isCorrect)}
            >
              {text}
            </Typography>
          </StyledListItem>
        );
      })}
  </StyledOl>
);

export default Correction;
