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

  getList: async ({ resource, pagination, searching, meta }) => {
    const identity = authProvider.getIdentity();
    const url = `${apiUrl}/${resource}`;

    const { current = 1, pageSize = 10, mode = "server" } = pagination ?? {};
    const { keyword = "" } = searching ?? {};

    const { headers: headersFromMeta, method } = meta ?? {};
    const requestMethod = method ?? "get";

    const query = {
      accessToken: String,
      page: Number,
      per_page: Number,
      keyword_search: String,
    };

    if (mode === "server") {
      query.accessToken = identity?.token;
      query.page = current;
      query.per_page = pageSize;
      query.keyword_search = keyword;
    }

    const { data, status, statusText, headers } = await httpClient[
      requestMethod
    ](`${url}?${queryString.stringify(query)}`, {
      headers: headersFromMeta,
    });

    return {
      page: data?.page,
      per_page: data?.per_page,
      total_all_data: data?.total_all_data,
      total_currentpage_data: data?.total_currentpage_data,
      total_pages: data?.total_pages,
      data: data?.data,
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
