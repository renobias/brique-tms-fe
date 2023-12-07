import { reqresAxios } from "./utils";
import queryString from "query-string";

export const reqresDataProvider = (apiUrl, httpClient = reqresAxios) => ({
  /** NEW */
  post: async ({ resource, variables, meta, query }) => {
    const url = query
      ? `${apiUrl}/${resource}/?${queryString.stringify({ ...query })}`
      : `${apiUrl}/${resource}`;

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
    const url = query
      ? `${apiUrl}/${resource}/?${queryString.stringify({ ...query })}`
      : `${apiUrl}/${resource}`;

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

  /** END NEW */

  getList: async ({ resource, pagination, searching, meta }) => {
    const url = `${apiUrl}/${resource}`;
    console.log("seatching -> ", searching);

    const { current = 1, pageSize = 10, mode = "server" } = pagination ?? {};
    const { keyword = "" } = searching ?? {};

    const { headers: headersFromMeta, method } = meta ?? {};
    const requestMethod = method ?? "get";

    const query = {
      page: Number,
      per_page: Number,
      keyword_search: String,
    };

    if (mode === "server") {
      query.page = current;
      query.per_page = pageSize;
      query.keyword_search = keyword;
    }

    const { data, status, statusText, headers } = await httpClient[
      requestMethod
    ](`${url}?${queryString.stringify(query)}}`, {
      headers: headersFromMeta,
    });

    return {
      page: data?.page,
      per_page: data?.per_page,
      total: data?.total,
      total_pages: data?.total_pages,
      data: data?.data,
      status,
      statusText,
    };
  },

  getMany: async ({ resource, ids, meta }) => {
    const { headers, method } = meta ?? {};
    const requestMethod = method ?? "get";

    const { data, status, statusText } = await httpClient[requestMethod](
      `${apiUrl}/${resource}?${queryString.stringify({ id: ids })}`,
      { headers }
    );

    return {
      data,
      status,
      statusText,
    };
  },

  create: async ({ resource, variables, meta }) => {
    const url = `${apiUrl}/${resource}`;

    const { headers, method } = meta ?? {};
    const requestMethod = method ?? "post";

    const { data, status, statusText } = await httpClient[requestMethod](
      url,
      variables,
      {
        headers,
      }
    );

    console.log("status =>", status);

    return {
      data,
      status,
      statusText,
    };
  },

  update: async ({ resource, id, variables, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = method ?? "put";

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

  getOne: async ({ resource, id, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

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

  deleteOne: async ({ resource, id, variables, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

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

  getApiUrl: () => {
    return apiUrl;
  },

  custom: async () => {},
});
