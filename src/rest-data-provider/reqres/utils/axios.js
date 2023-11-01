import axios from "axios";

const reqresAxios = axios.create();

reqresAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if(error.response){
      const customError = {
        ...error,
        statusCode: error.response.status || error.response.statusCode || 'unidentified',
        message: error.response.data.error || error.response.statusText || error.response.statusMessage || error.response.message || error.response.messageerror || "Terjadi kesalahan pada server",
        gnrMessage : "Terjadi kesalahan pada server"
      }
      return Promise.reject(customError);
    }else if(error.request) {
      const customError = {
        ...error,
        statusCode: error.status || error.statusCode || 'unidentified',
        message: error.statusText || error.statusMessage || error.message || error.messageerror || "Terjadi kendala pada jaringan",
        gnrMessage : "Terjadi kendala pada jaringan"
      };
  
      return Promise.reject(customError);
    }
  }
);

export { reqresAxios };
