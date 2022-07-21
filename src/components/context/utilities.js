export const getDataWithId = (data, id) => {
  return data?.filter((d) => d.id === id)?.first();
};

export const getDataWithType = (data, name) => {
  return data?.filter((d) => d.name === name);
};

export const isDifferent = (obj1, obj2) => {
  console.log('isDifferent: ', obj1, obj2);
  return JSON.stringify(obj1) !== JSON.stringify(obj2);
};
