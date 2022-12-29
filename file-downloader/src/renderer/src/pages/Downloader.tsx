import { Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useLocation, useNavigate } from 'react-router-dom';
import { RecordExam } from '../data/type';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 40 },
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

const Downloader = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const recordExams: RecordExam[] = location.state;

  // TODO
  // 1. 선택한 고사의 녹화 파일을 다운로드 한다.
  // 2. 다운로드 진행률을 하단에 보여준다.
  // 3. 이어받기
  // 4. 다운로드 폴더 선택, 기본 폴더 위치 알려주기
  const onClickDownload = async () => {};

  const onClickBack = async () => {
    navigate('/select');
  };

  const rows = recordExams.map((item, idx) => {
    return {
      id: idx + 1,
      type: item.type,
      ExamSetNo: item.ExamSetNo,
      ExamDay: item.ExamDay,
      stuSetCnt: item.stuSetCnt,
      blobCnt: item.blobCnt,
    };
  });

  return (
    <div style={{ flex: 1, width: '100vw' }}>
      <div style={{ padding: '0 10%' }}>
        <div style={{ height: '70vh', width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        </div>
        <br />

        <Button
          variant="contained"
          style={{ width: '100%' }}
          onClick={onClickDownload}
        >
          다운로드
        </Button>

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
