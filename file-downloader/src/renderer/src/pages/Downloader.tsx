import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useLocation, useNavigate } from 'react-router-dom';

import DownloadProgressBar from './DownloadProgressBar';
import TextLoader from '../components/TextLoader';
import notify from '../utils/toast';

import { RecordExam } from '../data/type';
import useExamSelector from './useExamSelector';
import useDownload from './useDownload';

const Downloader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const originRecordExams: RecordExam[] = location.state;

  const { columns, rows, onSelectionModelChange, validateSelected } =
    useExamSelector({ originRecordExams });

  const { downloading, loading, cancelDownload, onClickDownload } = useDownload(
    { validateSelected }
  );

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

          <Button
            variant="contained"
            style={{ width: '100%' }}
            onClick={cancelDownload}
          >
            다운로드 취소
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
