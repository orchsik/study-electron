import axios from 'axios';

import { ExamBlobnameData } from '../modules/data/type';
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
}): PromiseRespnse<ExamBlobnameData> => {
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

    const examBlobnameData = response.data.result || [];
    if (Object.keys(examBlobnameData).length === 0) {
      throw Error('선택한 고사에서 다운로드 받을 파일이 없습니다.');
    }

    return { data: examBlobnameData };
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
const request_postSAS = async (
  containerName: string,
  Blobname: string
): PromiseRespnse<string> => {
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
    notify({
      content: `다운로드 실패 - ${Blobname} \n${error.message}`,
      type: 'error',
    });
    return { error };
  }
};

export { request_getBlobnameList, request_postSAS };
