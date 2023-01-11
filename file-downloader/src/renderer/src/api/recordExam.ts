import axios from 'axios';

import { RecordExam } from '../modules/data';
import BaseError from '../utils/BaseError';
import notify from '../utils/toast';
import { PromiseRespnse } from './common';

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
      url: `/mgr/downloader/recordExams`,
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
