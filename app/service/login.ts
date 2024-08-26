import axios from "axios";
import request from "./request";

/**
 * 获取图形验证码
 * @returns
 */
export const getAuthCaptcha = async () => {
  return axios({
    method: "GET",
    url: `${process.env.EXPO_PUBLIC_BASE_URL}auth/captcha`,
  });
};

export const getAuthSendSms = async (params: {
  phone: string;
  captcha: string;
}) => {
  return request({
    method: "GET",
    url: `auth/sendSms`,
    params: {
      ...params,
      templateId: 1478279,
    },
  });
};
