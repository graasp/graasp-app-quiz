import { chloe } from "./appDataChloe";
import { emily } from "./appDataEmily";
import { james } from "./appDataJames";
import { jessica } from "./appDataJessica";
import { luca } from "./appDataLuca";
import { micheal } from "./appDataMicheal";
import { olivia } from "./appDataOlivia";
import { sarah } from "./appDataSarah";
import { william } from "./appDataWilliam";
import { xavier } from "./appDataXavier";
import { mockMemberFactory } from "./factories";

export const mockCurrentMember = mockMemberFactory({
  id: '0f0a2774-a965-4b97-afb4-bccc3796e060',
  name: 'anna',
});

export const mockMembers = [
  mockCurrentMember,
  james,
  sarah,
  emily,
  micheal,
  jessica,
  william,
  olivia,
  chloe,
  xavier,
  luca,
];
