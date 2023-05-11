import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CancelOutlined, CheckCircleOutlined } from '@mui/icons-material';
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';

import { QUESTION_TYPES } from '../../config/constants';
import {
  TABLE_BY_QUESTION_ANSWER_DATA_CY,
  TABLE_BY_QUESTION_CONTAINER_CY,
  TABLE_BY_QUESTION_CORRECT_ICON_CY,
  TABLE_BY_QUESTION_DATE_DATA_CY,
  TABLE_BY_QUESTION_ENTRY_CY,
  TABLE_BY_QUESTION_USER_ID_HEADER_CY,
  buildTableByQuestionAnswerHeaderCy,
  buildTableByQuestionCorrectHeaderCy,
  buildTableByQuestionCy,
  buildTableByQuestionDateHeaderCy,
  buildTableByQuestionTableBodyCy,
  buildTableByQuestionUserHeaderCy,
} from '../../config/selectors';
import {
  Order,
  comparatorArrayByElemName,
  getComparator,
} from '../../utils/tableUtils';
import { computeCorrectness } from '../context/utilities';

const TableByQuestion = ({
  question,
  memberList,
  responses,
  handleUserClicked,
}) => {
  const { t } = useTranslation();
  const [order, setOrder] = useState(Order.ASC);
  const [responsesByUser, setResponsesByUser] = useState(
    responses.groupBy((res) => res.memberId)
  );

  useEffect(() => {
    setResponsesByUser(responses.groupBy((res) => res.memberId));
  }, [responses]);

  /**
   * Helper function to extract the response from a particular user
   *
   * @param {string} userId The name of the user
   * @returns A user response (May be undefined if user didn't respond to the current question)
   */
  const getResponseForUserId = (userId) => {
    return responsesByUser.get(userId)?.first();
  };

  /**
   * Helper function to extract the data of one user for a specific question.
   *
   * @param {string} userId The name of the user
   * @returns {string} Response for given user.
   */
  const getResponseDataForUserId = (userId) => {
    const { text, value, choices } = getResponseForUserId(userId)?.data ?? {
      text: '',
    };

    switch (question.data.type) {
      case QUESTION_TYPES.TEXT_INPUT:
      case QUESTION_TYPES.FILL_BLANKS:
        return text;
      case QUESTION_TYPES.SLIDER:
        return value;
      case QUESTION_TYPES.MULTIPLE_CHOICES:
        return choices?.join(', ');
      default:
        return '';
    }
  };

  /**
   * Helper function to extract the date at which the user answered a specific question
   *
   * @param {string} userId The name of the user
   * @returns {string} return the date of answer's last modification
   */
  const getResponseDateForUserId = (userId) => {
    const updatedAt = getResponseForUserId(userId)?.updatedAt;

    return updatedAt ? new Date(updatedAt).toDateString() : '';
  };

  /**
   * Helper function to invert the current order when clicking on sorted column header
   */
  const handleRequestSort = () => {
    const isAsc = order === Order.ASC;
    setOrder(isAsc ? Order.DESC : Order.ASC);
  };

  return (
    <Box sx={{ mb: 8 }} data-cy={TABLE_BY_QUESTION_CONTAINER_CY}>
      <Stack direction="column" spacing={4}>
        <Typography
          variant="h5"
          component="h5"
          data-cy={buildTableByQuestionCy(question.data.question)}
        >
          {question.data.question}
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <TableSortLabel
                    active={true}
                    direction={order}
                    onClick={handleRequestSort}
                    data-cy={buildTableByQuestionUserHeaderCy(
                      question.data.question
                    )}
                  >
                    {t('User')}
                    {
                      <Box component="span" sx={visuallyHidden}>
                        {order === Order.DESC
                          ? t('sorted descending')
                          : t('sorted ascending')}
                      </Box>
                    }
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  align="left"
                  data-cy={buildTableByQuestionAnswerHeaderCy(
                    question.data.question
                  )}
                >
                  {t('Answer')}
                </TableCell>
                <TableCell
                  align="left"
                  data-cy={buildTableByQuestionDateHeaderCy(
                    question.data.question
                  )}
                >
                  {t('Date')}
                </TableCell>
                <TableCell
                  align="left"
                  data-cy={buildTableByQuestionCorrectHeaderCy(
                    question.data.question
                  )}
                >
                  {t('Correct')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              data-cy={buildTableByQuestionTableBodyCy(question.data.question)}
            >
              {memberList
                ?.sort(getComparator(order, comparatorArrayByElemName))
                .map(({ id, name }) => (
                  <TableRow
                    key={id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    data-cy={TABLE_BY_QUESTION_ENTRY_CY}
                  >
                    {getResponseForUserId(id) ? (
                      <>
                        <TableCell
                          component="th"
                          scope="row"
                          align="left"
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleUserClicked(id)}
                          data-cy={TABLE_BY_QUESTION_USER_ID_HEADER_CY}
                        >
                          {name}
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{ maxWidth: 350 }}
                          data-cy={TABLE_BY_QUESTION_ANSWER_DATA_CY}
                        >
                          {getResponseDataForUserId(id)}
                        </TableCell>
                        <TableCell
                          align="left"
                          data-cy={TABLE_BY_QUESTION_DATE_DATA_CY}
                        >
                          {getResponseDateForUserId(id)}
                        </TableCell>
                        <TableCell
                          align="left"
                          data-cy={TABLE_BY_QUESTION_CORRECT_ICON_CY}
                        >
                          {computeCorrectness(
                            getResponseForUserId(id)?.data,
                            question.data
                          ) ? (
                            <CheckCircleOutlined color="success" />
                          ) : (
                            <CancelOutlined color="error" />
                          )}
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell
                          component="th"
                          scope="row"
                          align="left"
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleUserClicked(id)}
                          data-cy={TABLE_BY_QUESTION_USER_ID_HEADER_CY}
                        >
                          {name}
                        </TableCell>
                        <TableCell
                          colSpan={3}
                          align="center"
                          data-cy={TABLE_BY_QUESTION_ANSWER_DATA_CY}
                        >
                          {t('Not yet answered')}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
};

export default TableByQuestion;
