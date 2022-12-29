import {
  Select,
  SelectChangeEvent,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { request_recordExams } from '../api';
import { useContextState } from '../data/StateProvider';
import { RecordExam } from '../data/type';
import notify from '../utils/toast';

const ServiceSelector = () => {
  const navigate = useNavigate();

  const {
    state: { loginState, serviceItems },
    updateLoginState,
  } = useContextState();
  const { NEISCode } = loginState;

  const filterIpsiGubunList = (IpsiYear: string) => {
    return serviceItems.ipsiGubunList.filter((item) => {
      return item.IpsiYear === IpsiYear;
    });
  };

  const initState = () => {
    const initIpsiYear = serviceItems.ipsiYearList[0].IpsiYear;
    return {
      initIpsiYear,
      initIpsiGubunList: filterIpsiGubunList(initIpsiYear),
    };
  };

  const [selIpsiYear, setSelIpsiYear] = useState(initState().initIpsiYear);
  const [ipsiGubunList, setIpsiGubunList] = useState(
    initState().initIpsiGubunList
  );
  const [selIpsiGubun, setSelIpsiGubun] = useState('');

  const onChangeSelect = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name === 'ipsiYear') {
      setSelIpsiYear(value);
      setSelIpsiGubun('');
      setIpsiGubunList(filterIpsiGubunList(value));
    }
    if (name === 'ipsiGubun') {
      setSelIpsiGubun(value);
    }
  };

  const onClickNext = async () => {
    if (!selIpsiYear || !selIpsiGubun) {
      notify({
        content: '입학연도, 모집시기를 모두 선택해주세요.',
        type: 'warning',
      });
      return;
    }

    const response = await request_recordExams({
      NEISCode,
      IpsiYear: selIpsiYear,
      IpsiGubun: selIpsiGubun,
    });
    if (response.error || !response.data) {
      return;
    }
    const recordExams: RecordExam[] = response.data;

    if (recordExams.length === 0) {
      notify({
        content:
          '녹화가 진행된 녹화고사가 없습니다. 다른 모집시기를 선택해주세요.',
      });
      return;
    }

    updateLoginState('IpsiYear', selIpsiYear);
    updateLoginState('IpsiGubun', selIpsiGubun);

    navigate('/downloader', {
      state: response.data,
    });
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 200 }} size="medium" required>
        <InputLabel id="ipsiYear-label">입학연도</InputLabel>
        <Select
          labelId="ipsiYear-label"
          id="ipsiYear"
          name="ipsiYear"
          value={selIpsiYear}
          label="입학연도"
          onChange={onChangeSelect}
        >
          {serviceItems.ipsiYearList.map((item) => {
            return (
              <MenuItem key={item.IpsiYear} value={item.IpsiYear}>
                {item.IpsiYear}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <br />
      <br />

      <FormControl sx={{ m: 1, minWidth: 200 }} size="medium" required>
        <InputLabel id="ipsiGubun-label">모집시기</InputLabel>
        <Select
          labelId="ipsiGubun-label"
          id="ipsiGubun"
          name="ipsiGubun"
          label="모집시기"
          value={selIpsiGubun}
          onChange={onChangeSelect}
        >
          {ipsiGubunList.map((item) => {
            return (
              <MenuItem key={item.IpsiGubun} value={item.IpsiGubun}>
                {item.IpsiGubunName}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <br />
      <br />

      <Button
        variant="contained"
        style={{ width: '100%' }}
        onClick={onClickNext}
      >
        다음
      </Button>
    </div>
  );
};

export default ServiceSelector;
