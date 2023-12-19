import {
  AppData,
  AppDataVisibility,
  CompleteMember,
  DiscriminatedItem,
  MemberType,
} from '@graasp/sdk';

import { APP_DATA_TYPES } from '../config/constants';

const datesFactory = () => ({
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
  ...datesFactory(),
});

export const mockItemFactory = (id: string): DiscriminatedItem =>
  ({
    id,
  } as DiscriminatedItem);

// TODO: fix any
export const mockAppDataFactory = ({
  item,
  member,
  creator = member,
  data,
  id,
}: {
  item: DiscriminatedItem;
  member: CompleteMember;
  creator?: CompleteMember;
  data: any;
  id: string;
}): AppData => ({
  item,
  member,
  creator,
  ...datesFactory(),
  data,
  id,
  visibility: AppDataVisibility.Member,
  type: APP_DATA_TYPES.RESPONSE,
});

export const mockMultipleAppDataFactory = ({
  item,
  member,
  creator = member,
  payloads,
}: {
  item: DiscriminatedItem;
  member: CompleteMember;
  creator?: CompleteMember;
  payloads: {
    data: any;
    id: string;
  }[];
}): AppData[] =>
  payloads.map(({ id, data }) =>
    mockAppDataFactory({
      item,
      member,
      creator,
      data,
      id,
    })
  );

export const mockAppSettingFactory = ({
  id,
  name,
  item,
  data,
}: {
  id: string;
  name: string;
  item: DiscriminatedItem;
  data: any;
}) => ({
  id,
  item,
  data,
  name,
  ...datesFactory(),
});
