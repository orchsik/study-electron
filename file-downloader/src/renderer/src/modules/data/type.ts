export type IpsiYearItem = {
  IpsiYear: string;
};

export type IpsiGubunItem = {
  IpsiYear: string;
  IpsiGubun: string;
  IpsiGubunName: string;
};

export type ServiceItems = {
  ipsiYearList: IpsiYearItem[];
  ipsiGubunList: IpsiGubunItem[];
};

/**
 *
 */

export type LoginState = {
  NEISCode: string;
  AppCode: string;
  IpsiYear: string;
  IpsiGubun: string;
  masterId: string;
};

/**
 *
 */

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

/**
 *
 */

export type ExamBlobnameData = {
  [ExamSetNo: string]: string[];
};
export type ExamUrlData = ExamBlobnameData;
