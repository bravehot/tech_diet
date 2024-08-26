import axios from "axios";
import Toast from "react-native-toast-message";

import type { AxiosRequestConfig, AxiosResponse } from "axios";

let catchRequestFunc: Array<() => void> = [];

const netWorkCodeMaps: Record<number, string> = {
  404: "404 Not Found",
  405: "Method Not Allowed",
  504: "网关错误",
  500: "服务器错误",
} as const;

const axiosInterface = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  timeout: 10000,
  headers: {
    "content-type": "application/json",
  },
});

const handleRefreshToken = async () => {};

axiosInterface.interceptors.response.use(
  async (response: AxiosResponse<API.BaseResponseType<any>>) => {
    const { status, data } = response;
    if (status === 200) {
      const { code, message } = data;
      const responseCode = Number(code);

      // token 过期
      if (responseCode == 401) {
        // 缓存过期后的请求函数
        new Promise((resolve) => {
          catchRequestFunc.push(() => {
            resolve(request(response.config));
          });
        });
        // 通过 reference token 获取新 token
        await handleRefreshToken();
      } else if (responseCode === 403) {
        // router.push({
        //   name: "homePage",
        // });
      } else if (responseCode !== 200) {
        // 业务中非 200 的状态码一律弹出
        Toast.show({
          type: "error",
          text1: message,
        });
      }
    }
    return response;
  },
  ({ response }) => {
    // 请求失败，也弹出状态码
    Toast.show({
      type: "error",
      text1: netWorkCodeMaps[response.status] || "服务器错误",
    });
  }
);

const request = async <T>(
  config: AxiosRequestConfig
): Promise<API.BaseResponseType<T>> => {
  try {
    const { data } = await axiosInterface(config);
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};
export default request;
