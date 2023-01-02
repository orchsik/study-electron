import axios from 'axios';

import BaseError from '../utils/BaseError';
import notify from '../utils/toast';
import { PromiseRespnse } from './common';

const request_getBlobnameList = async ({
  NEISCode,
  AppCode,
  IpsiYear,
  IpsiGubun,
  ExamSetNoList,
}: {
  NEISCode: string;
  AppCode: string;
  IpsiYear: string;
  IpsiGubun: string;
  ExamSetNoList: string[];
}): PromiseRespnse<string[]> => {
  try {
    const response = await axios({
      method: 'get',
      url: `/mgr/downloader/blobNames`,
      params: {
        NEISCode,
        AppCode,
        IpsiYear,
        IpsiGubun,
        ExamSetNoList,
      },
    });

    const cloudBlobnameList = response.data.result || [];
    return { data: cloudBlobnameList };
  } catch (err) {
    const error = BaseError.handleError(err);
    notify({ content: error.message, type: 'error' });
    return { error };
  }
};

/**
 * @param {string} containerName  rms-{AppCode} [ex] rms-8888
 * @param {string} Blobname {IpsiYear}/{IpsiGubun}/{ExamSetNo}/{filename} [ex] '2022/A/면접고사/T00000001.mp4'
 * @returns { string | boolean } url or false
 */
const request_postSAS = async (containerName: string, Blobname: string) => {
  try {
    const response = await axios({
      method: 'post',
      url: `/mgr/azure/sas`,
      data: {
        params: {
          containerName,
          Blobname,
        },
      },
    });

    const { url } = response.data.result;
    return { data: url };
  } catch (err) {
    const error = BaseError.handleError(err);
    notify({ content: error.message, type: 'error' });
    return { error };
  }
};

export { request_getBlobnameList, request_postSAS };
