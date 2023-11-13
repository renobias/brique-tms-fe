import queryString from "query-string";
import { briqueTmsAxios } from "./utils";
import { authProvider } from "../../authProvider";

export const briqueTmsDataProvider = (apiUrl, httpClient = briqueTmsAxios) => ({
  post: async ({ resource, variables, meta, query }) => {
    const identity = authProvider.getIdentity();

    const url = query
      ? `${apiUrl}/${resource}/?${queryString.stringify({
          ...query,
          accessToken: identity?.token,
        })}`
      : `${apiUrl}/${resource}?accessToken=${identity?.token}`;

    const { headers, method } = meta ?? {};
    const requestMethod = method ?? "post";

    const { data, status, statusText } = await httpClient[requestMethod](
      url,
      variables,
      {
        headers,
      }
    );

    return {
      data,
      status,
      statusText,
    };
  },

  get: async ({ resource, meta, query }) => {
    const identity = authProvider.getIdentity();

    const url = query
      ? `${apiUrl}/${resource}/?${queryString.stringify({
          ...query,
          accessToken: identity?.token,
        })}`
      : `${apiUrl}/${resource}?accessToken=${identity?.token}`;

    console.log("url -> ", url);

    const { headers, method } = meta ?? {};
    const requestMethod = method ?? "get";

    const { data, status, statusText } = await httpClient[requestMethod](url, {
      headers,
    });

    return {
      data,
      status,
      statusText,
    };
  },

  delete: async ({ resource, variables, meta, query }) => {
    const url = query
      ? `${apiUrl}/${resource}/?${queryString.stringify({ ...query })}`
      : `${apiUrl}/${resource}`;

    const { headers, method } = meta ?? {};
    const requestMethod = method ?? "delete";

    const { data, status, statusText } = await httpClient[requestMethod](url, {
      data: variables,
      headers,
    });

    return {
      data,
      status,
      statusText,
    };
  },

  postForm: async ({ resource, meta, query, variables }) => {
    let url = `${apiUrl}/${resource}`;
    const urlQuery = `${apiUrl}/${resource}/?${queryString.stringify({
      ...query,
    })}`;
    url = query ? urlQuery : url;

    const { headers, method } = meta ?? {};
    const requestMethod = method ?? "postForm";

    const { data, status, statusText } = await httpClient[requestMethod](
      url,
      variables,
      {
        headers,
      }
    );

    return {
      data,
      status,
      statusText,
    };
  },

  getApiUrl: () => {
    return apiUrl;
  },

  custom: async () => {},
});
