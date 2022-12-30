const azure_containerName = (AppCode: string) => {
  return `rms-${AppCode}`;
};

const azure_prefix = ({
  IpsiYear,
  IpsiGubun,
  ExamSetNo,
}: {
  IpsiYear: string;
  IpsiGubun: string;
  ExamSetNo: string;
}) => {
  let result = `${IpsiYear}/${IpsiGubun}/`;
  if (ExamSetNo) result += `${ExamSetNo}/`;
  return result;
};

export { azure_containerName, azure_prefix };
