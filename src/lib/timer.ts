import {
  workspace,
  StatusBarItem,
  window,
  env,
  StatusBarAlignment,
} from "vscode";
import { ApiWrapper } from "./apiWrapper";
import { CreateTime, Task } from "../types";

export default class Timer {
  private _statusBarItem!: StatusBarItem;
  private _statusBarStartButton!: StatusBarItem;
  private _statusBarPauseButton!: StatusBarItem;
  private _timer!: NodeJS.Timeout;

  private task: Task;
  private apiWrapper: ApiWrapper;

  branchName: string | undefined;
  total = 0;
  constructor(task: Task, apiWrapper: ApiWrapper) {
    this.task = task;
    this.apiWrapper = apiWrapper;

    // create status bar items
    if (!this._statusBarItem) {
      this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
      this._statusBarItem.command = "clickup.copyTimer";
      this._statusBarItem.tooltip = "Copy Duration";
      this._statusBarItem.show();
    }
    if (!this._statusBarStartButton) {
      this._statusBarStartButton = window.createStatusBarItem(
        StatusBarAlignment.Left
      );
      this._statusBarStartButton.text = "$(triangle-right)";
      this._statusBarStartButton.command = "clickup.startTimer";
      this._statusBarStartButton.tooltip = "Start Timer";
    }
    if (!this._statusBarPauseButton) {
      this._statusBarPauseButton = window.createStatusBarItem(
        StatusBarAlignment.Left
      );
      this._statusBarPauseButton.text = "$(debug-pause)";
      this._statusBarPauseButton.command = "clickup.stopTimer";
      this._statusBarPauseButton.tooltip = "Pause Timer";
    }

    this._statusBarStartButton.show();
  }

  public get alarmMessage(): string {
    const config = workspace.getConfiguration("branch-timer");
    if (config.showAlarm) {
      return config.alarmMessage;
    }
    return "";
  }

  public start() {
    this.stop();
    this._statusBarItem.show();
    this._statusBarStartButton.hide();
    this._statusBarPauseButton.show();

    const data: CreateTime = {
      description: "test",
      tid: this.task.id,
      start: Date.now()
    };
    this.apiWrapper.startTime(this.task.team_id, undefined, data);
    this._timer = setInterval(() => {
      this.total++;
      const t = secondsToHms(this.total);
      this._statusBarItem.text = `${zeroBase(t.h)}:${zeroBase(t.m)}:${zeroBase(
        t.s
      )}`;
    }, 1000);
  }
  public showTimer() {
    this._statusBarItem.text = "00:00:00";
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
  public destroy() {
    console.log('destory');
    this._statusBarItem.hide();
    this._statusBarPauseButton.hide();
    this._statusBarStartButton.hide();
  }
}

export function secondsToHms(d: number) {
  const dCopy = Number(d);
  const h = Math.floor(dCopy / 3600);
  const m = Math.floor((dCopy % 3600) / 60);
  const s = Math.floor((dCopy % 3600) % 60);

  return {
    h: h,
    m: m,
    s: s,
  };
}
export function zeroBase(value: number) {
  return value < 10 ? `0${value}` : value;
}
