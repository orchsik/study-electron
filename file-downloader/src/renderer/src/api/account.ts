import axios from 'axios';
import BaseError from '../utils/BaseError';
import notify from '../utils/toast';
import { HOST, PromiseRespnse } from './common';

type TIpsiYear = {
  IpsiYear: string;
};
type TIpsiGubun = {
  IpsiGubun: string;
  IpsiGubunName: string;
};
type ResponseLogin = {
  ipsiYearList: TIpsiYear[];
  ipsiGubunList: TIpsiGubun[];
};

const request_login = async ({
  MasterID,
  passWord,
  EncryptedCode,
}: {
  MasterID: string;
  passWord: string;
  EncryptedCode: string;
}): PromiseRespnse<ResponseLogin> => {
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
