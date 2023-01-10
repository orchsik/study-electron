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

    const text = clipboard.readText();
    if (!text) {
      this.resetPlaceholder();
      return;
    }
    if (this.checkEqualValue(text)) {
      return;
    }

    this.previous = text;

    const matchResult = text.match(this.encryptedRegex);
    if (matchResult == null) {
      return;
    }
    this.win.webContents.send('updateLinkPlaceholder', {
      text: matchResult[0],
    });
  }

  private checkEqualValue = (text: string) =>
    this.previous !== '' && this.previous === text;
}

export default ClipboardWatcher;
