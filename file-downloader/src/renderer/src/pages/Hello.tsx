import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import BaseError from '../utils/BaseError';
import notify from '../utils/toast';

const Hello = () => {
  const [input, setInput] = useState({
    NEISCode: '',
    MasterID: 'admin',
    passWord: '',
  });

  useEffect(() => {
    window.electron.ipcRenderer.on('updateLinkPlaceholder', (arg) => {
      if (input.NEISCode !== arg && typeof arg === 'string') {
        setInput({
          ...input,
          NEISCode: arg,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickLogin = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:1991/api/mgr/test/login',
        data: input,
      });
      console.log(response.data);
    } catch (error) {
      const err = BaseError.handleError(error);
      notify({ content: err.message, type: 'error' });
    }
  };

  const onChangeInput = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = e.currentTarget;
    console.log({ name, value });
    setInput({ ...input, [name]: value });
  };

  return (
    <div>
      {/* <p>
        <TextField id="standard-basic" label="입학연도" variant="standard" />
      </p> */}

      {/* <p>
        <TextField id="standard-basic" label="모집시기" variant="standard" />
      </p> */}

      <TextField
        variant="standard"
        label="아이디"
        name="MasterID"
        value={input.MasterID}
        onChange={onChangeInput}
        helperText="PAMS 관리자 로그인 ID"
      />
      <br />
      <br />

      <TextField
        variant="standard"
        label="비밀번호"
        name="passWord"
        value={input.passWord}
        onChange={onChangeInput}
        type="password"
        helperText="PAMS 관리자 로그인 비밀번호"
      />
      <br />
      <br />

      <TextField
        variant="standard"
        label="대학교코드"
        name="NEISCode"
        value={input.NEISCode}
        onChange={onChangeInput}
        helperText="로그인 페이지 URL을 복사해보세요."
        style={{
          width: 500,
        }}
      />
      <br />
      <br />

      <Button
        variant="contained"
        style={{ width: '100%' }}
        onClick={onClickLogin}
      >
        로그인
      </Button>

      <ToastContainer pauseOnFocusLoss={false} />
    </div>
  );
};

export default Hello;
