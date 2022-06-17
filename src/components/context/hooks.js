import { useContext } from "react";
import { TokenContext } from "./TokenContext";
import { Context } from "./ContextContext";
import { hooks } from "../../config/queryClient";

export const useAppData = () => {
  const context = useContext(Context);
  const token = useContext(TokenContext);
  const query = hooks.useAppData({ token, itemId: context?.get("itemId") });
  return query;
};
//return { ...query, data: query.data?.filter}
export const getDataWithId = (id) => {
  const query = useAppData();
  //return { ...query, data: query.data?.filter(_.id === id )}
  return query.data?.filter((d) => d.id === id);
};

// react contexts
export const useAppSettings = () => {
  const context = useContext(Context);
  const token = useContext(TokenContext);
  const query = hooks.useAppSettings({ token, itemId: context?.get("itemId") });
  return query;
};

export const useAppContext = () => {
  const context = useContext(Context);
  const token = useContext(TokenContext);
  const query = hooks.useAppContext({ token, itemId: context?.get("itemId") });
  return query;
};
