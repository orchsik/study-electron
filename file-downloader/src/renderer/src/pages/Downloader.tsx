import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useLocation, useNavigate } from 'react-router-dom';

import TextLoader from '../components/TextLoader';
import { RecordExam } from '../modules/data';
import { useDialog } from '../modules/dialog';

import DownloadProgressBar from './DownloadProgressBar';
import useExamSelector from './useExamSelector';
import useDownload from './useDownload';

const Downloader = () => {
  const { confirm } = useDialog();
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
      const ok = await confirm(
        '다운로드 취소',
        `다운로드를 취소하시겠습니까?\n다운로드가 완료된 영상은 "Download" 폴더에 저장됩니다.`
      );
      if (!ok) return;
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
