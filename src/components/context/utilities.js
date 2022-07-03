//return { ...data, data: data.data?.filter}
export const getDataWithId = (data, id) => {
  return data?.filter((d) => d.id === id)?.get(0);
};

export const getDataWithType = (data, type) => {
  return data?.filter((d) => d.type === type);
};
