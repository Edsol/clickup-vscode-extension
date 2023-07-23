import {
  workspace,
  StatusBarItem,
  window,
  env,
  StatusBarAlignment,
} from "vscode";

export default class Timer {
  private _statusBarItem!: StatusBarItem;
  private _statusBarStartButton!: StatusBarItem;
  private _statusBarPauseButton!: StatusBarItem;
  private _timer!: NodeJS.Timer;
  branchName: string | undefined;
  total = 0;
  constructor(branch: string) {
    this.branchName = branch;

    // create status bar items
    if (!this._statusBarItem) {
      this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
      this._statusBarItem.command = "extension.copyTimer";
      this._statusBarItem.tooltip = "Copy Duration";
      this._statusBarItem.show();
    }
    if (!this._statusBarStartButton) {
      this._statusBarStartButton = window.createStatusBarItem(
        StatusBarAlignment.Left
      );
      this._statusBarStartButton.text = "$(triangle-right)";
      this._statusBarStartButton.command = "extension.startTimer";
      this._statusBarStartButton.tooltip = "Start Timer";
    }
    if (!this._statusBarPauseButton) {
      this._statusBarPauseButton = window.createStatusBarItem(
        StatusBarAlignment.Left
      );
      this._statusBarPauseButton.text = "$(debug-pause)";
      this._statusBarPauseButton.command = "extension.stopTimer";
      this._statusBarPauseButton.tooltip = "Pause Timer";
    }

    this._statusBarStartButton.show();
  }

  public get alarmMessage(): string {
    let config = workspace.getConfiguration("branch-timer");
    if (config.showAlarm) {
      return config.alarmMessage;
    } else {
      return "";
    }
  }

  public start() {
    this._statusBarItem.show();
    this._statusBarStartButton.hide();
    this._statusBarPauseButton.show();
    this._timer = setInterval(() => {
      this.total++;
      let t = secondsToHms(this.total);
      this._statusBarItem.text = `${zeroBase(t.h)}:${zeroBase(t.m)}:${zeroBase(
        t.s
      )}`;
    }, 1000);
  }
  public showTimer() {
    this._statusBarItem.text = `00:00:00`;
    this._statusBarItem.show();
  }

  public copyTimer() {
    env.clipboard.writeText(`${this.branchName} ${this._statusBarItem.text}`);
  }
  public stop() {
    this._statusBarStartButton.show();
    this._statusBarPauseButton.hide();
    clearInterval(this._timer);
  }
}

export function secondsToHms(d: number) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  return {
    h: h,
    m: m,
    s: s,
  };
}
export function zeroBase(value: number) {
  return value < 10 ? `0${value}` : value;
}
