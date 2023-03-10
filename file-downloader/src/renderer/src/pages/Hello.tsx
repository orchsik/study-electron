import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';

import { useContextState } from '../modules/data';
import Loader from '../components/Loader';

import { request_login } from '../api';

const Hello = () => {
  const navigate = useNavigate();

  const { updateLoginState, updateServiceItems } = useContextState();

  const [input, setInput] = useState({
    MasterID: '',
    passWord: '',
    EncryptedCode: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const remover = window.electron.ipcRenderer.on(
      'updateLinkPlaceholder',
      ({ text: clipboardTxt }) => {
        if (
          input.EncryptedCode !== clipboardTxt &&
          typeof clipboardTxt === 'string'
        ) {
          setInput({
            ...input,
            EncryptedCode: clipboardTxt,
          });
        }
      }
    );

    return () => remover?.();
  }, [input]);

  const onChangeInput = (
    e: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = e.currentTarget;
    setInput({ ...input, [name]: value });
  };

  const onClickLogin = async () => {
    setLoading(true);
    const response = await request_login(input);
    setLoading(false);

    if (response.error || !response.data) return;
    const { NEISCode, AppCode, serviceItems } = response.data;

    updateLoginState({
      NEISCode,
      AppCode,
      masterId: input.MasterID,
    });
    updateServiceItems(serviceItems);

    navigate('select');
  };

  return (
    <div>
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
        label="EncryptedCode"
        name="EncryptedCode"
        value={input.EncryptedCode}
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

      <p
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          padding: '10px',
          fontSize: 10,
        }}
      >
        v 1.1.0
      </p>
      <Loader loading={loading} />
    </div>
  );
};

export default Hello;
