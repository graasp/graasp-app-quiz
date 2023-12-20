import { Data } from '@graasp/apps-query-client';
import {
  AppData,
  AppDataVisibility,
  AppSetting,
  CompleteMember,
  DiscriminatedItem,
  MemberType,
} from '@graasp/sdk';

import { APP_DATA_TYPES } from '../config/constants';

export const datesFactory = ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const mockMemberFactory = ({
  id,
  name,
}: {
  id: string;
  name: string;
}): CompleteMember => ({
  id,
  name,
  email: `${name}@gmail.com`,
  extra: {},
  type: MemberType.Individual,
  ...datesFactory,
});

export const mockAppDataFactory = <T extends Data>({
  item,
  creator,
  member = creator,
  data,
  id,
}: {
  item: DiscriminatedItem;
  creator: CompleteMember;
  member?: CompleteMember;
  data: T;
  id: string;
}): AppData<T> => ({
  item,
  member,
  creator,
  ...datesFactory,
  data,
  id,
  visibility: AppDataVisibility.Member,
  type: APP_DATA_TYPES.RESPONSE,
});

export const mockMultipleAppDataFactory = <T extends Data,>({
  item,
  creator,
  member = creator,
  payloads,
}: {
  item: DiscriminatedItem;
  member?: CompleteMember;
  creator: CompleteMember;
  payloads: {
    data: T;
    id: string;
  }[];
}): AppData<T>[] =>
  payloads.map(({ id, data }) =>
    mockAppDataFactory({
      item,
      member,
      creator,
      data,
      id,
    })
  );

export const mockAppSettingFactory = <T extends Data,>({
  id,
  name,
  item,
  data,
}: {
  id: string;
  name: string;
  item: DiscriminatedItem;
  data: T;
}): AppSetting<T> => ({
  id,
  item,
  data,
  name,
  ...datesFactory,
});
