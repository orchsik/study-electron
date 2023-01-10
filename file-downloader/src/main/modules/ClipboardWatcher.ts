import { clipboard, BrowserWindow } from 'electron';

class ClipboardWatcher {
  private win: BrowserWindow;
  private encryptedRegex = /(?<=(EncryptedCode=)).+/g;
  private previous = '';
  private intervalId: NodeJS.Timer | undefined;

  constructor(win: BrowserWindow) {
    this.win = win;
  }

  startPolling() {
    this.poll();
    this.intervalId = setInterval(() => this.poll(), 1_000);
  }

  endPolling() {
    clearInterval(this.intervalId);
  }

  resetPlaceholder() {
    const text = '로그인 페이지 URL을 복사해보세요.';
    this.win.webContents.send('updateLinkPlaceholder', { text });
  }

  poll() {
    if (!(this.win instanceof BrowserWindow)) return;

    let text = clipboard.readText();
    const matchResult = text.match(this.encryptedRegex);
    if (matchResult == null) {
      return;
    }

    text = matchResult[0];
    if (!text) {
      this.resetPlaceholder();
      return;
    }
    if (this.previous !== '' && this.previous === text) {
      return;
    }

    this.previous = text;
    this.win.webContents.send('updateLinkPlaceholder', { text });
  }
}

export default ClipboardWatcher;
