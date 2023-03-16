import { useState } from 'react';

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
import { computeCorrectness } from '../context/utilities';

const TableByQuestion = ({ question, userList, responses }) => {
  // TODO Add translation plugin

  /**
   * Object that represent an enum with the possible value for ordering property
   *
   * @type {Readonly<{ASC: string, DESC: string}>}
   */
  const Order = Object.freeze({
    ASC: 'asc',
    DESC: 'desc',
  });

  const [order, setOrder] = useState(Order.ASC);

  /**
   * Helper function to extract the response from a particular user
   *
   * @param {string} userId The name of the user
   * @returns A user response (May be undefined if user didn't respond to the current question)
   */
  const getResponseForUserId = (userId) => {
    return responses.find(({ memberId }) => memberId === userId);
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

    return updatedAt !== undefined ? new Date(updatedAt).toDateString() : '';
  };

  /**
   * Helper function to sort the user list by their name
   *
   * Return 0 if they are equal
   * Return 1 if the first element is smaller
   * Return -1 if the second element is smaller
   *
   * @param {string} e1 The first username
   * @param {string} e2 The second username
   * @returns {number} Whether the first one or the second one is the biggest
   */
  const comparator = (e1, e2) => {
    if (e2 < e1) {
      return -1;
    }
    if (e2 > e1) {
      return 1;
    }
    return 0;
  };

  /**
   * Helper function to get the correct comparator depending on whether we are sorting ascending or descending
   *
   * @param {string} order The order for which we want to get the comparator
   * @returns {{(string, string): number}} The comparator corresponding to the required order
   */
  const getComparator = (order) =>
    order === Order.DESC
      ? (a, b) => comparator(a, b)
      : (a, b) => -comparator(a, b);

  /**
   * Helper function to invert the current order when clicking on sorted column header
   */
  const handleRequestSort = () => {
    const isAsc = order === 'asc';
    setOrder(isAsc ? Order.DESC : Order.ASC);
  };

  return (
    <Box sx={{ mb: 8 }}>
      <Stack direction={'column'} spacing={4}>
        <Typography variant={'h5'} component={'h5'}>
          {question.data.question}
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align={"left"}>
                  <TableSortLabel
                    active={true}
                    direction={order ?? 'asc'}
                    onClick={handleRequestSort}
                  >
                    {'User'}
                    {
                      <Box component="span" sx={visuallyHidden}>
                        {order === Order.DESC
                          ? 'sorted descending'
                          : 'sorted ascending'}
                      </Box>
                    }
                  </TableSortLabel>
                </TableCell>
                <TableCell align={"left"}>Answer</TableCell>
                <TableCell align={"left"}>Date</TableCell>
                <TableCell align={"left"}>Correct</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.sort(getComparator(order)).map((userId) => (
                <TableRow
                  key={userId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="left">
                    {userId}
                  </TableCell>
                  <TableCell align="left" sx={{ maxWidth: 350 }}>
                    {getResponseDataForUserId(userId)}
                  </TableCell>
                  <TableCell align="left">
                    {getResponseDateForUserId(userId)}
                  </TableCell>
                  <TableCell align="left">
                    {computeCorrectness(
                      getResponseForUserId(userId)?.data,
                      question.data
                    ) ? (
                      <CheckCircleOutlined color={'success'} />
                    ) : (
                      <CancelOutlined color={'error'} />
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

export default TableByQuestion;
