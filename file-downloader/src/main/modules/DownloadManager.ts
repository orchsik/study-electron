import path from 'path';
import { BrowserWindow, IpcMainEvent } from 'electron';
import electronDl, { Progress } from 'electron-dl';

export type UrlData = {
  [group: string]: string[];
};

const urlRegex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
const isURL = (text: string) => text.match(urlRegex);

class DownloadManager {
  private win: BrowserWindow;
  private totalCnt: number;
  private downloadedCnt: number;
  private errorCnt: number;
  private stopFlag = false;

  constructor(win: BrowserWindow) {
    this.win = win;
    this.totalCnt = 0;
    this.downloadedCnt = 0;
    this.errorCnt = 0;
  }

  init() {
    this.totalCnt = 0;
    this.downloadedCnt = 0;
    this.errorCnt = 0;
    this.stopFlag = false;
  }

  stop() {
    this.stopFlag = true;
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
        if (this.stopFlag) break;
        try {
          if (!isURL(url)) {
            throw Error('유효하지 않은 URL 입니다.');
          }

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
          ++this.errorCnt;
          console.log('[FAILURE] electronDl.download', error);
          //
        } finally {
          ++this.downloadedCnt;
          mainEvent.sender.send('download-progress', {
            progressPercent: 100,
            totalCnt: this.totalCnt,
            downloadedCnt: this.downloadedCnt,
            errorCnt: this.errorCnt,
          });
        }
      }
    }

    mainEvent.sender.send('download-flushed');
  }

  async download({ mainEvent, url }: { mainEvent: IpcMainEvent; url: string }) {
    electronDl.download(this.win, url, {
      openFolderWhenDone: true,
      showBadge: false,
      showProgressBar: false,
      onProgress: (progress) => {
        const progressPercent = this.progressPercentFor(progress);
        mainEvent.sender.send('download-progress', { progressPercent });
      },
    });
    mainEvent.sender.send('download-progress', { progressPercent: 100 });
  }

  private progressPercentFor = (progress: Progress) => progress.percent * 100;
}

export default DownloadManager;
