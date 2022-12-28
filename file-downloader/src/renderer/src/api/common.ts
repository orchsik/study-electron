import BaseError from '../utils/BaseError';

const HOST = 'http://127.0.0.1:1991/api';

type ApiResponse<T = any> = {
  data?: T;
  error?: BaseError;
};

type PromiseRespnse<T = any> = Promise<ApiResponse<T>>;

export { HOST, PromiseRespnse };
