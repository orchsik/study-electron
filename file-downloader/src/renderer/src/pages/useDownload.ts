import { useCallback, useEffect, useRef, useState } from 'react';

import { request_getBlobnameList, request_postSAS } from '../api';
import { ExamBlobnameData, ExamUrlData } from '../data/type';
import { useContextState } from '../data/StateProvider';
import { azure_containerName } from '../utils/azure';
import notify from '../utils/toast';

const urlDataFor = async (
  containerName: string,
  aEexamBlobnameData: ExamBlobnameData
) => {
  const urlData: ExamUrlData = {};
  for await (const [ExamSetNo, blobnames] of Object.entries(
    aEexamBlobnameData
  )) {
    for await (const blobname of blobnames) {
      const sasResult = await request_postSAS(containerName, blobname);
      if (sasResult.data) {
        urlData[ExamSetNo] = [...(urlData[ExamSetNo] || []), sasResult.data];
      }
    }
  }
  return urlData;
};

const useDownload = ({
  validateSelected,
}: {
  validateSelected: () => string[] | undefined;
}) => {
  const {
    state: {
      loginState: { NEISCode, AppCode, IpsiYear, IpsiGubun },
    },
  } = useContextState();

  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState<{
    value: boolean;
    desc?: string;
  }>({
    value: false,
    desc: '',
  });

  const examBlobnameDataKeys = useRef<string[]>([]);
  const examBlobnameData = useRef<ExamBlobnameData>({});

  const downloadFiles = useCallback(
    async (totalCnt?: number) => {
      const aExamSetNo = examBlobnameDataKeys.current.shift();
      if (!aExamSetNo) return;

      setLoading({
        value: true,
        desc: `${aExamSetNo} 다운로드를 준비중입니다.`,
      });
      const urlData = await urlDataFor(azure_containerName(AppCode), {
        [aExamSetNo]: examBlobnameData.current[aExamSetNo],
      });
      setLoading({ value: false });

      // console.log('###', {
      //   aExamSetNo,
      //   current: examBlobnameData.current,
      //   data: examBlobnameData.current[aExamSetNo],
      //   urlData,
      // });

      window.electron.ipcRenderer.sendMessage('downloads', {
        AppCode,
        IpsiYear,
        IpsiGubun,
        urlData,
        totalCnt,
      });
    },
    [AppCode, IpsiGubun, IpsiYear]
  );

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'download-progress',
      ({ totalCnt, downloadedCnt }) => {
        if (totalCnt === downloadedCnt) {
          setDownloading(false);
          window.electron.ipcRenderer.sendMessage('init-downloads');
        }
      }
    );

    window.electron.ipcRenderer.on('finish-download', () => {
      downloadFiles();
    });
  }, [downloadFiles]);

  const onClickDownload = async () => {
    if (loading.value || downloading) {
      notify({
        content: '다운로드가 진행중입니다.',
        type: 'warning',
      });
      return;
    }

    const selectedExamSetNoList = validateSelected();
    if (!selectedExamSetNoList) return;

    setLoading({ value: true, desc: '어떤 파일들이 있는지 확인하고 있어요.' });
    const result = await request_getBlobnameList({
      NEISCode,
      AppCode,
      IpsiYear,
      IpsiGubun,
      ExamSetNoList: selectedExamSetNoList,
    });
    setLoading({ value: false });

    if (result.error || !result.data) return;

    const selExamBlobnameData = result.data;
    const totalCnt = Object.values(selExamBlobnameData).reduce(
      (acc, items) => acc + items.length || 0,
      0
    );

    examBlobnameDataKeys.current = Object.keys(selExamBlobnameData);
    examBlobnameData.current = selExamBlobnameData;

    downloadFiles(totalCnt);
  };

  const calcelDownload = () => {
    // TODO
    examBlobnameDataKeys.current = [];
  };

  return {
    downloading,
    loading,
    onClickDownload,
    calcelDownload,
  };
};

export default useDownload;
