import { workspace, StatusBarItem, window, StatusBarAlignment } from 'vscode';

export default class Timer {
  private _statusBarItem: StatusBarItem;
  private _timer: NodeJS.Timer;

  constructor() {
    if (!this._statusBarItem) {
      this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
      this._statusBarItem.text = '00:00';
    }
  }

  public get alarmMessage(): string {
    let config = workspace.getConfiguration('simpleTimer');
    if (config.showAlarm) {
      return config.alarmMessage;
    } else {
      return null;
    }
  }

  public start() {
    this._statusBarItem.text = `00:00:00`;
    this._statusBarItem.show();

    let total = 0;
    this._timer = setInterval(() => {
      total++;
      let t = this.secondsToHms(total);

      this._statusBarItem.text = `${this._zeroBase(t.h)}:${this._zeroBase(t.m)}:${this._zeroBase(t.s)}`;

      // if (t.total <= 0) {
      //   clearInterval(this._timer);
      //   this._statusBarItem.hide();

      //   if (this.alarmMessage) {
      //     window.showInformationMessage(this.alarmMessage);
      //   }
      // }
    }, 1000);
  }

  public stop() {
    clearInterval(this._timer);
    if (this._statusBarItem) {
      this._statusBarItem.hide();
    }
  }

  public secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return {
      h:h,
      m:m,
      s:s
    }; 
}

  private _zeroBase(value) {
    return value < 10 ? `0${value}` : value;
  }
}