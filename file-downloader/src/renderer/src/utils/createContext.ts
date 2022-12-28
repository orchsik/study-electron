import React from 'react';

type CreateCtx<T> = readonly [
  () => T,
  React.ProviderExoticComponent<React.ProviderProps<T | undefined>>
];

const createCtx = <T>(): CreateCtx<T> => {
  const ctx = React.createContext<T | undefined>(undefined);

  const useCtx = () => {
    const result = React.useContext(ctx);
    if (!result) {
      throw new Error('useCtx must be inside a Provider with a value');
    }
    return result;
  };

  return [useCtx, ctx.Provider];
};

export default createCtx;
