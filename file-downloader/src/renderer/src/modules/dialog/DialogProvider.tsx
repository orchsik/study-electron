/* eslint-disable consistent-return */

import { ReactElement, useRef, useState } from 'react';
import createCtx from '../../utils/createContext';

/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
enum DialogType {
  CONFIRM = 'CONFIRM',
  ALERT = 'ALERT',
  PROMPT = 'PROMPT',
}

type OnInteractionEnd = (value: string | boolean) => void;
type ShowDialog = (title: string, description?: string) => Promise<unknown>;

type DialogState = {
  type: DialogType;
  title: string;
  description: string;
  show: boolean;
};
type Dialog = {
  state: DialogState;
  onInteractionEnd: OnInteractionEnd;
  confirm: ShowDialog;
  alert: ShowDialog;
  prompt: ShowDialog;
};

const [useCtx, Provider] = createCtx<Dialog>();

type Resolver<T> = (value: T | PromiseLike<T>) => void;

const DialogProvider = ({ children }: { children: ReactElement }) => {
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

  const onShowDialog = (aTtitle: string, aDescription: string) => {
    setShow(true);
    setTitle(aTtitle);
    setDescription(aDescription);
    return new Promise((res) => {
      resolver.current = res;
    });
  };

  const confirm: ShowDialog = async (aTtitle: string, aDescription = '') => {
    if (show) return;
    setType(DialogType.CONFIRM);
    return onShowDialog(aTtitle, aDescription);
  };

  const alert: ShowDialog = async (aTtitle: string, aDescription = '') => {
    if (show) return;
    setType(DialogType.ALERT);
    return onShowDialog(aTtitle, aDescription);
  };

  const prompt: ShowDialog = async (aTtitle: string, aDescription = '') => {
    if (show) return;
    setType(DialogType.PROMPT);
    return onShowDialog(aTtitle, aDescription);
  };

  return (
    <Provider
      value={{
        state: {
          type,
          show,
          title,
          description,
        },
        onInteractionEnd,
        confirm,
        alert,
        prompt,
      }}
    >
      {children}
    </Provider>
  );
};

export { useCtx as useDialog, DialogProvider, DialogType };
