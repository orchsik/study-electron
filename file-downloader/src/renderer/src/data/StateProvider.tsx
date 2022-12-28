import { useState } from 'react';
import createCtx from '../utils/createContext';

type LoginState = {
  NEISCode: string;
  IpsiYear: string;
  IpsiGubun: string;
};

type UpdateLoginState = (name: keyof LoginState, value: string) => void;

type TStateProvider = {
  state: {
    login: LoginState;
  };
  updateLoginState: UpdateLoginState;
};
const [useCtx, Provider] = createCtx<TStateProvider>();

const StateProvider = ({ children }: { children: React.ReactElement }) => {
  const [loginState, setLoginState] = useState<LoginState>({
    NEISCode: '',
    IpsiYear: '',
    IpsiGubun: '',
  });

  const updateLoginState: UpdateLoginState = (name, value) => {
    setLoginState({
      ...loginState,
      [name]: value,
    });
  };

  return (
    <Provider
      value={{
        state: {
          login: loginState,
        },
        updateLoginState,
      }}
    >
      {children}
    </Provider>
  );
};

export { useCtx as useContextState, StateProvider };
