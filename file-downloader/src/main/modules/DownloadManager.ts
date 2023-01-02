import { BrowserWindow } from 'electron';
import electronDl from 'electron-dl';

class DownloadManager {
  private win: BrowserWindow;
  private mainEvent: Electron.IpcMainEvent;
  private urls: string[];
  private totalCnt: number;
  private downloadedCnt: number;

  constructor(
    mainEvent: Electron.IpcMainEvent,
    win: BrowserWindow,
    urls: string[]
  ) {
    this.mainEvent = mainEvent;
    this.win = win;
    this.urls = urls;
    this.totalCnt = urls.length;
    this.downloadedCnt = 0;
  }

  async downloads() {
    // eslint-disable-next-line no-restricted-syntax
    for await (const url of this.urls) {
      try {
        await electronDl.download(this.win, url, {
          openFolderWhenDone: this.downloadedCnt + 1 === this.totalCnt,
          showBadge: false,
          showProgressBar: false,
          onProgress: this.onProgressDown,
        });
      } catch (error) {
        console.log('[FAILURE] electronDl.download', error);
        //
      } finally {
        this.upDownloadedCnt();
        this.mainEvent.sender.send('download-progress', {
          progressPercent: 100,
          totalCnt: this.totalCnt,
          downloadedCnt: this.downloadedCnt,
        });
      }
    }
  }

  async download(url: string) {
    electronDl.download(this.win, url, {
      openFolderWhenDone: true,
      showBadge: false,
      showProgressBar: false,
      onProgress: (progress) => {
        const progressPercent = progress.percent * 100;
        this.mainEvent.sender.send('download-progress', {
          progressPercent,
          totalCnt: 1,
          downloadedCnt: this.downloadedCnt,
        });
      },
    });
    this.mainEvent.sender.send('download-progress', {
      progressPercent: 100,
      totalCnt: 1,
      downloadedCnt: 1,
    });
  }

  private upDownloadedCnt() {
    this.downloadedCnt += 1;
  }

  private onProgressDown = (progress: electronDl.Progress) => {
    const progressPercent = progress.percent * 100;
    this.mainEvent.sender.send('download-progress', {
      progressPercent,
      totalCnt: this.totalCnt,
      downloadedCnt: this.downloadedCnt,
    });
  };
}

export default DownloadManager;
