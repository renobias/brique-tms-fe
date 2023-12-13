import React, { useEffect, useState } from "react";
import axios from "axios";
import { reqresAxios } from "../../rest-data-provider/reqres/utils";
import { useMessage } from "./useMessage";
import { briqueTmsAxios } from "../../rest-data-provider/briqueTms/utils/axios";

export const useBaseApi = (httpClient = briqueTmsAxios) => {
  const [baseApi, setBaseApi] = useState(null);
  const { openMessage } = useMessage();

  const getBaseUrlClientType = () => {
    switch (httpClient) {
      case briqueTmsAxios:
        return "URL_SERVER_BRIQUE_TMS";
      case reqresAxios:
        return "URL_SERVER_REQRES";
      default:
        return "URL_SERVER_REQRES";
    }
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: "/config.json",
    })
      .then(({ data }) => {
        setBaseApi(data[getBaseUrlClientType()]);
      })
      .catch((error) => {
        console.log("error get base api -> ", error);
        openMessage({
          type: "error",
          content: "failed to get of base api",
        });
      });
  }, []);
  return baseApi;
};
