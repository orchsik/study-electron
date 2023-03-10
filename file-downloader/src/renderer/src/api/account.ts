import axios from 'axios';

import BaseError from '../utils/BaseError';
import notify from '../utils/toast';
import { ServiceItems } from '../modules/data';
import { PromiseRespnse } from './common';

export type LoginResponse = {
  token: string;
  NEISCode: string;
  AppCode: string;
  MasterID: string;
  serviceItems: ServiceItems;
};

const _setAuthToken = (token: string) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const request_login = async ({
  MasterID,
  passWord,
  EncryptedCode,
}: {
  MasterID: string;
  passWord: string;
  EncryptedCode: string;
}): PromiseRespnse<LoginResponse> => {
  try {
    const response = await axios({
      method: 'post',
      url: `/mgr/downloader/login`,
      data: {
        MasterID,
        passWord,
        EncryptedCode,
      },
    });

    _setAuthToken(response.data.token);

    return { data: response.data };
  } catch (err) {
    const error = BaseError.handleError(err);
    notify({ content: error.message, type: 'error' });
    return { error };
  }
};

export { request_login };
