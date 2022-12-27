import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

const Hello = () => {
  const [input, setInput] = useState({
    NEISCode: undefined,
    MasterID: 'admin',
    passWord: undefined,
  });

  const onClickLogin = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:1991/api/mgr/test/login',
        data: input,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
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

      <TextField
        variant="standard"
        label="대학교코드"
        name="NEISCode"
        value={input.NEISCode}
        onChange={onChangeInput}
        helperText="로그인 페이지 URL을 복사해보세요."
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
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
