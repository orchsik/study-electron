import { Channels } from 'main/preload';

type AnyHash = {
  [key: string]: any;
};

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args?: AnyHash): void;

        on(
          channel: Channels,
          func: (args: AnyHash) => void
        ): (() => void) | undefined;

        once(channel: Channels, func: (args: AnyHash) => void): void;
      };
    };
  }
}

export {};
