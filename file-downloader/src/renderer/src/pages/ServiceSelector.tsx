import {
  Select,
  SelectChangeEvent,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LoginResponse } from '../api';
import notify from '../utils/toast';

const ServiceSelector = () => {
  const location = useLocation();
  const loginResponse: LoginResponse = location.state;
  const { NEISCode, serviceItems } = loginResponse;

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

  const onClickNext = () => {
    if (!selIpsiYear || !selIpsiGubun) {
      notify({
        content: '입학연도, 모집시기를 모두 선택해주세요.',
        type: 'warning',
      });

      // TODO : 해당하는 녹화고사번호 리스트를 가져와서 다음 페이지로 넘겨주자.
      // 다음 페이지는 녹화고사번호 선택하고 다운로드 누르면 다운로드 되는 페이지.
      // 갯수랑 진행률 나온다.
      // 이어 받기 이런거 할 수 있으면 하자
      return;
    }
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
