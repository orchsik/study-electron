import { useCallback, useEffect, useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid';
import { useLocation, useNavigate } from 'react-router-dom';

import DownloadProgressBar from './DownloadProgressBar';
import TextLoader from '../components/TextLoader';

import { request_getBlobnameList, request_postSAS } from '../api';
import { ExamBlobnameData, ExamUrlData, RecordExam } from '../data/type';
import { useContextState } from '../data/StateProvider';
import { azure_containerName } from '../utils/azure';
import notify from '../utils/toast';

const columns: GridColDef[] = [
  { field: 'no', headerName: 'No', width: 40 },
  { field: 'type', headerName: 'type', width: 80 },
  { field: 'ExamSetNo', headerName: '고사번호', width: 250 },
  { field: 'ExamDay', headerName: '고사일', width: 140 },
  {
    field: 'stuSetCnt',
    headerName: '배정',
    width: 60,
    type: 'number',
    sortable: false,
    description: '배정인원',
  },
  {
    field: 'blobCnt',
    headerName: '파일',
    width: 60,
    type: 'number',
    sortable: false,
    description:
      '녹화파일갯수, 면접질문이 2개 이상인 경우 배정인원 보다 많을 수 있습니다.',
  },
];

type CheckedRecordExam = RecordExam & { checked: boolean };

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

const Downloader = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const originRecordExams: RecordExam[] = location.state;

  const {
    state: { loginState },
  } = useContextState();

  const { NEISCode, AppCode, IpsiYear, IpsiGubun } = loginState;

  const [recordExams, selRecordExams] = useState<CheckedRecordExam[]>(
    originRecordExams.map((item) => ({ ...item, checked: false }))
  );
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

  const validateSelected = (): string[] | undefined => {
    const selectedExamSetNoList = recordExams
      .filter((item) => item.checked)
      .map((item) => item.ExamSetNo);
    if (selectedExamSetNoList.length === 0) {
      notify({
        content: '고사를 1개 이상 선택해주세요.',
        type: 'warning',
      });
      return undefined;
    }
    return selectedExamSetNoList;
  };

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

  const onSelectionModelChange = (selectedIds: GridSelectionModel) => {
    const checkedRecordExams = recordExams.map((item) => {
      const checked = selectedIds.some((id) => id === item.ExamSetNo);
      item.checked = checked;
      return item;
    });
    selRecordExams(checkedRecordExams);
  };

  const onClickBack = async () => {
    if (downloading) {
      notify({
        content: '다운로드가 진행중입니다.',
        type: 'warning',
      });
      return;
    }
    navigate('/select');
  };

  const rows = recordExams.map((item, idx) => {
    return {
      no: idx + 1,
      id: item.ExamSetNo,
      type: item.type,
      ExamSetNo: item.ExamSetNo,
      ExamDay: item.ExamDay,
      stuSetCnt: item.stuSetCnt,
      blobCnt: item.blobCnt,
    };
  });

  return (
    <div style={{ flex: 1, width: '100vw' }}>
      <div style={{ padding: '0 6%' }}>
        <div style={{ height: '60vh', width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            onSelectionModelChange={onSelectionModelChange}
          />
        </div>
        <br />

        <DownloadProgressBar />
        <br />

        <Stack spacing={2} direction="row">
          <Button
            variant="contained"
            style={{ width: '100%' }}
            onClick={onClickDownload}
          >
            다운로드
          </Button>
        </Stack>
        <br />

        <Button
          variant="contained"
          style={{ width: '100%' }}
          onClick={onClickBack}
        >
          뒤로
        </Button>
      </div>

      <TextLoader loading={loading.value} desc={loading.desc} />
    </div>
  );
};

export default Downloader;
