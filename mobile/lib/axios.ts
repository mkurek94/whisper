import axios from "axios";
import * as Sentry from "@sentry/react-native";
import { useAuth } from "@clerk/expo";
import { useEffect } from "react";

const API_BASE_URL = "https://whisper-1-3pch.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useApi = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          Sentry.logger.error(Sentry.logger.fmt`API request failed: ${error.message}`, {
            url: error.config.url,
            method: error.config.method,
            status: error.response.status,
            responseData: error.response.data,
          });
        } else if (error.request) {
          Sentry.logger.warn(Sentry.logger.fmt`API request failed: ${error.message}`, {
            url: error.config.url,
            method: error.config.method,
          });
        }

        return Promise.reject(error);
      },
    );

    //cleanup: remove interceptor when components unmounts or getToken changes
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [getToken]);

  return api;
};
