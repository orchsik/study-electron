import path from 'path';
import { BrowserWindow, IpcMainEvent } from 'electron';
import electronDl, { Progress } from 'electron-dl';

export type UrlData = {
  [group: string]: string[];
};

class DownloadManager {
  private win: BrowserWindow;
  private totalCnt: number;
  private downloadedCnt: number;

  constructor(win: BrowserWindow) {
    this.win = win;
    this.totalCnt = 0;
    this.downloadedCnt = 0;
  }

  init() {
    this.totalCnt = 0;
    this.downloadedCnt = 0;
  }

  async downloads({
    mainEvent,
    directory,
    urlData,
    totalCnt,
  }: {
    mainEvent: IpcMainEvent;
    directory: string;
    urlData: UrlData;
    totalCnt?: number;
  }) {
    if (totalCnt) {
      this.totalCnt = totalCnt;
    }

    for await (const [group, urls] of Object.entries(urlData)) {
      for await (const url of urls) {
        try {
          await electronDl.download(this.win, url, {
            directory: `${directory}${path.sep}${group}`,
            openFolderWhenDone: this.downloadedCnt + 1 === this.totalCnt,
            showBadge: false,
            showProgressBar: false,
            onProgress: (progress) => {
              const progressPercent = this.progressPercentFor(progress);
              mainEvent.sender.send('download-progress', {
                progressPercent,
                totalCnt: this.totalCnt,
                downloadedCnt: this.downloadedCnt,
              });
            },
            overwrite: true,
          });
        } catch (error) {
          console.log('[FAILURE] electronDl.download', error);
          //
        } finally {
          this.upDownloadedCnt();
          mainEvent.sender.send('download-progress', {
            progressPercent: 100,
            totalCnt: this.totalCnt,
            downloadedCnt: this.downloadedCnt,
          });
        }
      }
    }

    mainEvent.sender.send('finish-download');
  }

  async download({ mainEvent, url }: { mainEvent: IpcMainEvent; url: string }) {
    electronDl.download(this.win, url, {
      openFolderWhenDone: true,
      showBadge: false,
      showProgressBar: false,
      onProgress: (progress) => {
        const progressPercent = this.progressPercentFor(progress);
        mainEvent.sender.send('download-progress', {
          progressPercent,
          totalCnt: 1,
          downloadedCnt: this.downloadedCnt,
        });
      },
    });
    mainEvent.sender.send('download-progress', {
      progressPercent: 100,
      totalCnt: 1,
      downloadedCnt: 1,
    });
  }

  private upDownloadedCnt() {
    this.downloadedCnt += 1;
  }

  private progressPercentFor = (progress: Progress) => progress.percent * 100;
}

export default DownloadManager;
