import { useRef, useState } from 'react';
import createCtx from '../../utils/createContext';

export enum DialogType {
  CONFIRM = 'CONFIRM',
}

type OnInteractionEnd = (value: string | boolean) => void;
type Confirm = (title: string, description?: string) => Promise<unknown>;

type DialogState = {
  type: DialogType;
  title: string;
  description: string;
  show: boolean;
};
type Dialog = {
  state: DialogState;
  confirm: Confirm;
  onInteractionEnd: OnInteractionEnd;
};

const [useCtx, Provider] = createCtx<Dialog>();

type Resolver<T> = (value: T | PromiseLike<T>) => void;

const DialogProvider = ({ children }: { children: React.ReactElement }) => {
  const [type, setType] = useState<DialogType>(DialogType.CONFIRM);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const resolver = useRef<Resolver<string | boolean>>();

  const onInteractionEnd: OnInteractionEnd = (value: string | boolean) => {
    setShow(false);
    setTitle('');
    setDescription('');
    resolver.current?.(value);
  };

  const confirm: Confirm = async (aTtitle: string, aDescription = '') => {
    setShow(true);
    setType(DialogType.CONFIRM);
    setTitle(aTtitle);
    setDescription(aDescription);
    return new Promise((res) => {
      resolver.current = res;
    });
  };

  return (
    <Provider
      value={{
        state: {
          type,
          title,
          description,
          show,
        },
        onInteractionEnd,
        confirm,
      }}
    >
      {children}
    </Provider>
  );
};

export { useCtx as useDialog, DialogProvider };
