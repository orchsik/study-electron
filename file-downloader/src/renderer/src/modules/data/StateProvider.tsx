import { useState } from 'react';

import createCtx from '../../utils/createContext';
import { LoginState, ServiceItems } from './type';

type UpdateLoginState = (value: Partial<LoginState>) => void;
type UpdateServiceItems = (value: ServiceItems) => void;

type TStateProvider = {
  state: {
    loginState: LoginState;
    serviceItems: ServiceItems;
  };
  updateLoginState: UpdateLoginState;
  updateServiceItems: UpdateServiceItems;
};
const [useCtx, Provider] = createCtx<TStateProvider>();

const StateProvider = ({ children }: { children: React.ReactElement }) => {
  const [loginState, setLoginState] = useState<LoginState>({
    NEISCode: '',
    AppCode: '',
    IpsiYear: '',
    IpsiGubun: '',
  });
  const [serviceItems, setServiceItems] = useState<ServiceItems>({
    ipsiYearList: [],
    ipsiGubunList: [],
  });

  const updateLoginState: UpdateLoginState = (value: Partial<LoginState>) => {
    setLoginState({
      ...loginState,
      ...value,
    });
  };

  const updateServiceItems: UpdateServiceItems = (value) => {
    setServiceItems(value);
  };

  return (
    <Provider
      value={{
        state: {
          loginState,
          serviceItems,
        },
        updateLoginState,
        updateServiceItems,
      }}
    >
      {children}
    </Provider>
  );
};

export { useCtx as useContextState, StateProvider };
