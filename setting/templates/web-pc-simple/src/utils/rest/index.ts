import axios, { AxiosRequestConfig, Method } from 'axios';
import qs from 'qs';

const restConfig: AxiosRequestConfig = {
  headers: { 'X-Requested-With': 'XMLHttpRequest' }
};

let interceptor: undefined | ((response: any) => void | any);

export const setRestConfig = config => {
  Object.assign(restConfig, config);
};

function getResponseData(rsp: any) {
  const { data } = rsp;
  return data;
}

function getErrorResponse({ response }: any) {
  if (!interceptor) {
    return Promise.reject(response);
  }
  const data = interceptor(response);
  if (!data) {
    return new Promise(Function.prototype as () => void);
  }
  return Promise.reject(response);
}

function withContentType(
  config: AxiosRequestConfig,
  contentType: string
): AxiosRequestConfig {
  const { headers } = config;
  const newHeaders = { ...headers, 'Content-Type': contentType };
  return { ...config, headers: newHeaders };
}

export const registerErrorInterceptor = (inter: (response: any) => void) => {
  interceptor = inter;
};

export class Rest {
  private parentUrl: string;

  private urls: Array<string> = [''];

  private requestBody?: any;

  private requestParams?: Record<string, unknown>;

  private getPath() {
    const pathArray = [this.parentUrl, ...this.urls].filter((path: string) => {
      return path.trim();
    });
    return pathArray.join('/');
  }

  private reset() {
    this.urls = [''];
    this.requestBody = undefined;
    this.requestParams = undefined;
  }

  private run(requestConfig: AxiosRequestConfig) {
    const promise = axios(this.getPath(), requestConfig);
    this.reset();
    return promise;
  }

  constructor(url: string) {
    this.parentUrl = url;
  }

  /**
   * 添加后续url路径
   *
   * @param url 后续url路径，前后可以不带'/'
   */
  path(url = '') {
    this.urls = this.urls.concat(url.split('/'));
    return this;
  }

  /**
   * 添加RequestBody
   *
   * @param requestBody 对应java controller的@RequestBody
   */
  setRequestBody<R>(requestBody: R) {
    this.requestBody = requestBody;
    return this;
  }

  /**
   * 添加RequestParams
   *
   * @param requestParams 对应java controller的@RequestParams
   */
  setRequestParams<P extends Record<string, unknown>>(requestParams: P) {
    this.requestParams = requestParams;
    return this;
  }

  setRequestConfig(
    method: Method,
    config?: AxiosRequestConfig,
    data?: any
  ): AxiosRequestConfig {
    const params = this.requestParams;
    const { requestBody } = this;
    const base: AxiosRequestConfig = {
      method,
      params,
      data: data || requestBody
    };
    return {
      ...restConfig,
      ...config,
      ...base
    };
  }

  /**
   * 发起Http get请求
   * @param config  根据需求添加请求头等配置
   */
  get(config?: AxiosRequestConfig) {
    return this.run(this.setRequestConfig('get', config)).then(
      getResponseData,
      getErrorResponse
    );
  }

  /**
   * 发起Http post请求
   * @param config  根据需求添加请求头等配置
   */
  post(config?: AxiosRequestConfig) {
    return this.run(this.setRequestConfig('post', config)).then(
      getResponseData,
      getErrorResponse
    );
  }

  postForm(config?: AxiosRequestConfig) {
    const data = qs.stringify(this.requestBody);
    const requestConfig = withContentType(
      { ...restConfig, ...(config || {}) },
      'application/x-www-form-urlencoded'
    );
    return this.run(this.setRequestConfig('post', requestConfig, data)).then(
      getResponseData,
      getErrorResponse
    );
  }

  upload(config?: AxiosRequestConfig) {
    const file = this.requestBody;
    const formData = new FormData();
    formData.append('file', file as Blob);
    const requestConfig = withContentType(
      { ...restConfig, ...(config || {}) },
      'multipart/form-data'
    );
    return this.run(
      this.setRequestConfig('post', requestConfig, formData)
    ).then(getResponseData, getErrorResponse);
  }

  /**
   * 发起Http put请求
   * @param config  根据需求添加请求头等配置
   */
  put(config?: AxiosRequestConfig) {
    return this.run(this.setRequestConfig('put', config)).then(
      getResponseData,
      getErrorResponse
    );
  }

  /**
   * 发起Http delete请求
   * @param config  根据需求添加请求头等配置
   */
  delete(config?: AxiosRequestConfig) {
    return this.run(this.setRequestConfig('delete', config)).then(
      getResponseData,
      getErrorResponse
    );
  }
}

/**
 * 方法调用入口
 * @param path  初始路径
 *
 * 如：
 * rest('api/xxx').path('fetch').setRequestBody({}).post();
 */
export function rest(path: string) {
  return new Rest(path);
}
