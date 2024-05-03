import {
	workspace,
	StatusBarItem,
	window,
	env,
	StatusBarAlignment,
} from "vscode";
import { ApiWrapper } from "./apiWrapper";
import { CreateTime, Task } from "../types";

const DEFAULT_TIME = "00:00:00";
const FORMAT_TIME = "HH:mm:ss";

const dayjs = require("dayjs");
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

export default class Timer {
	private _statusBarItem!: StatusBarItem;
	private _statusBarStartButton!: StatusBarItem;
	private _statusBarPauseButton!: StatusBarItem;

	private _timer!: NodeJS.Timeout;
	private startDate: number;

	private task: Task;
	private apiWrapper: ApiWrapper;

	private startCallback?: CallableFunction;
	private stopCallback?: CallableFunction;

	constructor(task: Task, apiWrapper: ApiWrapper, startCallback?: CallableFunction, stopCallback?: CallableFunction) {
		this.task = task;
		this.apiWrapper = apiWrapper;
		this.startDate = 0;

		this.startCallback = startCallback;
		this.stopCallback = stopCallback;

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

	/**
	 *
	 *
	 * @private
	 * @param {*} [from=Date.now()]
	 * @memberof Timer
	 */
	private startCount(from = Date.now()) {
		this.startDate = from;

		if (this.startDate === undefined) {
			return;
		}

		this._statusBarItem.show();
		this._statusBarStartButton.hide();
		this._statusBarPauseButton.show();

		this._timer = setInterval(() => {
			this.startDate++;
			const durationFormatted = getFormattedDurationBetween(this.startDate);
			this._statusBarItem.text = durationFormatted;
		}, 1000);
	}
	/**
	 *
	 *
	 * @memberof Timer
	 */
	public async start() {
		const data: CreateTime = {
			billable: false,
			tid: this.task.id,
			fromTimesheet: false,
			start: Date.now(),
			duration: -1,
		};
		this.apiWrapper.startTime(this.task.team_id, data)
			.then((response) => {
				this.startCount();
				console.log('start function response', response);
				if (this.startCallback) {
					this.startCallback();
				}
			}).catch((error) => {
				console.log(`error start function: ${error}`);
			});
	}

	/**
	 *
	 *
	 * @memberof Timer
	 */
	public stop() {
		this.apiWrapper.stopTime(this.task.team_id)
			.then((response) => {
				console.log('stop function response', response);
				this._statusBarStartButton.show();
				this._statusBarPauseButton.hide();
				clearInterval(this._timer);
				if (this.stopCallback) {
					this.stopCallback();
				}
			}).catch((error) => {
				console.log(`stop end function: ${error}`);
			});
	}

	/**
	 *
	 *
	 * @param {*} [time=DEFAULT_TIME]
	 * @memberof Timer
	 */
	public showTimer(time = DEFAULT_TIME) {
		this._statusBarItem.text = time;
		this._statusBarItem.show();
	}

	/**
	 *
	 *
	 * @param {number} startFrom
	 * @param {boolean} [andStart=false]
	 * @memberof Timer
	 */
	public restore(startFrom: number) {
		const durationFormatted = getFormattedDurationBetween(startFrom);
		this.showTimer(durationFormatted);
		this.startCount(startFrom);
	}

	/**
	 *
	 *
	 * @memberof Timer
	 */
	public copyTimer() {
		env.clipboard.writeText(`${this._statusBarItem.text}`);
	}

	/**
	 *
	 *
	 * @memberof Timer
	 */
	public destroy() {
		this._statusBarItem.hide();
		this._statusBarPauseButton.hide();
		this._statusBarStartButton.hide();
	}
}

/**
 *
 *
 * @private
 * @param {number} unixtime
 * @return {*} 
 * @memberof TimesListProvider
 */
export function unixtimeToString(unixtime: number) {
	const date = unixtimeToDate(unixtime);
	return date.toLocaleString(env.language);
}

/**
 *
 *
 * @export
 * @param {number} unixtime
 * @return {*} 
 */
export function unixtimeToDate(unixtime: number) {
	return new Date(unixtime * 1);
}

/**
 *
 *
 * @param {number} from
 * @param {number} to
 * @return {*} 
 */
export function getFormattedDurationBetween(from: number, to: number = Date.now()) {
	const millisecDurationToNow = dayjs(to).diff(dayjs(from));
	return formatDuration(millisecDurationToNow);
}

export function formatDuration(inputDuration: number) {
	const duration = dayjs.duration(inputDuration);

	if (!dayjs.isDuration(duration)) {
		return DEFAULT_TIME;
	}
	return duration.format(FORMAT_TIME);
}