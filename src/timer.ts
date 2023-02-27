import path = require('path');
import { workspace, StatusBarItem, window, StatusBarAlignment,} from 'vscode';
const fs = require('fs');

export default class Timer {
  private _statusBarItem!: StatusBarItem;
  private _timer!: NodeJS.Timer;
  branchName:string | undefined;
  total = 0;
  constructor(branch:string) {
    this.branchName = branch;
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
      return "";
    }
  }

  public start() {
    this._statusBarItem.text = `00:00:00`;
    this._statusBarItem.show();
    this._timer = setInterval(() => {
      this.total++;
      let t = this.secondsToHms(this.total);
      this._statusBarItem.text = `${this.branchName} ${this._zeroBase(t.h)}:${this._zeroBase(t.m)}:${this._zeroBase(t.s)}`
    }, 1000);
  }

  public stop() {
    clearInterval(this._timer);
    if (this._statusBarItem) {
      this._statusBarItem.hide();
    }
  }

  public secondsToHms(d:number) {
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

  private _zeroBase(value:number) {
    return value < 10 ? `0${value}` : value;
  }
}