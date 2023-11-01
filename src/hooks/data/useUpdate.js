import { pickDataProvider } from "../../definitions/helpers";
import { useDataProvider } from "./useDataProvider";
import { useNotification } from "../utility";
import { useState } from "react";

export function useUpdate({ dataProviderName, resource, id, variables, meta }) {
  const { openNotification } = useNotification();
  const dataProvider = useDataProvider();
  const [state, setState] = useState({
    isLoading: false,
    data: {},
    statusCode: "",
    message: "",
    gnrMessage: "",
  });

  // async function fire({ dataProviderName: dataProviderNameFire, resource: resourceFire, id: idFire, variables: variablesFire, meta: metaFire }) {
  async function fire() {
    try {
      setState({
        ...state,
        isLoading: true,
      });
      // const { data, status, statusText } = await dataProvider(pickDataProvider(dataProviderNameFire || dataProviderName)).create({ resource: resourceFire || resource, id: idFire || id, variables: variablesFire || variables, meta: metaFire || meta });
      const { data, status, statusText } = await dataProvider(
        pickDataProvider(dataProviderName)
      ).create({ resource, id, variables, meta });
      state.isLoading = false;
      state.data = data;
      state.statusCode = status;
      state.message = statusText;
      return { state };
    } catch (error) {
      state.statusCode = error?.statusCode;
      state.message = error?.message;
      state.gnrMessage = error?.gnrMessage;
      openNotification({
        title: state.gnrMessage,
        description: `Error (status code: ${state.statusCode} description: ${state.message})`,
        type: "error",
      });
      return { state };
    } finally {
      setState({
        ...state,
        isLoading: false,
      });
    }
  }

  return {
    fire,
    state,
  };
}
