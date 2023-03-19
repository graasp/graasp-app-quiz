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
import { Order, getComparator } from '../../utils/tableUtils';
import { computeCorrectness } from '../context/utilities';

const TableByQuestion = ({ question, userList, responses }) => {
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
    <Box sx={{ mb: 8 }}>
      <Stack direction="column" spacing={4}>
        <Typography variant="h5" component="h5">
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
                <TableCell align="left">{t('Answer')}</TableCell>
                <TableCell align="left">{t('Date')}</TableCell>
                <TableCell align="left">{t('Correct')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.sort(getComparator(order)).map((userId) => (
                <TableRow
                  key={userId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {getResponseForUserId(userId) ? (
                    <>
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
                          <CheckCircleOutlined color="success" />
                        ) : (
                          <CancelOutlined color="error" />
                        )}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell component="th" scope="row" align="left">
                        {userId}
                      </TableCell>
                      <TableCell colSpan={3} align="center">
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
