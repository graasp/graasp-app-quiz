import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';

import { hooks } from '../../config/queryClient';
import { TABLE_BY_QUESTION_CONTAINER_CY } from '../../config/selectors';
import { QuizContext } from '../context/QuizContext';
import { getAllAppDataByQuestionId, getDataWithId } from '../context/utilities';
import TableByQuestion from './TableByQuestion';

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
const ResultTables = () => {
  const { t } = useTranslation();
  const { data: responses, isLoading } = hooks.useAppData();
  const { order, questions } = useContext(QuizContext);

  /**
   * Helper function to get the name of all users that have answered to at least one question.
   *
   * @returns Immutable set of user's memberId
   */
  const getAllUsers = useCallback(() => {
    return responses?.map((r) => r.memberId).toSet();
  }, [responses]);

  const [users, setUsers] = useState(getAllUsers());

  useEffect(() => {
    setUsers(getAllUsers());
  }, [responses, getAllUsers]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return order.length > 0 ? (
    order.map((qId) => (
      <TableByQuestion
        key={qId}
        userList={users}
        question={{ id: qId, data: getDataWithId(questions, qId).data }}
        responses={getAllAppDataByQuestionId(responses, qId)}
      />
    ))
  ) : (
    <Typography align="center" data-cy={TABLE_BY_QUESTION_CONTAINER_CY}>
      {t("There isn't any questions to display")}
    </Typography>
  );
};

export default ResultTables;
