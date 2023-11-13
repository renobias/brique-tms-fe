import { useDataProvider } from "./useDataProvider";
import { useNotification } from "../utility";
import { useEffect, useState } from "react";
import { pickDataProvider } from "../../definitions/helpers";

export function useGet({
  dataProviderName,
  resource,
  variables,
  query,
  meta,
  handleResult,
}) {
  const { openNotification } = useNotification();
  const dataProvider = useDataProvider();
  const [state, setState] = useState({
    isLoading: false,
    data: {},
    statusCode: "",
    message: "",
    gnrMessage: "",
  });

  async function fire({
    dataProviderName: dataProviderNameFire,
    resource: resourceFire,
    query: queryFire,
    variables: variablesFire,
    meta: metaFire,
    handleResult: handleResultFire,
  }) {
    // async function fire() {
    try {
      setState({
        ...state,
        isLoading: true,
      });
      const { data, status, statusText } = await dataProvider(
        pickDataProvider(dataProviderNameFire || dataProviderName)
      ).get({
        resource: resourceFire || resource,
        variables: variablesFire || variables,
        query: queryFire || query,
        meta: metaFire || meta,
      });
      // const { data, status, statusText } = await dataProvider(pickDataProvider(dataProviderName)).create({ resource, variables, meta });
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
        title: resource ? `Error on ${resource}` : state.gnrMessage,
        description: `Error (status code: ${state.statusCode} description: ${state.message})`,
        type: "error",
      });
      return { state };
    } finally {
      setState({
        ...state,
        isLoading: false,
      });
      if (handleResultFire) {
        handleResultFire();
      } else if (handleResult) {
        handleResult();
      }
    }
  }

  return { fire, state };
}
