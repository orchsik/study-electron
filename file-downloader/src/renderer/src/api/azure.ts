import axios from 'axios';

import BaseError from '../utils/BaseError';
import notify from '../utils/toast';

const request_getBlobnameList = async ({
  containerName,
  prefix,
}: {
  containerName: string;
  prefix: string;
}) => {
  try {
    const response = await axios({
      method: 'get',
      url: `/mgr/azure/videos/${containerName}`,
      headers: {
        auth: 'asdf',
      },
      params: { prefix },
    });

    const cloudBlobnameList = response.data.result || [];

    // TODO : 디비에 없는 녹화파일은 필터해야 함. filterValidatedBlobname

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
