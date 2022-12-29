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
