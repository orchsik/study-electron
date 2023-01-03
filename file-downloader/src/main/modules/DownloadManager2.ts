import path from 'path';
import { app, BrowserWindow } from 'electron';
import electronDl from 'electron-dl';

export type UrlData = {
  [group: string]: string[];
};

class DownloadManager2 {
  private win: BrowserWindow;
  private mainEvent: Electron.IpcMainEvent;
  private IpsiYear: string;
  private IpsiGubun: string;
  private urlData: UrlData;
  private totalCnt: number;
  private downloadedCnt: number;

  constructor(
    mainEvent: Electron.IpcMainEvent,
    win: BrowserWindow,
    IpsiYear: string,
    IpsiGubun: string,
    urlData: UrlData
  ) {
    this.mainEvent = mainEvent;
    this.win = win;
    this.IpsiYear = IpsiYear;
    this.IpsiGubun = IpsiGubun;
    this.urlData = urlData;
    this.totalCnt = Object.values(urlData).reduce(
      (acc, items) => acc + items.length || 0,
      0
    );
    this.downloadedCnt = 0;
  }

  async downloads() {
    for await (const [group, urls] of Object.entries(this.urlData)) {
      for await (const url of urls) {
        try {
          await electronDl.download(this.win, url, {
            directory: `${app.getPath('downloads')}${path.sep}RMSA${path.sep}${
              this.IpsiYear
            }${path.sep}${this.IpsiGubun}${path.sep}${group}`,
            openFolderWhenDone: this.downloadedCnt + 1 === this.totalCnt,
            showBadge: false,
            showProgressBar: false,
            onProgress: this.onProgressDown,
            overwrite: true,
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

export default DownloadManager2;
