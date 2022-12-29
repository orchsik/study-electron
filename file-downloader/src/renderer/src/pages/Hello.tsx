import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request_login } from '../api';
import { useContextState } from '../data/StateProvider';

const Hello = () => {
  const navigate = useNavigate();

  const { updateLoginState, updateServiceItems } = useContextState();

  const [input, setInput] = useState({
    MasterID: 'hc',
    passWord: '1111',
    EncryptedCode: 'EFABA73D422044C8B8EE20AA22D2C560',
  });

  useEffect(() => {
    window.electron.ipcRenderer.on(
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.EncryptedCode]);

  const onChangeInput = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = e.currentTarget;
    setInput({ ...input, [name]: value });
  };

  const onClickLogin = async () => {
    const response = await request_login(input);
    if (response.error || !response.data) return;

    updateLoginState('NEISCode', response.data.NEISCode);
    updateLoginState('AppCode', response.data.AppCode);
    updateServiceItems(response.data.serviceItems);

    navigate('select');
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
    </div>
  );
};

export default Hello;
