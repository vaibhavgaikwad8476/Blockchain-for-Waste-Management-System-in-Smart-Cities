import axios from "axios";
const BASE_URL = "http://localhost:8080";

export const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = JSON.parse(localStorage.getItem("token"));

    return {
      ...config,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  },
  function (error) {
    // Do something with request error
    if (error.response.status === 401) {
      window?.location?.replace("/");
    }
    return Promise.reject(error);
  }
);

// Add a response interceptor

export const getReq = async (url, config) => {
  return await instance.get(url, config);
};

export const postReq = async (url, payload, config) => {
  return await instance.post(url, payload, config);
};

export const putReq = async (url, payload, config) => {
  return await instance.put(url, payload, config);
};

export const deleteReq = async (url, config) => {
  return await instance.delete(url, config);
};
