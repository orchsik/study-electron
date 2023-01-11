import { useCallback, useEffect, useRef, useState } from 'react';

import { request_getBlobnameList, request_postSAS } from '../api';
import {
  ExamBlobnameData,
  ExamUrlData,
  useContextState,
} from '../modules/data';
import { useDialog } from '../modules/dialog';
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
      urlData[ExamSetNo] = [
        ...(urlData[ExamSetNo] || []),
        sasResult.data || '',
      ];
    }
  }
  return urlData;
};

const useDownload = ({
  validateSelected,
}: {
  validateSelected: () => string[] | undefined;
}) => {
  const { confirm } = useDialog();

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

  const initProgressState = () => {
    setDownloading(false);
    setLoading({ value: false, desc: '' });
  };

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

      setDownloading(true);

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
    const remover = window.electron.ipcRenderer.on(
      'download-progress',
      ({ totalCnt, downloadedCnt, errorCnt }) => {
        if (totalCnt === downloadedCnt + errorCnt) {
          initProgressState();
          if (errorCnt === 0) return;
          notify({
            content: `${errorCnt}개 다운로드 실패했습니다.`,
            type: 'warning',
          });
        }
      }
    );
    return () => remover?.();
  }, []);

  useEffect(() => {
    const remover = window.electron.ipcRenderer.on('download-flushed', () => {
      downloadFiles();
    });
    return () => remover?.();
  }, [downloadFiles]);

  const initDownload = async (ExamSetNoList: string[]) => {
    initProgressState();
    window.electron.ipcRenderer.sendMessage('init-downloads');

    setLoading({ value: true, desc: '어떤 파일들이 있는지 확인하고 있어요.' });
    const result = await request_getBlobnameList({
      NEISCode,
      AppCode,
      IpsiYear,
      IpsiGubun,
      ExamSetNoList,
    });
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

  const onClickDownload = async () => {
    if (loading.value || downloading) {
      notify({ content: '다운로드가 진행중입니다.', type: 'warning' });
      return;
    }
    const selectedExamSetNoList = validateSelected();
    if (!selectedExamSetNoList) return;

    initDownload(selectedExamSetNoList);
  };

  const cancelDownload = async () => {
    if (!downloading && !loading.value) return;

    const ok = await confirm(
      '다운로드 취소',
      `다운로드를 취소하시겠습니까?\n다운로드가 완료된 영상은 "Download" 폴더에 저장됩니다.`
    );
    if (!ok) return;

    examBlobnameDataKeys.current = [];
    initProgressState();
    window.electron.ipcRenderer.sendMessage('cancel-downloads');
  };

  return {
    downloading,
    loading,
    onClickDownload,
    cancelDownload,
  };
};

export default useDownload;
