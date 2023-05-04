import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CircularProgress, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { hooks } from '../../config/queryClient';
import { TABLE_BY_QUESTION_CONTAINER_CY } from '../../config/selectors';
import {
  useMaxAvailableHeightInWindow,
  useMaxAvailableHeightWithParentHeight,
} from '../../hooks/useMaxAvailableHeight';
import {
  Order,
  comparatorArrayBySecondElem,
  getComparator,
} from '../../utils/tableUtils';
import { QuizContext } from '../context/QuizContext';
import {
  getAllAppDataByQuestionId,
  getAllAppDataByUserId,
} from '../context/utilities';
import AutoScrollableMenu from '../navigation/AutoScrollableMenu';
import ResultTablesMenu from '../navigation/ResultTablesMenu';
import TabPanel from '../navigation/TabPanel';
import TableByQuestion from './TableByQuestion';
import TableByUser from './TableByUser';

const TABLE_BY_QUESTION_PANEL_IDX = 0;
const TABLE_BY_USER_PANEL_IDX = 1;

/**
 * Component that represents the result tables
 *
 * @param headerElem The element that represents the header, if no header, simply let it to undefined
 * this header is used to calculate the space left for the body of this component
 */
const ResultTables = ({ headerElem }) => {
  const { t } = useTranslation();
  const { data: responses, isLoading } = hooks.useAppData();
  const { data, isContextLoading } = hooks.useAppContext();
  const { order, questions } = useContext(QuizContext);
  const questionContainerRef = useRef(null);
  const userContainerRef = useRef(null);
  const [tab, setTab] = useState(0);
  const tableMenuElem = useRef(null);
  const maxResultViewHeight = useMaxAvailableHeightInWindow(headerElem.current);
  const maxHeightScrollableMenu = useMaxAvailableHeightWithParentHeight(
    maxResultViewHeight,
    tableMenuElem.current
  );
  // Use a ref here, so that we can reset it from the child component (AutoScrollableMenu), without triggering a
  //re-render. We have to reset it in the child component, so that it only scroll to this value only once
  const initiallyClickedQuestion = useRef(null);
  const initiallyClickedUser = useRef(null);

  /**
   * Store a reference to every TableByQuestion element
   *
   * useRef is used to prevent to component to re-render upon every questionRefs changes
   */
  const questionRefs = useRef({});
  const userRefs = useRef({});

  /**
   * Helper function to extract the data from the questions
   *
   * add a property `innerLink` that represents the link to use as hash link
   */
  const extractQuestionData = useCallback(() => {
    return questions
      .groupBy((q) => q.id)
      .map((e) => {
        return e.map((el) => {
          return {
            ...el.data,
            innerLink: el.data.question.replaceAll(' ', '-'),
          };
        });
      });
  }, [questions]);

  const [questionData, setQuestionData] = useState(extractQuestionData());

  /**
   * Callback that is called when a question is clicked on in the
   * tableByUser component, so that we are redirected to the corresponding
   * question in the tableByQuestion
   */
  const handleQuestionClicked = useCallback(
    (qId) => {
      initiallyClickedQuestion.current = questionData
        .get(qId)
        .first().innerLink;
      setTab(TABLE_BY_QUESTION_PANEL_IDX);
    },
    [questionData]
  );

  /**
   * Callback that is called when a user is clicked on in the
   * tableByQuestion component, so that we are redirected to the corresponding
   * user in the tableByUser
   */
  const handleUserClicked = useCallback((qName) => {
    initiallyClickedUser.current = qName.replaceAll(' ', '-');
    setTab(TABLE_BY_USER_PANEL_IDX);
  }, []);

  /**
   * Helper function to get the name of all users that have answered to at least one question.
   *
   * @returns Immutable set of user's memberId
   */
  const getAllUsers = useCallback(() => {
    return responses?.map((r) => r.memberId).toSet();
  }, [responses]);

  const [users, setUsers] = useState(getAllUsers());

  /**
   * Helper function to construct a list that will contain a tuple of member id along with its name
   *
   * Will only contains member that have answered at least one question
   * Will directly sort the list ascending to navigate more easily in students
   *
   * @returns A list of tuple from user name to its id
   */
  const getUserIdToName = useCallback(() => {
    const listIdNames = data?.members?.reduce((acc, cur) => {
      return users.contains(cur.id) ? [...acc, [cur.id, cur.name]] : acc;
    }, []);
    // directly sort the list descending
    return listIdNames?.sort(
      getComparator(Order.ASC, comparatorArrayBySecondElem)
    );
  }, [data, users]);

  const [membersIdName, setMembersIdName] = useState(getUserIdToName());

  useEffect(() => {
    setMembersIdName(getUserIdToName());
  }, [data, getUserIdToName]);

  useEffect(() => {
    setUsers(getAllUsers());
  }, [responses, getAllUsers]);

  useEffect(() => {
    setQuestionData(extractQuestionData());
  }, [questions, extractQuestionData]);

  if (isLoading || isContextLoading) {
    return <CircularProgress />;
  }

  return order.length > 0 ? (
    users?.size > 0 ? (
      <Stack direction="row" spacing={5}>
        <Box sx={{ maxHeight: maxResultViewHeight }}>
          <ResultTablesMenu
            tab={tab}
            setTab={setTab}
            tableMenuElem={tableMenuElem}
          />
          <Box sx={{ maxHeight: maxHeightScrollableMenu, overflow: 'auto' }}>
            <TabPanel tab={tab} index={TABLE_BY_QUESTION_PANEL_IDX}>
              <AutoScrollableMenu
                links={order?.map((qId) => {
                  const data = questionData.get(qId).first();
                  return { label: data.question, link: data.innerLink };
                })}
                elemRefs={questionRefs}
                containerRef={questionContainerRef}
                initiallyClickedId={initiallyClickedQuestion}
              />
            </TabPanel>
            <TabPanel tab={tab} index={TABLE_BY_USER_PANEL_IDX}>
              <AutoScrollableMenu
                links={membersIdName?.map(([uId, uName]) => {
                  return { label: uName, link: uId.replaceAll(' ', '-') };
                })}
                elemRefs={userRefs}
                containerRef={userContainerRef}
                initiallyClickedId={initiallyClickedUser}
              />
            </TabPanel>
          </Box>
        </Box>
        <TabPanel tab={tab} index={TABLE_BY_QUESTION_PANEL_IDX}>
          <Box
            sx={{
              overflow: 'auto',
              width: '100%',
              height: maxResultViewHeight,
              pr: 1,
              scrollBehavior: 'smooth',
            }}
            ref={questionContainerRef}
          >
            {order?.map((qId) => (
              <Box
                key={qId}
                id={questionData?.get(qId).first().innerLink}
                ref={(elm) => (questionRefs.current[qId] = elm)}
              >
                <TableByQuestion
                  userList={membersIdName}
                  question={{ id: qId, data: questionData?.get(qId).first() }}
                  responses={getAllAppDataByQuestionId(responses, qId)}
                  handleUserClicked={handleUserClicked}
                />
              </Box>
            ))}
          </Box>
        </TabPanel>
        <TabPanel tab={tab} index={TABLE_BY_USER_PANEL_IDX}>
          <Box
            sx={{
              overflow: 'auto',
              width: '100%',
              height: maxResultViewHeight,
              pr: 1,
              scrollBehavior: 'smooth',
            }}
            ref={userContainerRef}
          >
            {membersIdName?.map(([uId, uName]) => (
              <Box
                key={uId}
                id={uId.replaceAll(' ', '-')}
                ref={(elm) => (userRefs.current[uId] = elm)}
              >
                <TableByUser
                  user={uName}
                  questions={questions}
                  responses={getAllAppDataByUserId(responses, uId)}
                  handleQuestionClicked={handleQuestionClicked}
                />
              </Box>
            ))}
          </Box>
        </TabPanel>
      </Stack>
    ) : (
      <Typography align="center" data-cy={TABLE_BY_QUESTION_CONTAINER_CY}>
        {t('No users answered the quiz yet')}
      </Typography>
    )
  ) : (
    <Typography align="center" data-cy={TABLE_BY_QUESTION_CONTAINER_CY}>
      {t("There isn't any question to display")}
    </Typography>
  );
};

export default ResultTables;
