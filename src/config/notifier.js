import { toast } from 'react-toastify';

import { ROUTINES } from '@graasp/apps-query-client';

import i18n from './i18n';

const { postAppSettingRoutine, patchAppSettingRoutine } = ROUTINES;

const notifier = ({ type, payload }) => {
  let message = null;
  switch (type) {
    // error messages
    case postAppSettingRoutine.FAILURE:
    case patchAppSettingRoutine.FAILURE: {
      message = i18n.t(
        payload?.error?.response?.data?.message ?? 'An unexpected error occured'
      );
      break;
    }
    // success messages
    case postAppSettingRoutine.SUCCESS:
    case patchAppSettingRoutine.SUCCESS: {
      // TODO
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
