import axios from 'axios';

import { toast } from 'react-toastify';

import { Notifier, ROUTINES } from '@graasp/apps-query-client';
import { FAILURE_MESSAGES } from '@graasp/translations';

import i18n from './i18n';

const {
  postAppSettingRoutine,
  patchAppSettingRoutine,
  deleteAppSettingRoutine,
} = ROUTINES;

// TODO: it is the same as in Builder. maybe move to SDK ?
type ErrorPayload = Parameters<Notifier>[0]['payload'] & {
  failure?: unknown[];
};

type SuccessPayload = {
  message?: string;
};

type Payload = ErrorPayload & SuccessPayload;

const getErrorMessageFromPayload = (
  payload?: Parameters<Notifier>[0]['payload']
) => {
  if (payload?.error && axios.isAxiosError(payload.error)) {
    return (
      payload.error.response?.data.message ?? FAILURE_MESSAGES.UNEXPECTED_ERROR
    );
  }

  return payload?.error?.message ?? FAILURE_MESSAGES.UNEXPECTED_ERROR;
};

const notifier: Notifier = ({
  type,
  payload,
}: {
  type: string;
  payload?: Payload;
}) => {
  let message = null;
  switch (type) {
    // error messages
    case postAppSettingRoutine.FAILURE:
    case patchAppSettingRoutine.FAILURE:
    case deleteAppSettingRoutine.FAILURE: {
      message = i18n.t(getErrorMessageFromPayload(payload));
      break;
    }
    // success messages
    case postAppSettingRoutine.SUCCESS:
    case patchAppSettingRoutine.SUCCESS: {
      message = i18n.t('The question has been successfully saved');
      break;
    }
    default:
      break;
  }
  // error notification
  if (payload?.error && message) {
    toast.error(i18n.t(message));
  }
  // success notification
  else if (message) {
    toast.success(i18n.t(message));
  }
};

export default notifier;
