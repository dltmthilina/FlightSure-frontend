import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { NotificationContext } from "../contexts/NotifiContext";

export default function useApi() {
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);
  const [isLoading, setIsLoading] = useState(false);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8081/api/",
    timeout: 5000,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${authCtx?.token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  const get = async <T,>(
    url: string,
    args?: {
      onSuccessMessage?: string;
      onErrorMessage?: string;
      isSilent?: boolean;
      signal?: AbortSignal;
    }
  ): Promise<T | undefined> => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(url, {
        signal: args?.signal,
      });
      if (res.status === 200) {
        if (args?.isSilent === false) {
          notificationCtx?.showNotification(
            "success",
            args.onSuccessMessage ?? "Data was fetched successfully"
          );
        }
        return res.data;
      }
      throw new Error("Failed to fetch data");
    } catch (error: any) {
      if (error?.code === "ERR_CANCELED") {
        return;
      }
      if (error.response) {
        if (error.response.status === 401) {
          notificationCtx?.showNotification(
            "error",
            "You are not authorized to perform this action"
          );
          authCtx?.logout();
          return;
        }
        if (error.response.status === 404) {
          notificationCtx?.showNotification("error", "Resource not found");
          return;
        }
        notificationCtx?.showNotification(
          "error",
          args?.onErrorMessage ?? "Something went wrong"
        );
        return;
      } else if (error.request) {
        notificationCtx?.showNotification(
          "error",
          args?.onErrorMessage ?? "Something went wrong"
        );
        return;
      }
      notificationCtx?.showNotification("error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const post = async <T,>(
    url: string,
    payload: any,
    args?: {
      onSuccessMessage?: string;
      onErrorMessage?: string;
      isSilent?: boolean;
    }
  ): Promise<T | undefined> => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post(url, payload);
      if (res.status >= 200 && res.status < 300) {
        if (args?.isSilent !== true) {
          notificationCtx?.showNotification(
            "success",
            args?.onSuccessMessage ?? "Data was posted successfully"
          );
        }
        return res.data;
      }
      throw new Error("Failed to post data");
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          if (error.response.data.message) {
            notificationCtx?.showNotification(
              "error",
              error.response.data.message
            );
            authCtx?.logout();
            return;
          }
          if (error.response.status === 400) {
            notificationCtx?.showNotification(
              "error",
              error.response.data.message
            );
            return;
          }
          notificationCtx?.showNotification(
            "error",
            "You are not authorized to perform this action"
          );
          authCtx?.logout();
          return;
        }
        if (error.response.status === 404) {
          notificationCtx?.showNotification("error", "Resource not found");
          return;
        }
        if (
          error.response.status === 422 &&
          error.response?.data?.errors &&
          Array.isArray(error.response.data.errors)
        ) {
          notificationCtx?.showNotification(
            "error",
            error.response.data.errors[0].message
          );
          return;
        }
        notificationCtx?.showNotification(
          "error",
          args?.onErrorMessage ?? "Something went wrong"
        );
        return;
      } else if (error.request) {
        notificationCtx?.showNotification(
          "error",
          args?.onErrorMessage ?? "Something went wrong"
        );
        return;
      }
      notificationCtx?.showNotification("error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const put = async <T,>(
    url: string,
    payload: any,
    args?: {
      onSuccessMessage?: string;
      onErrorMessage?: string;
      isSilent?: boolean;
    }
  ): Promise<T | undefined> => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.put(url, payload);
      if (res.status >= 200 && res.status < 300) {
        if (args?.isSilent !== true) {
          notificationCtx?.showNotification(
            "success",
            args?.onSuccessMessage ?? "Data was modified successfully"
          );
        }
        return res.data;
      }
      throw new Error("Failed to modify data");
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          notificationCtx?.showNotification(
            "error",
            "You are not authorized to perform this action"
          );
          authCtx?.logout();
          return;
        }
        if (error.response.status === 404) {
          notificationCtx?.showNotification("error", "Resource not found");
          return;
        }
        if (error.response.status === 400) {
          notificationCtx?.showNotification(
            "error",
            error.response.data.message
          );
          return;
        }
        if (
          error.response.status === 422 &&
          error.response?.data?.errors &&
          Array.isArray(error.response.data.errors)
        ) {
          notificationCtx?.showNotification(
            "error",
            error.response.data.errors[0].message
          );
          return;
        }
        notificationCtx?.showNotification(
          "error",
          args?.onErrorMessage ?? "Something went wrong"
        );
        return;
      } else if (error.request) {
        notificationCtx?.showNotification(
          "error",
          args?.onErrorMessage ?? "Something went wrong"
        );
        return;
      }
      notificationCtx?.showNotification("error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (
    url: string,
    args?: {
      onSuccessMessage?: string;
      onErrorMessage?: string;
      isSilent?: boolean;
    }
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.delete(url);
      if (res.status === 200) {
        if (args?.isSilent !== true) {
          notificationCtx?.showNotification(
            "success",
            args?.onSuccessMessage ?? "Data was removed successfully"
          );
        }
        return true;
      }
      throw new Error("Failed to remove data");
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          notificationCtx?.showNotification(
            "error",
            "You are not authorized to perform this action"
          );
          authCtx?.logout();
          return false;
        }
        if (error.response.status === 404) {
          notificationCtx?.showNotification("error", "Resource not found");
          return false;
        }
        if (error.response.status === 400) {
          notificationCtx?.showNotification(
            "error",
            error.response.data.message
          );
          return false;
        }
        if (error.response.status === 422) {
          notificationCtx?.showNotification(
            "error",
            error.response.data.message ?? args?.onErrorMessage
          );
          return false;
        }
        notificationCtx?.showNotification(
          "error",
          args?.onErrorMessage ?? "Something went wrong"
        );
        return false;
      } else if (error.request) {
        notificationCtx?.showNotification(
          "error",
          args?.onErrorMessage ?? "Something went wrong"
        );
        return false;
      }
      notificationCtx?.showNotification("error", "Something went wrong");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { get, post, put, remove, isLoading };
}
