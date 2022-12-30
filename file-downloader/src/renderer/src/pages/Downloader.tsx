import { useState } from 'react';
import { Button } from '@mui/material';
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid';
import { useLocation, useNavigate } from 'react-router-dom';

import { RecordExam } from '../data/type';
import DownloadProgressBar from './DownloadProgressBar';
import { request_getBlobnameList } from '../api';
import { azure_containerName, azure_prefix } from '../utils/azure';
import { useContextState } from '../data/StateProvider';

const SMAPLE_URL =
  'https://jinhakstorageaccount.blob.core.windows.net/catchcam/22032806_45415_152942.mp4?sv=2021-08-06&st=2022-12-29T04%3A30%3A24Z&se=2022-12-30T04%3A30%3A24Z&sr=b&sp=r&sig=GitqeOy7UMfxqG1h9R0dS9fAGk2dTjDtCqfkSsEY54o%3D';

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

const Downloader = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const originRecordExams: RecordExam[] = location.state;

  const {
    state: { loginState },
  } = useContextState();

  const [recordExams, selRecordExams] = useState<CheckedRecordExam[]>(
    originRecordExams.map((item) => ({ ...item, checked: false }))
  );

  // TODO
  // [-] 선택한 고사의 녹화 파일을 다운로드 한다.
  // [-] 다운로드 진행률을 하단에 보여준다.
  // [-] 다운로드 폴더 설정
  // [-] 이어받기
  const onClickDownload = async () => {
    const result = await request_getBlobnameList({
      containerName: azure_containerName(loginState.AppCode),
      prefix: azure_prefix({
        IpsiYear: loginState.IpsiYear,
        IpsiGubun: loginState.IpsiGubun,
        ExamSetNo: 'test001',
      }),
    });
    if (!result.error || !result.data) return;

    const blobnameList = result.data;

    // 위 로직 작동될 때 까지 봉인
    // window.electron.ipcRenderer.sendMessage('downloads', {
    //   urls: [SMAPLE_URL, SMAPLE_URL],
    // });
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

        <Button
          variant="contained"
          style={{ width: '100%' }}
          onClick={onClickDownload}
        >
          다운로드
        </Button>
        <br />
        <br />

        <Button
          variant="contained"
          style={{ width: '100%' }}
          onClick={onClickBack}
        >
          뒤로
        </Button>
      </div>
    </div>
  );
};

export default Downloader;
