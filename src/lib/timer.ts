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
	private startDate: number | undefined;

	private task: Task;
	private apiWrapper: ApiWrapper;

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

	/**
	 *
	 *
	 * @private
	 * @param {*} [from=Date.now()]
	 * @memberof Timer
	 */
	private startCount(from = Date.now()) {
		this.startDate = from;

		this.stop();
		this._statusBarItem.show();
		this._statusBarStartButton.hide();
		this._statusBarPauseButton.show();

		this._timer = setInterval(() => {
			if (this.startDate) {
				this.startDate++;
				const durationFormatted = getFormattedDuration(this.startDate);
				this._statusBarItem.text = durationFormatted;
			}
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
				console.log('start counter', response);
			}).catch((error) => {
				console.log(`error: ${error}`);
			});
	}

	/**
	 *
	 *
	 * @memberof Timer
	 */
	public stop() {
		//TODO: API call to stop time
		this._statusBarStartButton.show();
		this._statusBarPauseButton.hide();
		clearInterval(this._timer);
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
		const durationFormatted = getFormattedDuration(startFrom);
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
 * @return {*} 
 */
function getFormattedDuration(from: number) {
	const millisecDurationToNow = dayjs(Date.now()).diff(dayjs(from));
	const duration = dayjs.duration(millisecDurationToNow);

	if (!dayjs.isDuration(duration)) {
		return DEFAULT_TIME;
	}
	return duration.format(FORMAT_TIME);
}