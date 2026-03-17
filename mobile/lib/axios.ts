import axios from "axios";
import * as Sentry from "@sentry/react-native";
import { useAuth } from "@clerk/expo";
import { useCallback } from "react";

const API_BASE_URL = "https://whisper-1-3pch.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      Sentry.logger.error(
        Sentry.logger.fmt`API request failed: ${error.message}`,
        {
          url: error.config.url,
          method: error.config.method,
          status: error.response.status,
          responseData: error.response.data,
        },
      );
    } else if (error.request) {
      Sentry.logger.warn(
        Sentry.logger.fmt`API request failed: ${error.message}`,
        {
          url: error.config.url,
          method: error.config.method,
        },
      );
    }

    return Promise.reject(error);
  },
);

export const useApi = () => {
  const { getToken } = useAuth();

  const apiWithAuth = useCallback(
    async <T>(config: Parameters<typeof api.request>[0]) => {
      const token = await getToken();
      return api.request<T>({
        ...config,
        headers: {
          ...config.headers,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
    },
    [getToken],
  );

  return { api, apiWithAuth };
};
