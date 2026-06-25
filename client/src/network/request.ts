import {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'
import { AUTH_TOKEN_KEY } from '@/constants/auth'
import { ApiBusinessError } from '@/network/request-error'
import type { ApiResponse } from '@/types/api'

const baseConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}

/** 请求拦截器：自动附加 JWT */
export const requestInterceptors = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

export const requestErrorInterceptors = (
  error: AxiosError,
): Promise<AxiosError> => {
  return Promise.reject(error)
}

/** 响应拦截器：解包后端统一响应结构 */
export const responseInterceptors = (
  response: AxiosResponse<ApiResponse>,
): AxiosResponse => {
  const { Code, Message, Data } = response.data

  if (Code !== 200) {
    return Promise.reject(new ApiBusinessError(Code, Message)) as never
  }

  return {
    ...response,
    data: Data,
  }
}

export const responseErrorInterceptors = (
  error: AxiosError<ApiResponse>,
): Promise<never> => {
  const payload = error.response?.data
  if (payload?.Message) {
    return Promise.reject(
      new ApiBusinessError(payload.Code, payload.Message),
    )
  }

  const message = error.message || '网络请求失败'
  return Promise.reject(new ApiBusinessError(-1, message))
}

const createInstance = (config: AxiosRequestConfig = baseConfig) => {
  const ins = axios.create({
    ...config,
  })
  ins.interceptors.request.use(requestInterceptors, requestErrorInterceptors)
  ins.interceptors.response.use(responseInterceptors, responseErrorInterceptors)

  return ins
}

const instance = createInstance(baseConfig)

export const request = {
  get: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return instance.get(url, config)
  },
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return instance.post(url, data, config)
  },
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return instance.put(url, data, config)
  },
  delete: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return instance.delete(url, config)
  },
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return instance.patch(url, data, config)
  },
  setHeade: (
    header: Record<string, string>,
    reqInterceptors = requestInterceptors,
    resInterceptors = responseInterceptors,
  ) => {
    const cfg = { ...baseConfig }
    cfg.headers = {
      ...header,
    }
    const newInstance = createInstance(cfg)
    newInstance.interceptors.request.use(
      reqInterceptors,
      requestErrorInterceptors,
    )
    newInstance.interceptors.response.use(
      resInterceptors,
      responseErrorInterceptors,
    )
    return newInstance
  },
}
