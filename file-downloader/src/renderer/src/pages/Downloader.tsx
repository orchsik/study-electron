import {
  Select,
  SelectChangeEvent,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginResponse } from '../api';
import { request_recordExams } from '../api/recordExam';
import notify from '../utils/toast';

const Downloader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recordExams = location.state;
  console.log({ recordExams });

  const onClickDownload = async () => {};
  const onClickBack = async () => {
    navigate('/select');
  };

  return (
    <div>
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
  );
};

export default Downloader;
