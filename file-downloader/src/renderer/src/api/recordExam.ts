import axios from 'axios';
import BaseError from '../utils/BaseError';
import notify from '../utils/toast';
import { HOST, PromiseRespnse } from './common';

export type RecordExam = {
  type: 'RMSA' | 'RMS';
  NEISCode: string;
  IpsiYear: string;
  IpsiGubun: string;
  ExamSetNo: string;
  ExamDay: string;
  ExamTime: string;
  stuSetCnt: number;
  blobCnt: number;
};

const request_recordExams = async ({
  NEISCode,
  IpsiYear,
  IpsiGubun,
}: {
  NEISCode: string;
  IpsiYear: string;
  IpsiGubun: string;
}): PromiseRespnse<RecordExam[]> => {
  try {
    const response = await axios({
      method: 'get',
      url: `${HOST}/mgr/downloader/recordExams`,
      params: {
        NEISCode,
        IpsiYear,
        IpsiGubun,
      },
    });
    return { data: response.data };
  } catch (err) {
    const error = BaseError.handleError(err);
    notify({ content: error.message, type: 'error' });
    return { error };
  }
};

export { request_recordExams };
