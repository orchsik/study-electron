import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';

import BaseError from '../utils/BaseError';

const HOST = 'http://127.0.0.1:1991/api';

axios.defaults.baseURL = HOST;
axios.defaults.adapter = httpAdapter;
axios.defaults.withCredentials = true;

type ApiResponse<T = any> = {
  data?: T;
  error?: BaseError;
};

type PromiseRespnse<T = any> = Promise<ApiResponse<T>>;

export { HOST, PromiseRespnse };
