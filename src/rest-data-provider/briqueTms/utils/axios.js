import axios from "axios";

const briqueTmsAxios = axios.create();

briqueTmsAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const customError = {
        ...error,
        statusCode:
          error.response.data.errorCode ||
          error.response.status ||
          error.response.statusCode ||
          "unidentified",
        message:
          error.response.data.errorMssg ||
          error.response.statusText ||
          error.response.statusMessage ||
          error.response.message ||
          error.response.messageerror ||
          "Terjadi kesalahan pada server",
        gnrMessage: "Terjadi kesalahan pada server",
      };
      console.log("custom error -> ", customError)
      return Promise.reject(customError);
    } else if (error.request) {
      const customError = {
        ...error,
        statusCode: error.status || error.statusCode || "unidentified",
        message:
          error.statusText ||
          error.statusMessage ||
          error.message ||
          error.messageerror ||
          "Terjadi kendala pada jaringan",
        gnrMessage: "Terjadi kendala pada jaringan",
      };

      return Promise.reject(customError);
    }
  }
);

export { briqueTmsAxios };
