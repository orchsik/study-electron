import axios from 'axios';
import BaseError from '../utils/BaseError';
import notify from '../utils/toast';
import { HOST, PromiseRespnse } from './common';

export type TIpsiYear = {
  IpsiYear: string;
};

export type TIpsiGubun = {
  IpsiYear: string;
  IpsiGubun: string;
  IpsiGubunName: string;
};

export type ServiceItems = {
  ipsiYearList: TIpsiYear[];
  ipsiGubunList: TIpsiGubun[];
};

export type LoginResponse = {
  NEISCode: string;
  MasterID: string;
  serviceItems: ServiceItems;
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
      url: `${HOST}/mgr/test/login`,
      data: {
        MasterID,
        passWord,
        EncryptedCode,
      },
    });
    return { data: response.data };
  } catch (err) {
    const error = BaseError.handleError(err);
    notify({ content: error.message, type: 'error' });
    return { error };
  }
};

export { request_login };
