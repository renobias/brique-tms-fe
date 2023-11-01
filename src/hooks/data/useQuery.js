import { pickDataProvider } from "../../definitions/helpers";
import { useDataProvider } from "./useDataProvider";
import { useNotification } from "../utility";
import { useState } from "react";
import { useApiSecurity } from "../security";
import { isNoResidue } from "../../rest-data-provider/queueMachine/utils/flag";

export function useQuery({
  dataProviderName,
  resource,
  query,
  meta,
  handleResult,
}) {
  const { openNotification } = useNotification();
  const dataProvider = useDataProvider();
  const apiSecurity = useApiSecurity();
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
    meta: metaFire,
    handleResult: handleResultFire,
  }) {
    //   async function fire() {
    try {
      setState({
        ...state,
        isLoading: true,
      });
      const { data, status, statusText } = await dataProvider(
        pickDataProvider(dataProviderNameFire || dataProviderName)
      ).getQuery({
        resource: resourceFire || resource,
        query: queryFire || query,
        meta: metaFire || meta,
      });
      state.isLoading = false;
      state.data = data;
      state.statusCode = status;
      state.message = statusText;
      return { state };
    } catch (error) {
      state.statusCode = error?.statusCode;
      state.message = error?.message;
      state.gnrMessage = error?.gnrMessage;

      if (isNoResidue(error?.statusCode)) {
        return { state };
      }

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
      apiSecurity(state.statusCode);
      if (handleResultFire) {
        handleResultFire();
      } else if (handleResult) {
        handleResult();
      }
    }
  }

  return {
    fire,
    state,
  };
}
