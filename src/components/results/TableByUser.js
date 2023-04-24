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

import {
  TABLE_BY_USER_ANSWER_DATA_CY,
  TABLE_BY_USER_CONTAINER_CY,
  TABLE_BY_USER_CORRECT_ICON_CY,
  TABLE_BY_USER_DATE_DATA_CY,
  TABLE_BY_USER_ENTRY_CY,
  TABLE_BY_USER_QUESTION_NAME_HEADER_CY,
  buildTableByUserAnswerHeaderCy,
  buildTableByUserCorrectHeaderCy,
  buildTableByUserCy,
  buildTableByUserDateHeaderCy,
  buildTableByUserQuestionHeaderCy,
  buildTableByUserTableBodyCy,
} from '../../config/selectors';
import { Order, getComparator } from '../../utils/tableUtils';
import {
  computeCorrectness,
  getQuestionNameFromId,
} from '../context/utilities';

/**
 * Component that represents a table for a given users along with his responses to the quiz
 *
 * @param {string} user The user id
 * @param questions The list of questions in the quiz
 * @param responses The list of responses that the current user gave
 * @param handleQuestionClicked A callback function that is called when a question is clicked
 */
const TableByUser = ({ user, questions, responses, handleQuestionClicked }) => {
  const { t } = useTranslation();
  const [order, setOrder] = useState(Order.ASC);

  /**
   * Lest of question names that the user answered
   */
  const [questionNames, setQuestionNames] = useState(
    responses.map((res) =>
      getQuestionNameFromId(questions, res.data.questionId)
    )
  );

  /**
   * Map of responses grouped by question name
   */
  const [responsesByQuestionName, setResponsesByQuestionName] = useState(
    responses.groupBy((res) =>
      getQuestionNameFromId(questions, res.data.questionId)
    )
  );

  /**
   * Map of question grouped by question name
   */
  const [questionByName, setQuestionByName] = useState(
    questions.groupBy((question) => question?.data?.question)
  );

  useEffect(
    () =>
      setResponsesByQuestionName(
        responses.groupBy((res) =>
          getQuestionNameFromId(questions, res.data.questionId)
        )
      ),
    [responses, questions]
  );

  useEffect(
    () =>
      setQuestionNames(
        responses.map((res) =>
          getQuestionNameFromId(questions, res.data.questionId)
        )
      ),
    [responses, questions]
  );

  useEffect(
    () =>
      setQuestionByName(
        questions.groupBy((question) => question?.data?.question)
      ),
    [questions]
  );

  /**
   * Helper function to invert the current order when clicking on sorted column header
   */
  const handleRequestSort = () => {
    const isAsc = order === Order.ASC;
    setOrder(isAsc ? Order.DESC : Order.ASC);
  };

  /**
   * Helper function to extract the response from a question name
   *
   * @param {string} qName The name of the question
   * @returns A user response
   */
  const getResponseForQuestionName = (qName) => {
    return responsesByQuestionName.get(qName)?.first();
  };

  /**
   * Helper function to extract the data of one question given its name for the current user.
   *
   * @param {string} qName The name of the question
   * @returns {string} Response for given user.
   */
  const getResponseDataForQuestionName = (qName) => {
    const { text, value, choices } = getResponseForQuestionName(qName)
      ?.data ?? {
      text: '',
    };

    // return the first valid value in three possible name of values or empty if all nullish
    return text ?? value ?? choices?.join(', ') ?? '';
  };

  /**
   * Helper function to extract the date at which the user answered the question
   *
   * @param {string} qName The name of the question
   * @returns {string} return the date of answer's last modification
   */
  const getResponseDateForQuestionName = (qName) => {
    const updatedAt = getResponseForQuestionName(qName)?.updatedAt;

    return updatedAt ? new Date(updatedAt).toDateString() : '';
  };

  return (
    <Box sx={{ mb: 8 }} data-cy={TABLE_BY_USER_CONTAINER_CY}>
      <Stack direction="column" spacing={4}>
        <Typography
          variant="h5"
          component="h5"
          data-cy={buildTableByUserCy(user)}
        >
          {user}
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
                    data-cy={buildTableByUserQuestionHeaderCy(user)}
                  >
                    {t('Question')}
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
                  data-cy={buildTableByUserAnswerHeaderCy(user)}
                >
                  {t('Answer')}
                </TableCell>
                <TableCell
                  align="left"
                  data-cy={buildTableByUserDateHeaderCy(user)}
                >
                  {t('Date')}
                </TableCell>
                <TableCell
                  align="left"
                  data-cy={buildTableByUserCorrectHeaderCy(user)}
                >
                  {t('Correct')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody data-cy={buildTableByUserTableBodyCy(user)}>
              {questionNames?.sort(getComparator(order)).map((qName) => (
                <TableRow
                  key={qName}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  data-cy={TABLE_BY_USER_ENTRY_CY}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    align="left"
                    sx={{ cursor: 'pointer' }}
                    onClick={() =>
                      handleQuestionClicked(
                        questionByName.get(qName).first().id
                      )
                    }
                    data-cy={TABLE_BY_USER_QUESTION_NAME_HEADER_CY}
                  >
                    {qName}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ maxWidth: 350 }}
                    data-cy={TABLE_BY_USER_ANSWER_DATA_CY}
                  >
                    {getResponseDataForQuestionName(qName)}
                  </TableCell>
                  <TableCell align="left" data-cy={TABLE_BY_USER_DATE_DATA_CY}>
                    {getResponseDateForQuestionName(qName)}
                  </TableCell>
                  <TableCell
                    align="left"
                    data-cy={TABLE_BY_USER_CORRECT_ICON_CY}
                  >
                    {computeCorrectness(
                      getResponseForQuestionName(qName)?.data,
                      questionByName.get(qName).first()?.data
                    ) ? (
                      <CheckCircleOutlined color="success" />
                    ) : (
                      <CancelOutlined color="error" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
};

export default TableByUser;
