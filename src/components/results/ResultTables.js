import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { useTranslation } from 'react-i18next';

import { CircularProgress, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { hooks } from '../../config/queryClient';
import { TABLE_BY_QUESTION_CONTAINER_CY } from '../../config/selectors';
import { QuizContext } from '../context/QuizContext';
import { getAllAppDataByQuestionId } from '../context/utilities';
import AutoScrollableMenu from '../navigation/AutoScrollableMenu';
import TableByQuestion from './TableByQuestion';

/**
 * Component that represents the result tables
 *
 * @param headerElem The element that represents the header, if no header, simply let it to undefined
 * this header is used to calculate the space left for the body of this component
 */
const ResultTables = ({ headerElem }) => {
  const { t } = useTranslation();
  const { data: responses, isLoading } = hooks.useAppData();
  const { order, questions } = useContext(QuizContext);
  const questionContainerRef = useRef(null);

  /**
   * Store a reference to every TableByQuestion element
   *
   * useRef is used to prevent to component to re-render upon every questionRefs changes
   */
  const questionRefs = useRef({});

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
   * Helper function to calculate the full height of an element, take margin into account
   */
  const getElemFullHeight = useCallback((elem) => {
    const elemStyle = getComputedStyle(elem);
    return (
      elem.offsetHeight +
      parseInt(elemStyle.marginTop) +
      parseInt(elemStyle.marginBottom)
    );
  }, []);

  /**
   * Stores the height of the header, dynamically updated if it is resized
   */
  const headerHeight = useSyncExternalStore(
    (callback) => {
      headerElem?.current.addEventListener('resize', callback);
      return () => headerElem?.current.removeEventListener('resize', callback);
    },
    () => {
      return getElemFullHeight(headerElem?.current ?? 0);
    }
  );

  /**
   * Stores the height of the viewport, dynamically updated if it is resized
   */
  const windowHeight = useSyncExternalStore(
    (callback) => {
      window.addEventListener('resize', callback);
      return () => window.removeEventListener('resize', callback);
    },
    () => {
      return window.innerHeight;
    }
  );

  /**
   * Helper function that returns the max height that the displayed component can have
   * to not overflow out of the window.
   */
  const calcMaxHeight = useCallback(() => {
    return windowHeight - headerHeight - 16; // 16 is just empirically determined to prevent the page scroll bar to display
  }, [windowHeight, headerHeight]);

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

  useEffect(() => {
    setQuestionData(extractQuestionData());
  }, [questions, extractQuestionData]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return order.length > 0 ? (
    <Stack direction="row" spacing={5}>
      <Box sx={{ maxHeight: calcMaxHeight(), overflow: 'auto' }}>
        <AutoScrollableMenu
          links={order.map((qId) => {
            const data = questionData.get(qId).first();
            return { label: data.question, link: data.innerLink };
          })}
          elemRefs={questionRefs}
          containerRef={questionContainerRef}
        />
      </Box>
      <Box
        sx={{
          overflow: 'auto',
          width: '100%',
          height: calcMaxHeight(),
          pr: 1,
          scrollBehavior: 'smooth',
        }}
        ref={questionContainerRef}
      >
        {order.map((qId) => (
          <Box
            key={qId}
            id={questionData?.get(qId).first().innerLink}
            ref={(elm) => (questionRefs.current[qId] = elm)}
          >
            <TableByQuestion
              userList={users}
              question={{ id: qId, data: questionData?.get(qId).first() }}
              responses={getAllAppDataByQuestionId(responses, qId)}
            />
          </Box>
        ))}
      </Box>
    </Stack>
  ) : (
    <Typography align="center" data-cy={TABLE_BY_QUESTION_CONTAINER_CY}>
      {t("There isn't any questions to display")}
    </Typography>
  );
};

export default ResultTables;
